import isIPad from './isIPad';

// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
const iOSPlatforms = [
  'iPad Simulator',
  'iPhone Simulator',
  'iPod Simulator',
  'iPad',
  'iPhone',
  'iPod',
];

export default function isIOS(): boolean {
  return window && (iOSPlatforms.includes(navigator.platform) || isIPad());
}
