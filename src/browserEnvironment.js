let pointerFocus = false;
let mouseMoveCount = 0;
let pointerFocusTimeout = 0;
let instance;

const config = {
  setClasses: true,
};

const listeners = [];

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
  retina: false,
  touchScreen: false,
  viewport: {
    w: 0,
    h: 0,
  },
};

function detectViewport() {
  env.viewport = {
    w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  };
}

function detect() {
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
  env.opera = (
    (!!window.opr && !!window.opr.addons)
    || !!window.opera
    || navigator.userAgent.indexOf(' OPR/') >= 0
  );
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
  env.touchScreen = !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

  env.userTouching = env.touchScreen;
  env.userHovering = !env.userTouching;

  detectViewport();
}

function unsubscribe(handler) {
  const index = listeners.indexOf(handler);
  if (index > -1) {
    listeners.splice(index, 1);
  }
}

function subscribe(handler) {
  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be function');
  }

  if (!listeners.includes(handler)) {
    listeners.push(handler);
  }

  return () => unsubscribe(handler);
}

function setClasses() {
  const classNames = {
    'env-mac': env.mac,
    'env-win': env.win,
    'env-ios': env.ios,
    'env-android': env.android,
    'env-ipad': env.iPad,
    'env-iphone': env.iPhone,
    'env-opera': env.opera,
    'env-firefox': env.firefox,
    'env-safari': env.safari,
    'env-ie': env.ie,
    'env-ie10': env.ie10,
    'env-ie11': env.ie11,
    'env-edge': env.edge,
    'env-chrome': env.chrome,
    'env-retina': env.retina,
    'env-touchscreen': env.touchScreen,
    'env-user-touching': env.userTouching,
    'env-user-hovering': env.userHovering,
    'env-utility-focus': env.utilityFocus,
    'env-pointer-focus': env.pointerFocus,
  };

  Object.keys(classNames).forEach((className) => {
    document.documentElement.classList[classNames[className] ? 'add' : 'remove'](className);
  });
}

function onEnvChange() {
  const envClone = {
    ...env,
    viewport: {
      ...env.viewport,
    },
  };

  listeners.forEach((handler) => handler(envClone));

  if (config.setClasses) {
    setClasses();
  }

  if (config.onChange) {
    config.onChange(envClone);
  }
}

function onMouseMove() {
  // Mousemove fires on iOS on tap, right after touchstart and touchend
  mouseMoveCount++;
  if (!env.userHovering && mouseMoveCount > 10) {
    env.userTouching = false;
    env.userHovering = true;
    onEnvChange();
  }
}

function onTouchStart() {
  if (!env.userTouching) {
    env.userHovering = false;
    env.userTouching = true;
    onEnvChange();
  }
  mouseMoveCount = 0;
}

function onDocumentFocusIn(e) {
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
  onEnvChange();
}

function onDocumentKeydown() {
  clearTimeout(pointerFocusTimeout);
  pointerFocus = false;
}

function onDocumentClick() {
  pointerFocus = true;
  clearTimeout(pointerFocusTimeout);
  pointerFocusTimeout = setTimeout(() => {
    pointerFocus = false;
  }, 600);
}

function onWindowBlur() {
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
}

const onWindowResize = () => {
  detectViewport();
  onEnvChange();
};

function listen(add = true) {
  const action = `${add ? 'add' : 'remove'}EventListener`;
  window[action]('touchstart', onTouchStart);
  window[action]('mousemove', onMouseMove);
  window[action]('blur', onWindowBlur);
  document.documentElement[action]('focusin', onDocumentFocusIn);
  document.documentElement[action]('keydown', onDocumentKeydown);
  document.documentElement[action]('pointerdown', onDocumentClick);
  document.documentElement[action]('pointerup', onDocumentClick);
  document.documentElement[action]('mousedown', onDocumentClick);
  document.documentElement[action]('mouseup', onDocumentClick);
  document.documentElement[action]('click', onDocumentClick);
  window.addEventListener('orientationchange', onWindowResize);
  window.addEventListener('resize', onWindowResize);
}

function init(params = {}) {
  if (!instance) {
    if (typeof params.setClasses !== 'undefined') {
      config.setClasses = !!params.setClasses;
    }

    if (params.onChange) {
      config.onChange = params.onChange;
    }

    instance = {
      get browser() {
        return env.browser;
      },
      get opera() {
        return env.opera;
      },
      get firefox() {
        return env.firefox;
      },
      get safari() {
        return env.safari;
      },
      get ie() {
        return env.touchScreen;
      },
      get ie10() {
        return env.ie10;
      },
      get ie11() {
        return env.ie11;
      },
      get edge() {
        return env.edge;
      },
      get chrome() {
        return env.chrome;
      },
      get iPhone() {
        return env.iPhone;
      },
      get iPad() {
        return env.iPad;
      },
      get iPod() {
        return env.iPod;
      },
      get android() {
        return env.android;
      },
      get mac() {
        return env.mac;
      },
      get win() {
        return env.win;
      },
      get ios() {
        return env.ios;
      },
      get userTouching() {
        return env.userTouching;
      },
      get userHovering() {
        return env.userHovering;
      },
      get utilityFocus() {
        return env.utilityFocus;
      },
      get pointerFocus() {
        return env.pointerFocus;
      },
      get retina() {
        return env.retina;
      },
      get touchScreen() {
        return env.touchScreen;
      },
      get viewport() {
        return {
          w: env.viewport.w,
          h: env.viewport.h,
        };
      },
      subscribe,
      unsubscribe,
    };

    detect();
    listen();
    onEnvChange();
  } else {
    console.warn('browser environment is already initialized');
  }

  return instance;
}

function destroy() {
  if (!instance) return;

  config.setClasses = true;
  config.onChange = null;

  listen(false);
  instance = null;
}

export default {
  init,
  destroy,
};
