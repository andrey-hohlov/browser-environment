import isOpera from './isOpera';

export default function isChrome(): boolean {
  if (!window) return false;
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !isOpera();
}
