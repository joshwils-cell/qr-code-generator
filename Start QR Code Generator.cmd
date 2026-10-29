@echo off
setlocal
cd /d "%~dp0"
title QR Code Generator
if exist ".venv\Scripts\python.exe" goto install
where py >nul 2>nul
if not errorlevel 1 (
    py -3 -m venv .venv
) else (
    python -m venv .venv
)
if errorlevel 1 goto failed
:install
if exist ".venv\qr-setup-complete" goto launch
".venv\Scripts\python.exe" -m pip --version >nul 2>nul
if errorlevel 1 (
    ".venv\Scripts\python.exe" -m ensurepip --upgrade --default-pip
    if errorlevel 1 goto failed
)
echo Setting up QR Code Generator. Internet access is needed on first launch.
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto failed
type nul > ".venv\qr-setup-complete"
:launch
".venv\Scripts\python.exe" app.py
if errorlevel 1 goto failed
exit /b 0
:failed
echo.
echo The app could not start. Check the message above.
echo First-time setup requires Python 3.10 or newer and internet access.
echo You can download Python from https://www.python.org/downloads/
pause
exit /b 1
