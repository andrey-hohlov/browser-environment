module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'class-methods-use-this': 0,
    'comma-dangle': 2,
    'global-require': 0,
    'import/prefer-default-export': 0,
    indent: 0,
    'no-console': [
      2,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
