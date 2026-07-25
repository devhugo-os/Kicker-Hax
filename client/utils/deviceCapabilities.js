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
  // Mobile GPUs are often the limiting factor even when Android reports eight
  // CPU cores and plenty of RAM. Use the cached/light compositor path for every
  // real touch HUD instead of misclassifying mid-range phones as desktop GPUs.
  const lowEffects = mobileHud;
  // Keep animation at the display cadence. Lowering weak phones to 36 FPS
  // made input and interpolation visibly stutter; cosmetic work is throttled
  // separately instead of dropping gameplay frames.
  const targetRenderFps = 60;
  return {
    mobileHud,
    lowEffects,
    targetRenderFps,
    minRenderFps: 60,
    maxRenderFps: 60,
    hudIntervalMs: lowEffects ? 200 : 75
  };
}
