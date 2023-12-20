exports.config = {
    user: process.env.BROWSERSTACK_USERNAME || 'dalebennett_yHuwF2',
    key: process.env.BROWSERSTACK_ACCESS_KEY || '5CwMxYSUKoMUJyLLNpFF',
    hostname: 'hub.browserstack.com',
    services: [
      [
        'browserstack',
        { 
          //app: 'bs://a25c4dc3e4c2ae24d67f8b47646044f281bbac23',
          buildIdentifier: '${BUILD_NUMBER}',
          //browserstackLocal: true,
           //opts: { forcelocal: false, localIdentifier: "thisIsMyIdentifier" },
          //gagagahahahah: process.env.BROWSERSTACK_APP_PATH || './VegaWallet-Fairground.ipa',
          //browserName: 'safari',
        }
      ]
    ],
  
    capabilities: [{
      'appium:otherApps': ['bs://a25c4dc3e4c2ae24d67f8b47646044f281bbac23'],
      'appium:includeSafariInWebviews': true,
      "browserName": "safari",
        'bstack:options': {
          deviceName: 'iPhone 15',
          platformVersion: '17',
          platformName: 'ios',
          //otherApps: ['bs://a25c4dc3e4c2ae24d67f8b47646044f281bbac23']
        }}],
  
    updateJob: false,
    specs: [
      './tests/**/*.spec.js'
    ],
    exclude: [],
  
    logLevel: 'info',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: '',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
  
    framework: 'mocha',
    mochaOpts: {
      ui: 'bdd',
      timeout: 30000
    }
  };