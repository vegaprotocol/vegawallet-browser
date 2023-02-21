const path = require('path')

module.exports = (config) => ({
  ...config,
  context: path.resolve(__dirname, '../../'),
  externals: {
    '@vegaprotocol/wallet-popup': path.resolve(
      __dirname,
      '../wallet-popup/src/index.tsx'
    ),
    '@vegaprotocol/wallet-servive': path.resolve(
      __dirname,
      '../wallet-service/src/index.ts'
    ),
  },
  resolve: {
    alias: {
      react: path.join(__dirname, '../../node_modules/react'),
      'react-dom': path.join(__dirname, '../../node_modules/react-dom'),
    },
  },
})
