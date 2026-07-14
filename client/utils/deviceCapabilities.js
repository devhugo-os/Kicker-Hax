export function isMobilePhoneDevice(navigatorLike = globalThis.navigator) {
  if (typeof navigatorLike?.userAgentData?.mobile === 'boolean') {
    return navigatorLike.userAgentData.mobile;
  }
  const userAgent = String(navigatorLike?.userAgent || '');
  if (/iPhone|iPod|IEMobile|Opera Mini/i.test(userAgent)) return true;
  return /Android/i.test(userAgent) && /Mobile/i.test(userAgent);
}
