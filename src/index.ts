import isAndroid from './detectors/isAndroid';
import isChrome from './detectors/isChrome';
import isEdge from './detectors/isEdge';
import isFirefox from './detectors/isFirefox';
import isIE from './detectors/isIE';
import isIE10 from './detectors/isIE10';
import isIE11 from './detectors/isIE11';
import isIOS from './detectors/isIOS';
import isIPad from './detectors/isIPad';
import isIPhone from './detectors/isIPhone';
import isIPod from './detectors/isIPod';
import isMac from './detectors/isMac';
import isOpera from './detectors/isOpera';
import isRetina from './detectors/isRetina';
import isSafari from './detectors/isSafari';
import isTouchScreen from './detectors/isTouchScreen';
import getViewport from './detectors/getViewport';
import isWin from './detectors/isWin';

import { IState, IParams, ChangeHandler } from './types';

interface IEFocusEvent extends FocusEvent {
  originalEvent?: {
    fromElement?: HTMLElement;
    relatedTarget?: HTMLElement;
  };
}

export default class Environment implements IState {
  private $changeHandler: ChangeHandler | undefined;

  private $isPointerFocus: boolean;

  private $listeners: ChangeHandler[];

  private $mouseMoveCount: number;

  private $pointerFocusTimeout: number;

  android = isAndroid();

  browser = !!window;

  chrome = isChrome();

  edge = isEdge();

  firefox = isFirefox();

  iPad = isIPad();

  iPhone = isIPhone();

  iPod = isIPod();

  ie = isIE();

  ie10 = isIE10();

  ie11 = isIE11();

  ios = isIOS();

  mac = isMac();

  opera = isOpera();

  pointerFocus = true;

  retina = isRetina();

  safari = isSafari();

  touchScreen = isTouchScreen();

  userHovering = !isTouchScreen();

  userTouching = isTouchScreen();

  utilityFocus = false;

  viewport = getViewport();

  win = isWin();

  constructor(params? : IParams) {
    this.$listeners = [];
    this.$changeHandler = params ? params.onChange : null;

    this.$isPointerFocus = false;
    this.$mouseMoveCount = 0;
    this.$pointerFocusTimeout = 0;

    this.emitChange();

    window.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('blur', this.onWindowBlur);
    document.documentElement.addEventListener('focusin', this.onDocumentFocusIn);
    document.documentElement.addEventListener('keydown', this.onDocumentKeydown);
    document.documentElement.addEventListener('pointerdown', this.onDocumentClick, true);
    document.documentElement.addEventListener('pointerup', this.onDocumentClick, true);
    document.documentElement.addEventListener('mousedown', this.onDocumentClick, true);
    document.documentElement.addEventListener('mouseup', this.onDocumentClick, true);
    document.documentElement.addEventListener('click', this.onDocumentClick, true);
    window.addEventListener('orientationchange', this.onWindowResize);
    window.addEventListener('resize', this.onWindowResize);
  }

  destroy(): void {
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('blur', this.onWindowBlur);
    document.documentElement.removeEventListener('focusin', this.onDocumentFocusIn);
    document.documentElement.removeEventListener('keydown', this.onDocumentKeydown);
    document.documentElement.removeEventListener('pointerdown', this.onDocumentClick, true);
    document.documentElement.removeEventListener('pointerup', this.onDocumentClick, true);
    document.documentElement.removeEventListener('mousedown', this.onDocumentClick, true);
    document.documentElement.removeEventListener('mouseup', this.onDocumentClick, true);
    document.documentElement.removeEventListener('click', this.onDocumentClick, true);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('resize', this.onWindowResize);
  }

  getState(): IState {
    const {
      browser,
      viewport,
      retina,
      touchScreen,
      iPhone,
      iPad,
      iPod,
      android,
      mac,
      win,
      ios,
      opera,
      firefox,
      safari,
      ie,
      ie10,
      ie11,
      edge,
      chrome,
      userTouching,
      userHovering,
      utilityFocus,
      pointerFocus,
    } = this;

    return {
      browser,
      viewport,
      retina,
      touchScreen,
      iPhone,
      iPad,
      iPod,
      android,
      mac,
      win,
      ios,
      opera,
      firefox,
      safari,
      ie,
      ie10,
      ie11,
      edge,
      chrome,
      userTouching,
      userHovering,
      utilityFocus,
      pointerFocus,
    };
  }

  subscribe(handler: ChangeHandler): ()=> void {
    if (typeof handler !== 'function') {
      throw new TypeError('Handler must be function');
    }

    if (!this.$listeners.includes(handler)) {
      this.$listeners.push(handler);
    }

    return (): void => this.unsubscribe(handler);
  }

  unsubscribe(handler: ChangeHandler): void {
    const index = this.$listeners.indexOf(handler);
    if (index > -1) {
      this.$listeners.splice(index, 1);
    }
  }

  private emitChange(): void {
    const state = this.getState();

    if (typeof this.$changeHandler === 'function') this.$changeHandler(state);

    this.$listeners.forEach((fn) => fn(state));
  }

  private onMouseMove = (): void => {
    // Mousemove fires on iOS on tap, right after touchstart and touchend
    this.$mouseMoveCount++;

    if (!this.userHovering && this.$mouseMoveCount > 10) {
      this.userTouching = false;
      this.userHovering = true;
      this.emitChange();
    }
  };

  private onTouchStart = (): void => {
    if (!this.userTouching) {
      this.userHovering = false;
      this.userTouching = true;
      this.emitChange();
    }
    this.$mouseMoveCount = 0;
  };

  private onDocumentFocusIn = (e: IEFocusEvent): void => {
    if (this.pointerFocus && (this.ie10 || this.ie11)) {
      if (e.originalEvent && (!e.originalEvent.fromElement && !e.originalEvent.relatedTarget)) {
        this.$isPointerFocus = true;
        setTimeout(() => {
          this.$isPointerFocus = false;
        });
      }
    }

    this.pointerFocus = this.$isPointerFocus;
    this.utilityFocus = !this.pointerFocus;
    this.emitChange();
  };

  private onDocumentKeydown = (): void => {
    clearTimeout(this.$pointerFocusTimeout);
    this.$isPointerFocus = false;
  };

  private onDocumentClick = (e: MouseEvent): void => {
    if (!e.detail) return; // enter/space on focused element

    this.$isPointerFocus = true;

    clearTimeout(this.$pointerFocusTimeout);

    this.$pointerFocusTimeout = window.setTimeout(() => {
      this.$isPointerFocus = false;
    }, 600);
  };

  private onWindowBlur = (): void => {
    const fix = (): void => {
      if (this.pointerFocus) {
        this.$isPointerFocus = true;
        setTimeout(() => {
          this.$isPointerFocus = false;
        });
      }
      window.removeEventListener('focus', fix);
    };
    window.addEventListener('focus', fix);
  };

  private onWindowResize = (): void => {
    this.viewport = getViewport();
    this.emitChange();
  };
}
