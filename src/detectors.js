export function iPad() {
  return window && navigator.userAgent.includes('Mac') && 'ontouchend' in document;
}

export function iPhone() {
  return window && navigator.userAgent.indexOf('iPhone') !== -1;
}

export function iPod() {
  return window && navigator.userAgent.indexOf('iPod') !== -1;
}

// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios

const iOSPlatforms = [
  'iPad Simulator',
  'iPhone Simulator',
  'iPod Simulator',
  'iPad',
  'iPhone',
  'iPod',
];

export function iOS() {
  return window && (iOSPlatforms.includes(navigator.platform) || iPad());
}

export function android() {
  return window && /Android/.test(navigator.userAgent);
}

export function mac() {
  return window && !iPhone() && !iPad() && !iPod() && navigator.platform.indexOf('Mac') !== -1;
}

export function win() {
  return window && navigator.platform.indexOf('Win') !== -1;
}

export function getViewport() {
  if (!window) return { w: 0, h: 0 };

  return {
    w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  };
}

export function opera() {
  if (!window) return false;

  return (
    !!window.opera
    || (!!window.opr && !!window.opr.addons)
    || navigator.userAgent.indexOf(' OPR/') >= 0
  )
}

export function firefox() {
  return window && typeof InstallTrigger !== 'undefined';
}

export function ie() {
  return window && /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line
}

export function ie10() {
  return window && document.documentMode === 10;
}

export function ie11() {
  return window && document.documentMode === 11;
}

export function edge() {
  return window && !ie() && !!window.StyleMedia;
}

export function chrome() {
  return window && !!window.chrome && !!window.chrome.webstore;
}

export function safari() {
  if (!window) return false;

  return (
    /constructor/i.test(window.HTMLElement)
    || ((p) => p.toString() === '[object SafariRemoteNotification]')(!window.safari || window.safari.pushNotification)
  );
}

export function retina() {
  return window && window.devicePixelRatio > 1;
}

export function touchScreen() {
  return window && !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));
}
