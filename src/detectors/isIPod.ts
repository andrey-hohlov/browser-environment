export default function isIPod(): boolean {
  return window && navigator.userAgent.indexOf('iPod') !== -1;
}
