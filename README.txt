QR CODE GENERATOR

START
1. If using the ZIP, extract the whole ZIP folder first.
2. Double-click "Start QR Code Generator.cmd".
3. First launch installs dependencies in the app's own .venv folder. This
   requires internet access and Python 3.10 or newer. Later launches work offline.
4. Your default browser opens the app. Keep the launcher window open while using it.

CREATE A QR CODE
Enter a website address and click Generate QR Code (or press Enter).
Addresses without a scheme receive https:// automatically. Check the address
shown below the preview, then click Download PNG to save qr-code.png.
Your browser controls the download location and may append a number if a file
with that name already exists. Scan the saved image with your phone to check it.

STOP
In the launcher window, press Ctrl+C. If Windows asks whether to terminate the
batch job, type Y and press Enter. You can then close the browser tab.

NOTES
The app runs only on this computer at a local 127.0.0.1 address. The port can
change each time; use the browser tab opened by the launcher.
QR images are generated in memory. The app does not keep a history or contact
the entered website. Opening a scanned link still requires access to that site.
The destination is encoded directly. The QR code has no built-in expiration;
it continues to point to the same address, even if the website later changes.

TROUBLESHOOTING
If the browser does not open, copy the local address printed in the launcher.
If setup fails, check internet access and run the launcher again.
After changing requirements.txt, remove .venv\qr-setup-complete to rerun setup.
Keep all supplied files together. To move the app to another computer, use the
original ZIP so the new computer creates its own Python environment.
