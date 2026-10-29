'use strict';

const form = document.querySelector('#form');
const input = document.querySelector('#url');
const button = document.querySelector('#generate');
const qr = document.querySelector('#qr');
const empty = document.querySelector('#empty');
const encoded = document.querySelector('#encoded');
const download = document.querySelector('#download');
const error = document.querySelector('#error');
const preview = document.querySelector('.preview');
let revision = 0;
let objectURL = null;

function normalizeURL(value) {
  let url = value.trim();
  if (!url) throw new Error('Enter a web address to get started.');
  if (/[\s\x00-\x1f\x7f\\]/u.test(url)) {
    throw new Error('Enter a valid web address without spaces or backslashes.');
  }
  if (new TextEncoder().encode(url).length > 4096) {
    throw new Error('This address is too long to encode. Try a shorter link.');
  }
  if (!url.includes('://')) {
    const first = url.split('/')[0];
    if (first.includes(':') && !/:[0-9]+$/.test(first) && !first.startsWith('[')) {
      throw new Error('Use an HTTP or HTTPS web address.');
    }
    url = 'https://' + url;
  }
  let parsed;
  try { parsed = new URL(url); }
  catch { throw new Error('Enter a valid web address, such as example.com.'); }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Use an HTTP or HTTPS web address.');
  }
  if (parsed.username || parsed.password) {
    throw new Error('Enter a valid web address without a username or password.');
  }
  const host = parsed.hostname.replace(/\.$/, '');
  if (!host.startsWith('[')) {
    const labels = host.split('.');
    if (host !== 'localhost' && labels.length < 2) {
      throw new Error('Enter a full website address, such as example.com.');
    }
    if (labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) {
      throw new Error('Enter a valid website name, such as example.com.');
    }
  }
  return url;
}

function clearPreview() {
  qr.hidden = true;
  qr.removeAttribute('src');
  empty.hidden = false;
  download.hidden = true;
  download.removeAttribute('href');
  if (objectURL) {
    URL.revokeObjectURL(objectURL);
    objectURL = null;
  }
  encoded.textContent = 'Your next link, one scan away.';
}

input.addEventListener('input', () => {
  revision++;
  clearPreview();
  error.hidden = true;
  button.disabled = false;
  preview.setAttribute('aria-busy', 'false');
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const current = ++revision;
  clearPreview();
  error.hidden = true;
  button.disabled = true;
  preview.setAttribute('aria-busy', 'true');
  encoded.textContent = 'Creating your QR code…';
  try {
    const url = normalizeURL(input.value);
    if (typeof QRCode === 'undefined') {
      throw new Error('The QR library could not load. Refresh the page and try again.');
    }
    let png;
    try {
      png = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H', margin: 4, scale: 10,
        color: { dark: '#000000ff', light: '#ffffffff' },
        type: 'image/png'
      });
    } catch {
      throw new Error('This address is too long to encode. Try a shorter link.');
    }
    if (current !== revision) return;
    const bytes = Uint8Array.from(atob(png.split(',')[1]), c => c.charCodeAt(0));
    objectURL = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
    qr.src = objectURL;
    qr.hidden = false;
    empty.hidden = true;
    encoded.textContent = url;
    download.href = objectURL;
    download.hidden = false;
  } catch (problem) {
    if (current !== revision) return;
    clearPreview();
    error.textContent = problem.message || 'Could not create the QR code. Please try again.';
    error.hidden = false;
  } finally {
    if (current === revision) {
      button.disabled = false;
      preview.setAttribute('aria-busy', 'false');
    }
  }
});
