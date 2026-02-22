const DEFAULT_PROFILE = {
  requireModule: ['ts-node/register'],
  require: [
    'src/helpers/hooks/hooks.ts',
    'src/stepDefinitions/**/*.steps.ts',
  ],
  paths: ['src/tests/features/**/*.feature'],
  format: [
    'progress-bar',
    'json:test-results/cucumber-json/cucumber-report.json',
    'html:test-results/cucumber-html-report/index.html',
  ],
  formatOptions: { snippetInterface: 'async-await' },
};

export { DEFAULT_PROFILE as default };
