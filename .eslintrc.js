var path = require('path');

const base = {
  env: {
    browser : true,
    amd     : true,
    jquery  : true,
    node    : true,
  },
  parser: "babel-eslint",
  extends: [
    'airbnb'
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'config/webpack.config.dev.js'
      }
    },
  },
}

const modifyAirbnb = {
  rules: {
    // 版权声明会报错
    'spaced-comment': ['error', 'always', {
      exceptions: ['*']
    }],
    // 对齐样式
    'key-spacing': ['error', {
      'multiLine': {
        'beforeColon': false,
        'afterColon': true,
      },
      'align': {
        'beforeColon': true,
        'afterColon': true,
        'on': 'colon',
      }
    }],
    // 影响阅读性，关闭该检测
    'object-shorthand': ['off', 'always', {
      ignoreConstructors: false,
      avoidQuotes: true,
    }],
    // lodash中_.reducer会导致报错
    'no-param-reassign': ['error', { props: false }],
    // 在index.js文件中只导出一个组件的时候报错
    'import/prefer-default-export': 'off',
    // 块代码需要前后是否有空行
    'padded-blocks': ['off', {'blocks': 'always'}],
  },
}

const toFixes = {
  rules: {
    'no-nested-ternary': 'off'
  }
}

const rules = Object.assign({}, modifyAirbnb.rules, toFixes.rules);

module.exports = Object.assign({}, base, {rules: rules});
