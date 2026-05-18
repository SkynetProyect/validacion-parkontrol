import { defineConfig } from '@playwright/test';

export default defineConfig({

  reporter: [

    ['html'],

    ['list'],

    ['@reportportal/agent-js-playwright', {

      apiKey: 'parkontrrol_Yh6LIOlJRLaHgr7k3fRyxDNxMhp_zenmxvrboqPn7Fpt23CYesde7WFhP0NhVyBV',

      endpoint: 'http://localhost:8080',

      project: 'Parkontrol',

      launch: 'Playwright Launch',

      description: 'Testing comm systems',

      attributes: [
        {
          key: 'env',
          value: 'dev'
        }
      ]
    }]
  ]
});