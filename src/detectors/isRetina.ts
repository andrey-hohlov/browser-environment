export default function isRetina(): boolean {
  return window && window.devicePixelRatio > 1;
}
