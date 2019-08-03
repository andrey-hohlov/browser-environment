import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
  input: 'src/browserEnvironment.js',
  output:  {
    file: 'lib/browserEnvironment.js',
    format: 'umd',
    name: 'browserEnvironment'
  },
  plugins: [
    babel(),
    uglify(),
  ],
};
