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
    w: 1440,
    h: 900,
  },
}
```

## Usage

Install:

```
npm i -S browser-environment
```

Initialize:

```
import Env from 'browser-environment';

const env = new Env();
```

Subscribe for changes:

```
import Env from 'browser-environment';

function onChange(state) {
  console.log(state);
}

const env = new Env({
  onChange,
});

// Alternative withoption to unsubscribe:
env.subscribe(onChange);

// Unsubscribe:
env.unsubscribe(onChange);
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
