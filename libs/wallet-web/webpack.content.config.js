const path = require('path')

module.exports = (config) => ({
  ...config,
  context: path.resolve(__dirname, '../../'),
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    },
  },
})
