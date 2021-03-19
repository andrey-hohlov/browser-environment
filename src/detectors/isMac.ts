import isIPad from './isIPad';
import isIPhone from './isIPhone';
import isIPod from './isIPod';

export default function isMac(): boolean {
  return window && !isIPhone() && !isIPad() && !isIPod() && navigator.platform.indexOf('Mac') !== -1;
}
