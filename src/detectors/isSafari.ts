interface ISafariWindow extends Window {
  safari?: {
    pushNotification?: unknown;
  };
}

export default function isSafari(): boolean {
  if (!window || !(window as ISafariWindow).safari) return false;

  return (window as ISafariWindow).safari.pushNotification.toString() === '[object SafariRemoteNotification]';
}
