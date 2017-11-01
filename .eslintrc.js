// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue-guide/recommended'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-new': 0,
    'no-duplicate-imports': 0,
    'space-before-function-paren': ['error', 'never'],
    'vue-guide/sort-keys': [1, {
      'sortBy': 'name props data computed watch methods filters created mounted updated destroyed components'
    }],
    'vue-guide/max-attrs-in-line': [1, {
      'counts': 3
    }],
    'vue-guide/sort-attrs': [0, {
      'conditional': 10000,
      'directives': 1000,
      'literal-props': 100,
      'dynamic-props': 10,
      'events': 1
    }]
  }
}
