# QR Code Generator

A dark-themed QR code generator. Enter a web address, preview the code, and download a PNG.

**[Open the web app](https://joshwils-cell.github.io/qr-code-generator/)**

## Web app

The GitHub Pages edition lives in `docs/`. QR codes are generated entirely in your browser with a bundled copy of the `qrcode` JavaScript library. Entered addresses are not sent to a QR service or checked by contacting the destination. GitHub hosts the page and may log ordinary page requests.

- Accepts HTTP and HTTPS addresses and adds `https://` to bare domains.
- Shows the exact address encoded and clears the previous code when you edit it.
- Downloads a descriptively named PNG, such as `qr-example-com-about.png`, with high error correction and a four-module white border. Filenames come from the website domain and page path. Query parameters and fragments are excluded from filenames; the QR code still contains the complete address.
- Uses no account, database, external fonts, or runtime CDN dependencies.

### Do these QR codes expire?

No. These are **static QR codes**: each code stores the web address directly in the image and has no built-in expiration date. Once you download or print a code, it does not depend on this generator staying online, an account, or a subscription.

The code will continue to point to the same address as long as the image remains readable. To open the intended page, the person scanning it needs access to the internet (or the relevant network), and that page must remain available at the encoded address. Keeping a website published is enough only if that specific address still works. If the page moves, a redirect from the original address can keep an existing code useful; otherwise, generate a new code for the new address.

You can update the content of a page without changing its QR code, provided its address stays the same. The destination stored in an already downloaded or printed code cannot be edited through this app. Before sharing a code, scan it to confirm that it opens the intended page.

### Maintaining the web app

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
