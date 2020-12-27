import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/BrowserEnvironment.js',
  output:  {
    file: 'lib/BrowserEnvironment.js',
    format: 'umd',
    name: 'BrowserEnvironment'
  },
  plugins: [
    babel(),
    terser(),
  ],
};
