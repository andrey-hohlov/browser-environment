export default function isTouchScreen(): boolean {
  return window && 'ontouchstart' in window;
}
