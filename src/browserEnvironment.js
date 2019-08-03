let pointerFocus = false;
let pointerFocusTimeout;

function throttle(func, wait) {
  let timeout = null;

  return function wrapper(...args) {
    if (timeout) return;

    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, wait);
    }
  };
}

class ENV {
  constructor() {
    this.browser = false;
    this.opera = false;
    this.firefox = false;
    this.safari = false;
    this.ie = false;
    this.ie10 = false;
    this.ie11 = false;
    this.edge = false;
    this.chrome = false;
    this.iPhone = false;
    this.iPad = false;
    this.iPod = false;
    this.android = false;
    this.mac = false;
    this.win = false;
    this.ios = false;
    this.userTouching = false;
    this.userHovering = false;
    this.utilityFocus = false;
    this.pointerFocus = false;
    this.viewport = null;
    this.retina = false;
    this.touchScreen = false;

    this.$listeners = [];

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    this.browser = true;
    this.utilityFocus = true;

    [
      'onMouseOver',
      'onTouchStart',
      'onDocumentFocusIn',
      'onDocumentKeydown',
      'onDocumentClick',
      'onWindowBlur',
      'detectViewport',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.throttledOnResize = throttle(this.detectViewport, 200);

    this.detect();
    this.setClasses();
    this.setEventListeners();
  }

  destroy() {
    this.opera = false;
    this.firefox = false;
    this.safari = false;
    this.ie = false;
    this.ie10 = false;
    this.ie11 = false;
    this.edge = false;
    this.chrome = false;
    this.iPhone = false;
    this.iPad = false;
    this.iPod = false;
    this.android = false;
    this.mac = false;
    this.win = false;
    this.ios = false;
    this.userTouching = false;
    this.userHovering = false;
    this.utilityFocus = false;
    this.pointerFocus = false;
    this.viewport = null;
    this.retina = false;
    this.touchScreen = false;
    this.setClasses();
    this.setEventListeners(false);
  }

  setEventListeners(add = true) {
    const action = add ? 'addEventListener' : 'removeEventListener';
    window[action]('mouseover', this.onMouseOver);
    window[action]('touchstart', this.onTouchStart);
    window[action]('resize', this.throttledOnResize);
    window[action]('blur', this.onWindowBlur);
    document.documentElement[action]('focusin', this.onDocumentFocusIn);
    document.documentElement[action]('keydown', this.onDocumentKeydown);
    document.documentElement[action]('pointerdown', this.onDocumentClick);
    document.documentElement[action]('pointerup', this.onDocumentClick);
    document.documentElement[action]('mousedown', this.onDocumentClick);
    document.documentElement[action]('mouseup', this.onDocumentClick);
    document.documentElement[action]('click', this.onDocumentClick);
  }

  detect() {
    const { userAgent, platform } = window.navigator;
    this.iPhone = userAgent.indexOf('iPhone') !== -1;
    this.iPad = userAgent.indexOf('iPad') !== -1;
    this.iPod = userAgent.indexOf('iPod') !== -1;
    this.android = /Android/.test(userAgent);
    this.mac = !this.iPhone && !this.iPad && !this.iPod && !this.android && platform.indexOf('Mac') !== -1;
    this.win = platform.indexOf('Win') !== -1;
    this.ios = this.iPhone || this.iPad || this.iPod;
    this.opera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    this.firefox = typeof InstallTrigger !== 'undefined';
    this.safari = (
      /constructor/i.test(window.HTMLElement)
      || (p => p.toString() === '[object SafariRemoteNotification]')(!window.safari || window.safari.pushNotification)
    );
    this.ie = /*@cc_on!@*/false || !!document.documentMode; // eslint-disable-line
    this.ie10 = document.documentMode === 10;
    this.ie11 = document.documentMode === 11;
    this.edge = !this.ie && !!window.StyleMedia;
    this.chrome = !!window.chrome && !!window.chrome.webstore;
    this.retina = window.devicePixelRatio > 1;
    this.touchScreen = (
      !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch))
    );

    this.detectViewport();
  }

  detectViewport() {
    this.viewport = {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
    this.emit();
  }

  setClasses() {
    const classNames = {
      /* eslint-disable quote-props */
      '_mac': this.mac,
      '_win': this.win,
      '_ios': this.ios,
      '_android': this.android,
      '_ipad': this.iPad,
      '_iphone': this.iPhone,
      '_opera': this.opera,
      '_firefox': this.firefox,
      '_safari': this.safari,
      '_ie': this.ie,
      '_ie10': this.ie10,
      '_ie11': this.ie11,
      '_edge': this.edge,
      '_chrome': this.chrome,
      '_retina': this.retina,
      '_touchscreen': this.touchScreen,
      '_usertouching': this.userTouching,
      '_userhovering': this.userHovering,
      '_utilityfocus': this.utilityFocus,
      '_pointerfocus': this.pointerFocus,
      /* eslint-enable quote-props */
    };

    Object.keys(classNames).forEach((className) => {
      if (classNames[className]) {
        document.documentElement.classList.add(className);
      } else {
        document.documentElement.classList.remove(className);
      }
    });
  }

  onMouseOver() {
    if (this.userHovering) return;

    this.userTouching = false;
    this.userHovering = true;
    this.setClasses();
    this.emit();
  }

  onTouchStart() {
    if (this.userTouching) return;

    this.userHovering = false;
    this.userTouching = true;
    this.setClasses();
    this.emit();
  }

  onDocumentFocusIn(e) {
    if (this.pointerFocus && (this.ie10 || this.ie11)) {
      if (e.originalEvent && (!e.originalEvent.fromElement && !e.originalEvent.relatedTarget)) {
        pointerFocus = true;
        setTimeout(() => {
          pointerFocus = false;
        });
      }
    }

    this.pointerFocus = pointerFocus;
    this.utilityFocus = !this.pointerFocus;
    this.setClasses();
  }

  onDocumentKeydown() {
    clearTimeout(pointerFocusTimeout);
    pointerFocus = false;
  }

  onDocumentClick() {
    pointerFocus = true;
    clearTimeout(pointerFocusTimeout);
    pointerFocusTimeout = setTimeout(() => {
      pointerFocus = false;
    }, 600);
  }

  onWindowBlur() {
    const fix = () => {
      if (this.pointerFocus) {
        pointerFocus = true;
        setTimeout(() => {
          pointerFocus = false;
        });
      }
      window.removeEventListener('focus', fix);
    };
    window.addEventListener('focus', fix);
  }

  getEnv() {
    const {
      opera,
      firefox,
      safari,
      ie,
      edge,
      chrome,
      iPhone,
      iPad,
      iPod,
      android,
      mac,
      win,
      ios,
      retina,
      touchScreen,
      userTouching,
      userHovering,
      viewport,
    } = this;

    return {
      opera,
      firefox,
      safari,
      ie,
      edge,
      chrome,
      iPhone,
      iPad,
      iPod,
      android,
      mac,
      win,
      ios,
      retina,
      touchScreen,
      userTouching,
      userHovering,
      viewport,
    };
  }

  emit() {
    const state = this.getEnv();
    this.$listeners.forEach(handler => handler(state));
  }

  subscribe(handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Handler must be function');
    }

    if (!this.$listeners.includes(handler)) {
      this.$listeners.push(handler);
    }

    return () => this.unsubscribe(handler);
  }

  unsubscribe(handler) {
    const index = this.$listeners.indexOf(handler);
    if (index > -1) {
      this.$listeners.splice(index, 1);
    }
  }
}

export default new ENV();
