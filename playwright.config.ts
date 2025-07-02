import { defineConfig, devices } from '@playwright/test';

// 환경변수에서 포트 읽기, 기본값은 3000
const port = process.env.E2E_PORT ? parseInt(process.env.E2E_PORT) : 3000;
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`;

// E2E_BASE_URL이 설정되었다면 webServer를 비활성화 (외부 서버 사용)
const useExternalServer = !!process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: useExternalServer ? undefined : {
    command: `pnpm dev:mock --port ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});