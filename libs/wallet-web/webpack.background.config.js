const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = (config) => {
  console.log(config)
  return ({
  ...config,
  resolve: {
    ...config.resolve,
    plugins: [
      ...(config.resolve?.plugins || []),
      new TsconfigPathsPlugin({ configFile: path.join(__dirname, 'tsconfig.lib.json')}),
    ],
    alias: {
      // '@vegaprotocol/wallet-service': path.join(__dirname, '../../libs/wallet-service/src'),
      '@vegaprotocol/wallet-ui/src/types': path.join(__dirname, '../../node_modules/@vegaprotocol/@wallet-ui/src/types/index.ts')
    },
  },
})
}
