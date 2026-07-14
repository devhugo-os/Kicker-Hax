const APK_URL = 'https://devhugo-os.github.io/Kicker-Hax/downloads/kicker-hax.apk';

export function isNativeAppFrame() {
  const params = new URLSearchParams(window.location.search);
  return params.get('native') === '1' && window.parent !== window;
}

export function requestAppDownload(url = APK_URL) {
  if (isNativeAppFrame()) {
    window.parent.postMessage({ type: 'KICKER_HAX_DOWNLOAD_UPDATE', url }, '*');
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function notifyNativeUpdate(version) {
  if (!isNativeAppFrame()) return;
  window.parent.postMessage({ type: 'KICKER_HAX_UPDATE_AVAILABLE', version: String(version || '') }, '*');
}

export { APK_URL };
