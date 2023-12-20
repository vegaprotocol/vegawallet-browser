exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || 'dalebennett_yHuwF2',
  key: process.env.BROWSERSTACK_ACCESS_KEY || '5CwMxYSUKoMUJyLLNpFF',
  hostname: 'hub.browserstack.com',
  services: [
    [
      'browserstack',
      {
        buildIdentifier: '${BUILD_NUMBER}',
        browserstackLocal: true,
        opts: { forcelocal: false, localIdentifier: "VegaWallet" },
        app: "bs://a25c4dc3e4c2ae24d67f8b47646044f281bbac23"
      }
    ]
  ],

  capabilities: [{
    'bstack:options': {
      deviceName: "iPhone 15",
      osVersion: "17"
    }
  }, ],

  commonCapabilities: {
    
    'bstack:options': {
      projectName: "BrowserStack Samples",
      buildName: 'browserstack build',
      sessionName: 'BStack parallel webdriverio-appium',
      debug: true,
      networkLogs: true,
      browserName: 'safari',
    }
  },

  maxInstances: 10,

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
    timeout: 40000
  }
};

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for(let key in exports.config.commonCapabilities)
    caps[key] = { ...caps[key], ...exports.config.commonCapabilities[key]};
});
