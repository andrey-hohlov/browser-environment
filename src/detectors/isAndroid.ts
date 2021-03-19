export default function isAndroid(): boolean {
  return window && /Android/.test(navigator.userAgent);
}
