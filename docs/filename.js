/* Shared by the local Python edition and the GitHub Pages edition. */
(() => {
  'use strict';
  function slug(value) {
    return value.normalize('NFKD').replace(/\p{M}/gu, '')
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
  }
  function filename(address) {
    const url = new URL(address);
    const host = slug(url.hostname.replace(/^www\./i, '')).slice(0, 60).replace(/-+$/g, '') || 'website';
    let path = url.pathname;
    try { path = decodeURIComponent(path); } catch { /* Keep malformed escapes readable. */ }
    const label = slug(path).slice(0, 70).replace(/-+$/g, '');
    return 'qr-' + host + (label ? '-' + label : '') + '.png';
  }
  globalThis.QRDownload = { filename };
})();
