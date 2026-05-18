const { defineConfig } = require('cypress');
const { registerArgosTask } = require('@argos-ci/cypress/task');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    async setupNodeEvents(on, config) {
      registerArgosTask(on, config, {
        uploadToArgos: !!process.env.CI,
        token: process.env.ARGOS_TOKEN,
      });

      return config;
    },
  },
});