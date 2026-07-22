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

/**
 * Chooses a conservative canvas budget from real device capabilities. Physics
 * remains at 60 Hz; only rendering and cosmetic work are reduced on weak phones.
 */
export function getMatchPerformanceProfile(navigatorLike = globalThis.navigator, runtime = {}) {
  const mobileHud = shouldUseMobileHud(navigatorLike, runtime);
  const nativeApp = !!runtime.cordova || new URLSearchParams(String(runtime.search || '')).get('app') === '1';
  const memory = Number(navigatorLike?.deviceMemory || 0);
  const cores = Number(navigatorLike?.hardwareConcurrency || 0);
  const constrained = mobileHud && ((memory > 0 && memory <= 4) || (cores > 0 && cores <= 4));
  const lowEffects = mobileHud && (nativeApp || constrained);
  return {
    mobileHud,
    lowEffects,
    targetRenderFps: constrained ? 36 : mobileHud ? 45 : 60,
    hudIntervalMs: lowEffects ? 125 : 50
  };
}
