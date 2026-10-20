import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  use: { baseURL: 'http://localhost:5199', channel: 'msedge', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  // E2E_PROD=1 serves the production build in dist/ (what Netlify publishes) instead of the dev server
  webServer: { command: process.env.E2E_PROD ? 'npx vite preview --port 5199 --strictPort' : 'npx vite --port 5199 --strictPort', url: 'http://localhost:5199', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'msedge' } },
  ],
});
