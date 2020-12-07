# browser-environment

Detect browser environment

```
{
  browser: true,
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
  mac: true,
  win: false,
  ios: false,
  userTouching: false,
  userHovering: true,
  utilityFocus: true,
  pointerFocus: false,
  retina: true,
  touchScreen: false,
  viewport: {
    w: 784,
    h: 766
  }
}
```

## Usage

Install:

```
npm i -S browser-environment
```

Initialize:

```
import browserEnv from 'browser-environment';

const env = browserEnv.init();
```

Subscribe for changes:

```
import browserEnv from 'browser-environment';

function onChange(envState) {
  console.log(envState);
}

const env = browserEnv.init({
  onChange,
});

// Alternative withoption to unsubscribe:
env.subscribe(onChange);

// Unsubscribe:
env.unsubscribe(onChange);
```

By default, it reflects env with css classes on the html element:

```
env-mac
env-win
env-ios
env-android
env-ipad
env-iphone
env-opera
env-firefox
env-safari
env-ie
env-ie10
env-ie11
env-edge
env-chrome
env-retina
env-touchscreen
env-user-touching
env-user-hovering
env-utility-focus
env-pointer-focus
```

To disable this behavior:

```
const env = browserEnv.init({
  setClasses: false,
});
```

## Features description

```browser``` - app runs in the browser

```opera, firefox, safari, ie, ie10, ie11, edge, chrome``` - browser vendor

```iPhone, iPad, iPod, android, mac, win, ios``` - platform/device

```touchScreen, retina``` - screen properties

```userTouching``` - user uses touch gestures

```userHovering``` - user uses device with a cursor (probably mouse or touchpad)

```utilityFocus``` - user uses keyboard navigation (user uses tab button to navigate between form elements)

```pointerFocus``` - user uses pointer device (user clicks on form elements)

```viewport``` - viewport sizes
