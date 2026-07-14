export function isMobilePhoneDevice(navigatorLike = globalThis.navigator) {
  if (typeof navigatorLike?.userAgentData?.mobile === 'boolean') {
    return navigatorLike.userAgentData.mobile;
  }
  const userAgent = String(navigatorLike?.userAgent || '');
  if (/iPhone|iPod|IEMobile|Opera Mini/i.test(userAgent)) return true;
  return /Android/i.test(userAgent) && /Mobile/i.test(userAgent);
}

/** Selects the touch HUD from device capabilities, never from viewport size. */
export function shouldUseMobileHud(navigatorLike = globalThis.navigator, runtime = {}) {
  const nativeApp = !!runtime.cordova || new URLSearchParams(String(runtime.search || '')).get('app') === '1';
  const coarsePointer = typeof runtime.coarsePointer === 'boolean' ? runtime.coarsePointer : false;
  const touchHardware = Number(navigatorLike?.maxTouchPoints || 0) > 0 && coarsePointer;
  const userAgent = String(navigatorLike?.userAgent || '');
  const mobileOrTabletUA = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(userAgent);
  return nativeApp || mobileOrTabletUA || touchHardware;
}
