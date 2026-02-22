import * as reporter from 'multiple-cucumber-html-reporter';

reporter.generate({
  jsonDir: 'test-results/cucumber-json',
  reportPath: 'test-results/cucumber-html-report',
  metadata: {
    browser: {
      name: process.env.BROWSER ?? 'chromium',
      version: 'latest',
    },
    device: 'Local machine',
    platform: {
      name: process.platform,
      version: '',
    },
  },
  customData: {
    title: 'OrangeHRM Automation — Test Run Info',
    data: [
      { label: 'Project', value: 'OrangeHRM Automation' },
      { label: 'Environment', value: process.env.NODE_ENV ?? 'dev' },
      { label: 'Executed', value: new Date().toLocaleString() },
    ],
  },
});
