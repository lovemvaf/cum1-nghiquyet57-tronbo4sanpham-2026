import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5175/cum1-nghiquyet57-tronbo4sanpham-2026/',
    viewport: { width: 1920, height: 1080 }
  },
  webServer: {
    command: 'npx vite --port 5175 --host 127.0.0.1',
    url: 'http://127.0.0.1:5175/cum1-nghiquyet57-tronbo4sanpham-2026/',
    reuseExistingServer: !process.env.CI,
    timeout: 25000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
