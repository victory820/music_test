module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'eol-last': 0, // 文件内容最后一行是否有空行
    // 'space-before-function-paren': 0 // 方法左侧括号是否要加空格
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'eol-last': 0,
    'indent': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
