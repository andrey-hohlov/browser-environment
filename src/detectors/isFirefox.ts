interface IFirefoxWindow extends Window {
  InstallTrigger?: unknown;
}

export default function isFirefox(): boolean {
  return window && typeof (window as IFirefoxWindow).InstallTrigger !== 'undefined';
}
