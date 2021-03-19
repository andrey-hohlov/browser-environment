import { ViewportSize } from '../types';

export default function getViewport(): ViewportSize {
  if (!window) return { width: 0, height: 0 };

  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  };
}
