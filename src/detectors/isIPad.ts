export default function isIPad(): boolean {
  return window && navigator.userAgent.includes('Mac') && 'ontouchend' in document;
}
