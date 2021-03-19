export default function isWin(): boolean {
  return window && navigator.platform.indexOf('Win') !== -1;
}
