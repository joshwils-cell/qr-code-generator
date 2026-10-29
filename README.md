# QR Code Generator

A dark-themed QR code generator. Enter a web address, preview the code, and download a PNG.

**[Open the web app](https://joshwils-cell.github.io/qr-code-generator/)**

## Web app

The GitHub Pages edition lives in `docs/`. QR codes are generated entirely in your browser with a bundled copy of the `qrcode` JavaScript library. Entered addresses are not sent to a QR service or checked by contacting the destination. GitHub hosts the page and may log ordinary page requests.

- Accepts HTTP and HTTPS addresses and adds `https://` to bare domains.
- Shows the exact address encoded and clears the previous code when you edit it.
- Downloads `qr-code.png` with high error correction and a four-module white border.
- Uses no account, database, external fonts, or runtime CDN dependencies.

The QR code encodes its destination directly, with no built-in expiration or editable redirect. A destination website must still remain available.

GitHub Pages publishes `docs/` from `main`. To change the web interface, edit `docs/index.html` or `docs/app.js` and push to `main`. The bundled QR library is already committed. To rebuild that bundle, install Node.js, then run:

```sh
npm ci
npm run build
npm run check
```

Third-party notices are in `docs/vendor/THIRD-PARTY-LICENSES.txt`.

## Local Python edition (Windows)

Requires Python 3.10 or newer. Double-click **Start QR Code Generator.cmd**. The launcher creates a dedicated `.venv`, installs dependencies on first launch, and opens the app in your default browser. The app binds only to `127.0.0.1`. After setup, QR generation works offline.

Keep the launcher window open while using the app. Press Ctrl+C in that window to stop it. See `README.txt` for more instructions.

The Python edition uses Flask, Waitress, Pillow, and Python `qrcode`. The web and Python editions share the same design and task flow, with separate QR implementations for their respective environments.
