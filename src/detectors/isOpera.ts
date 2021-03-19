interface IOperaWindow extends Window {
  opera?: unknown;
  opr?: {
    addons: unknown;
  };
}

export default function isOpera(): boolean {
  if (!window) return false;

  return (
    !!(window as IOperaWindow).opera
    || (!!(window as IOperaWindow).opr && !!(window as IOperaWindow).opr.addons)
    || navigator.userAgent.indexOf(' OPR/') >= 0
  );
}
