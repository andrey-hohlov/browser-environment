module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/member-delimiter-style': 'warn',
    '@typescript-eslint/type-annotation-spacing': ['warn', { before: false, after: true }],
    'class-methods-use-this': 'off',
    'import/no-named-as-default': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
