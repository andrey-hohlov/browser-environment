let pointerFocusTimeout;

let pointerFocus = false;
let mouseMoveCount = 0;

const listeners = [];

const unsubscribe = (handler) => {
  const index = listeners.indexOf(handler);
  if (index > -1) {
    listeners.splice(index, 1);
  }
};

const subscribe = (handler) => {
  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be function');
  }

  if (!listeners.includes(handler)) {
    listeners.push(handler);
  }

  return () => unsubscribe(handler);
};

const env = {
  browser: false,
  opera: false,
  firefox: false,
  safari: false,
  ie: false,
  ie10: false,
  ie11: false,
  edge: false,
  chrome: false,
  iPhone: false,
  iPad: false,
  iPod: false,
  android: false,
  mac: false,
  win: false,
  ios: false,
  userTouching: false,
  userHovering: false,
  utilityFocus: false,
  pointerFocus: false,
  viewport: {
    h: 0,
    w: 0,
  },
  retina: false,
  touchScreen: false,
  $subscribe: subscribe,
  $unsubscribe: unsubscribe,
};

const setClasses = () => {
  const classNames = {
    /* eslint-disable quote-props */
    '_mac': env.mac,
    '_win': env.win,
    '_ios': env.ios,
    '_android': env.android,
    '_ipad': env.iPad,
    '_iphone': env.iPhone,
    '_opera': env.opera,
    '_firefox': env.firefox,
    '_safari': env.safari,
    '_ie': env.ie,
    '_ie10': env.ie10,
    '_ie11': env.ie11,
    '_edge': env.edge,
    '_chrome': env.chrome,
    '_retina': env.retina,
    '_touchscreen': env.touchScreen,
    '_usertouching': env.userTouching,
    '_userhovering': env.userHovering,
    '_utilityfocus': env.utilityFocus,
    '_pointerfocus': env.pointerFocus,
    /* eslint-enable quote-props */
  };

  Object.keys(classNames).forEach((className) => {
    if (classNames[className]) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }
  });
};

const detectViewport = () => {
  env.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  env.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

const emit = () => {
  listeners.forEach((handler) => handler(env));
};

const onMouseMove = () => {
  // Mousemove fires on iOS on tap, right after touchstart and touchend
  if (!env.userHovering && mouseMoveCount > 10) {
    mouseMoveCount++;
    env.userTouching = false;
    env.userHovering = true;
    setClasses();
    emit();
  }
};

const onTouchStart = () => {
  if (!env.userTouching) {
    env.userHovering = false;
    env.userTouching = true;
    setClasses();
    emit();
  }
  mouseMoveCount = 0;
};

const onDocumentFocusIn = (e) => {
  if (env.pointerFocus && (env.ie10 || env.ie11)) {
    if (e.originalEvent && (!e.originalEvent.fromElement && !e.originalEvent.relatedTarget)) {
      pointerFocus = true;
      setTimeout(() => {
        pointerFocus = false;
      });
    }
  }

  env.pointerFocus = pointerFocus;
  env.utilityFocus = !env.pointerFocus;
  setClasses();
};

const onDocumentKeydown = () => {
  clearTimeout(pointerFocusTimeout);
  pointerFocus = false;
};

const onDocumentClick = () => {
  pointerFocus = true;
  clearTimeout(pointerFocusTimeout);
  pointerFocusTimeout = setTimeout(() => {
    pointerFocus = false;
  }, 600);
};

const onWindowBlur = () => {
  const fix = () => {
    if (env.pointerFocus) {
      pointerFocus = true;
      setTimeout(() => {
        pointerFocus = false;
      });
    }
    window.removeEventListener('focus', fix);
  };
  window.addEventListener('focus', fix);
};

const onWindowResize = () => {
  detectViewport();
  emit();
};

const init = () => {
  if (typeof window === 'undefined') return;
  const { userAgent, platform } = window.navigator;

  env.browser = true;
  env.utilityFocus = true;
  env.iPhone = userAgent.indexOf('iPhone') !== -1;
  env.iPad = userAgent.indexOf('iPad') !== -1;
  env.iPod = userAgent.indexOf('iPod') !== -1;
  env.android = /Android/.test(userAgent);
  env.mac = !env.iPhone && !env.iPad && !env.iPod && !env.android && platform.indexOf('Mac') !== -1;
  env.win = platform.indexOf('Win') !== -1;
  env.ios = env.iPhone || env.iPad || env.iPod;
  env.opera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  env.firefox = typeof InstallTrigger !== 'undefined';
  env.safari = (
    /constructor/i.test(window.HTMLElement)
    || ((p) => p.toString() === '[object SafariRemoteNotification]')(!window.safari || window.safari.pushNotification)
  );
  env.ie = /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line
  env.ie10 = document.documentMode === 10;
  env.ie11 = document.documentMode === 11;
  env.edge = !env.ie && !!window.StyleMedia;
  env.chrome = !!window.chrome && !!window.chrome.webstore;
  env.retina = window.devicePixelRatio > 1;
  env.touchScreen = (
    !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch))
  );

  // For first time assume based on the screen
  env.userTouching = env.touchScreen;
  env.userHovering = !env.userTouching;

  detectViewport();
  setClasses();
  emit();

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onWindowResize);
  window.addEventListener('blur', onWindowBlur);
  document.documentElement.addEventListener('focusin', onDocumentFocusIn);
  document.documentElement.addEventListener('keydown', onDocumentKeydown);
  document.documentElement.addEventListener('pointerdown', onDocumentClick);
  document.documentElement.addEventListener('pointerup', onDocumentClick);
  document.documentElement.addEventListener('mousedown', onDocumentClick);
  document.documentElement.addEventListener('mouseup', onDocumentClick);
  document.documentElement.addEventListener('click', onDocumentClick);
};

init();

export default env;
