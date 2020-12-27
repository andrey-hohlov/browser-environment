module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'import/no-named-as-default': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'prefer-destructuring': 'off',
  },
  parser: '@babel/eslint-parser',
};
