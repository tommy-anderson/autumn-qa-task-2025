import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',   // Where your test files are
  timeout: 30 * 1000,         // Max time per test
  expect: {
    timeout: 5000,            // Timeout for expect() assertions
  },
  reporter: [
    ['list'],                 // CLI output
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
  ],
  use: {
    headless: false,          // Change to true for CI
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    screenshot: 'off',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});