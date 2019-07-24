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
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'eol-last': 0, // 文件内容最后一行是否有空行
    // 'space-before-function-paren': 0 // 方法左侧括号是否要加空格
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
