export default function isIPhone(): boolean {
  return window && navigator.userAgent.indexOf('iPhone') !== -1;
}
