import * as detectors from './detectors';

// TODO: refactor to reduce size

export default class Env {
  constructor(params = {}) {
    this.$listeners = [];
    this.$state = {};
    this.$config = {
      onChange: params.onChange,
    };

    this.$pointerFocus = false;
    this.$mouseMoveCount = 0;
    this.$pointerFocusTimeout = 0;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onWindowBlur = this.onWindowBlur.bind(this);
    this.onDocumentFocusIn = this.onDocumentFocusIn.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.detect();
    this.onChange();
    this.setEventListeners();
  }

  destroy() {
    this.setEventListeners(false);
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

  setEventListeners(add = true) {
    const action = `${add ? 'add' : 'remove'}EventListener`;
    window[action]('touchstart', this.onTouchStart);
    window[action]('mousemove', this.onMouseMove);
    window[action]('blur', this.onWindowBlur);
    document.documentElement[action]('focusin', this.onDocumentFocusIn);
    document.documentElement[action]('keydown', this.onDocumentKeydown);
    document.documentElement[action]('pointerdown', this.onDocumentClick);
    document.documentElement[action]('pointerup', this.onDocumentClick);
    document.documentElement[action]('mousedown', this.onDocumentClick);
    document.documentElement[action]('mouseup', this.onDocumentClick);
    document.documentElement[action]('click', this.onDocumentClick);
    window.addEventListener('orientationchange', this.onWindowResize);
    window.addEventListener('resize', this.onWindowResize);
  }

  detect() {
    this.$state.browser = !!window;

    this.$state.iPhone = detectors.iPhone();
    this.$state.iPad = detectors.iPad();
    this.$state.iPod = detectors.iPod();
    this.$state.android = detectors.android();
    this.$state.mac = detectors.mac();
    this.$state.win = detectors.win();
    this.$state.ios = detectors.iOS();
    this.$state.opera = detectors.opera();
    this.$state.firefox = detectors.firefox();
    this.$state.safari = detectors.safari();
    this.$state.ie = detectors.ie();
    this.$state.ie10 = detectors.ie10();
    this.$state.ie11 = detectors.ie11();
    this.$state.edge = detectors.edge();
    this.$state.chrome = detectors.chrome();
    this.$state.retina = detectors.retina();
    this.$state.touchScreen = detectors.touchScreen();
    this.$state.viewport = detectors.getViewport();

    this.$state.userTouching = this.$state.touchScreen;
    this.$state.userHovering = !this.$state.touchScreen;
    this.$state.utilityFocus = !this.$state.touchScreen;
    this.$state.pointerFocus = false;
  }

  onChange() {
    const state = {
      ...this.$state,
      viewport: {
        ...this.$state.viewport,
      },
    };

    if (typeof this.$config.onChange === 'function') this.$config.onChange(state);

    this.$listeners.forEach((fn) => fn(state));
  }

  getState() {
    return {
      ...this.$state,
    };
  }

  onMouseMove() {
    // Mousemove fires on iOS on tap, right after touchstart and touchend
    this.$mouseMoveCount++;
    if (!this.$state.userHovering && this.$mouseMoveCount > 10) {
      this.$state.userTouching = false;
      this.$state.userHovering = true;
      this.onChange();
    }
  }

  onTouchStart() {
    if (!this.$state.userTouching) {
      this.$state.userHovering = false;
      this.$state.userTouching = true;
      this.onChange();
    }
    this.$mouseMoveCount = 0;
  }

  onDocumentFocusIn(e) {
    if (this.$state.pointerFocus && (this.$state.ie10 || this.$state.ie11)) {
      if (e.originalEvent && (!e.originalEvent.fromElement && !e.originalEvent.relatedTarget)) {
        this.$pointerFocus = true;
        setTimeout(() => {
          this.$pointerFocus = false;
        });
      }
    }

    this.$state.pointerFocus = this.$pointerFocus;
    this.$state.utilityFocus = !this.$state.pointerFocus;
    this.onChange();
  }

  onDocumentKeydown() {
    clearTimeout(this.$pointerFocusTimeout);
    this.$pointerFocus = false;
  }

  onDocumentClick(e) {
    if (!e.detail) return; // enter/space on focused element
    this.$pointerFocus = true;
    clearTimeout(this.$pointerFocusTimeout);
    this.$pointerFocusTimeout = setTimeout(() => {
      this.$pointerFocus = false;
    }, 600);
  }

  onWindowBlur() {
    const fix = () => {
      if (this.$state.pointerFocus) {
        this.$pointerFocus = true;
        setTimeout(() => {
          this.$pointerFocus = false;
        });
      }
      window.removeEventListener('focus', fix);
    };
    window.addEventListener('focus', fix);
  }

  onWindowResize() {
    this.$state.viewport = detectors.getViewport();
    this.onChange();
  }

  get browser() {
    return this.$state.browser;
  }

  get opera() {
    return this.$state.opera;
  }

  get firefox() {
    return this.$state.firefox;
  }

  get safari() {
    return this.$state.safari;
  }

  get ie() {
    return this.$state.touchScreen;
  }

  get ie10() {
    return this.$state.ie10;
  }

  get ie11() {
    return this.$state.ie11;
  }

  get edge() {
    return this.$state.edge;
  }

  get chrome() {
    return this.$state.chrome;
  }

  get iPhone() {
    return this.$state.iPhone;
  }

  get iPad() {
    return this.$state.iPad;
  }

  get iPod() {
    return this.$state.iPod;
  }

  get android() {
    return this.$state.android;
  }

  get mac() {
    return this.$state.mac;
  }

  get win() {
    return this.$state.win;
  }

  get ios() {
    return this.$state.ios;
  }

  get userTouching() {
    return this.$state.userTouching;
  }

  get userHovering() {
    return this.$state.userHovering;
  }

  get utilityFocus() {
    return this.$state.utilityFocus;
  }

  get pointerFocus() {
    return this.$state.pointerFocus;
  }

  get retina() {
    return this.$state.retina;
  }

  get touchScreen() {
    return this.$state.touchScreen;
  }

  get viewport() {
    return {
      ...this.$state.viewport,
    };
  }
}
