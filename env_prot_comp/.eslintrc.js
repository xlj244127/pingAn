module.exports = {
  extends: [
    'eslint-config-alloy/react'
  ],
  globals: {

  },
  rules: {
    'indent': ['warn', 2],
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    'quotes': ['error', 'double'],
    'no-undef': 'off'
  }
}