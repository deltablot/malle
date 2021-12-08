module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  env: {
    'browser': true,
    'amd': true,
    'es6': true,
  },
  rules: {
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'keyword-spacing': [
      'error',
      {'before': true, 'after': true},
    ],
    'space-before-function-paren': [
      'error',
      'never',
    ],
    '@typescript-eslint/no-extra-parens': [
      'error',
      'all',
    ],
  }
}
