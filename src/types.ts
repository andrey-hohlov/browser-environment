export type ViewportSize = {
  width: number;
  height: number;
};

export interface IState {
  browser: boolean;
  viewport: ViewportSize;
  retina: boolean;
  touchScreen: boolean;
  iPhone: boolean;
  iPad: boolean;
  iPod: boolean;
  android: boolean;
  mac: boolean;
  win: boolean;
  ios: boolean;
  opera: boolean;
  firefox: boolean;
  safari: boolean;
  ie: boolean;
  ie10: boolean;
  ie11: boolean;
  edge: boolean;
  chrome: boolean;
  userTouching: boolean;
  userHovering: boolean;
  utilityFocus: boolean;
  pointerFocus: boolean;
}

export type ChangeHandler = (state: IState)=> void; // TODO: eslint arrow-spacing

export interface IParams {
  onChange?: ChangeHandler;
}
