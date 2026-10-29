"""Local QR Code Generator. Run with Start QR Code Generator.cmd."""
import base64
import io
import ipaddress
import threading
import webbrowser
from urllib.parse import urlsplit

import qrcode
from flask import Flask, jsonify, render_template, request, send_from_directory
from qrcode.exceptions import DataOverflowError
from waitress import create_server

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16384


def normalize_url(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError('Enter a web address to get started.')
    value = value.strip()
    if any(c.isspace() or ord(c) < 32 for c in value) or '\\' in value:
        raise ValueError('Enter a valid web address without spaces or backslashes.')
    if len(value.encode('utf-8')) > 4096:
        raise ValueError('This address is too long to encode. Try a shorter link.')
    if '://' not in value:
        # A colon may belong to a port, but never to another URL scheme.
        first = value.split('/', 1)[0]
        if ':' in first and not first.rsplit(':', 1)[-1].isdigit() and not first.startswith('['):
            raise ValueError('Use an HTTP or HTTPS web address.')
        value = 'https://' + value
    try:
        parts = urlsplit(value)
        if parts.scheme.lower() not in ('http', 'https'):
            raise ValueError('Use an HTTP or HTTPS web address.')
        host = parts.hostname
        if not host or parts.username is not None or parts.password is not None:
            raise ValueError('Enter a valid web address without a username or password.')
        parts.port  # Validates the port range and format.
        try:
            ipaddress.ip_address(host)
        except ValueError:
            import re
            labels = host.rstrip('.').encode('idna').decode('ascii').split('.')
            if host.lower() != 'localhost' and len(labels) < 2:
                raise ValueError('Enter a full website address, such as example.com.')
            if any(not re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?', label) for label in labels):
                raise ValueError('Enter a valid website name, such as example.com.')
    except (UnicodeError, ValueError) as exc:
        raise ValueError(str(exc) if isinstance(exc, ValueError) else 'Enter a valid website name.') from exc
    return value


@app.get('/')
def index():
    return render_template('index.html')


@app.post('/generate')
def generate():
    data = request.get_json(silent=True)
    try:
        url = normalize_url(data.get('url') if isinstance(data, dict) else None)
        qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H,
                           box_size=10, border=4)
        qr.add_data(url)
        try:
            qr.make(fit=True)
        except (DataOverflowError, ValueError) as exc:
            raise DataOverflowError('Address exceeds QR capacity.') from exc
        image = qr.make_image(fill_color='black', back_color='white')
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        return jsonify(url=url, png=base64.b64encode(buffer.getvalue()).decode('ascii'))
    except DataOverflowError:
        return jsonify(error='This address is too long to encode. Try a shorter link.'), 400
    except ValueError as exc:
        return jsonify(error=str(exc)), 400


@app.get('/filename.js')
def filename_script():
    from pathlib import Path
    return send_from_directory(Path(__file__).resolve().parent / 'docs', 'filename.js')


@app.errorhandler(413)
def too_large(_error):
    return jsonify(error='This address is too long to encode. Try a shorter link.'), 413


@app.after_request
def no_cache(response):
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response


if __name__ == '__main__':
    # Port zero selects a free local port, avoiding conflicts with other apps.
    server = create_server(app, host='127.0.0.1', port=0)
    address = f'http://127.0.0.1:{server.effective_port}'
    print(f'QR Code Generator is ready: {address}', flush=True)
    print('Keep this window open. Press Ctrl+C to stop the app.', flush=True)
    threading.Timer(0.5, lambda: webbrowser.open(address)).start()
    try:
        server.run()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
