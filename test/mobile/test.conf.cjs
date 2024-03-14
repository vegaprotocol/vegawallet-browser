exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || 'for_local_running_add_your_username_here',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'for_local_running_add_your_key_here',
  hostname: 'hub.browserstack.com',
  services: [
    [
      'browserstack',
      {
        buildIdentifier: '${BUILD_NUMBER}',
        app: 'bs://d8b33ceda5ef2318f791c9af11d8a73a67f5adcf'
      }
    ]
  ],

  capabilities: [
    {
      'bstack:options': {
        deviceName: 'iPhone 15',
        osVersion: '17'
      }
    }
  ],

  commonCapabilities: {
    'bstack:options': {
      projectName: 'BrowserStack Samples',
      buildName: 'browserstack build',
      sessionName: 'BStack parallel webdriverio-appium',
      debug: true,
      networkLogs: true,
      browserName: 'safari'
    }
  },

  maxInstances: 10,

  updateJob: false,
  specs: ['./tests/**/*.spec.js'],
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
}

// Code to support common capabilities
exports.config.capabilities.forEach(function (caps) {
  for (let key in exports.config.commonCapabilities)
    caps[key] = { ...caps[key], ...exports.config.commonCapabilities[key] }
})
