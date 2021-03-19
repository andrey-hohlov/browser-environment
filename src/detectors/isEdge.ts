import isIE from './isIE';

export default function isEdge(): boolean {
  return window && !isIE() && !!window.StyleMedia;
}
