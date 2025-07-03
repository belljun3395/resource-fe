import { test, expect } from '@playwright/test';

test.describe('VM 관련 화면 스크린샷', () => {
  // 로그인 함수 재사용을 위한 헬퍼
  async function login(page) {
    await page.goto('/login');
    
    // 로그인 폼이 로드될 때까지 대기
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    
    // 로그인 폼 입력
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="text"]', '테스트유저');
    await page.click('button[type="submit"]');

    // 로그인 성공 후 메인 페이지로 리다이렉트 대기
    await page.waitForURL('/main', { timeout: 10000 });
  }

  // VM 상세 페이지 로딩 완료를 기다리는 헬퍼 함수
  async function waitForVmDetailsLoaded(page) {
    // VM 상세 컴포넌트가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="vm-instance-details"]', { timeout: 10000 });
    
    // Mock API 지연을 고려하여 로딩 완료 대기
    await page.waitForFunction(() => {
      const element = document.querySelector('[data-testid="vm-instance-details"]');
      return element && !element.classList.contains('loading');
    }, { timeout: 15000 });
    
    // VM 인스턴스 이름 로딩 완료 대기
    await page.waitForFunction(() => {
      const title = document.querySelector('.ant-page-header-heading-title');
      return title && title.textContent && title.textContent !== '로딩 중...';
    }, { timeout: 15000 });
  }

  test('VM 인스턴스 상세 화면 스크린샷 캡처', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동 (Mock 데이터의 첫 번째 인스턴스)
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 전체 페이지 스크린샷
    await page.screenshot({ 
      path: 'screenshots/vm/vm-instance-detail-full.png',
      fullPage: true 
    });

    // VM 상세 정보 컴포넌트만 스크린샷
    const vmDetailsElement = page.locator('[data-testid="vm-instance-details"]');
    await vmDetailsElement.screenshot({ 
      path: 'screenshots/vm/vm-instance-details-component.png' 
    });

    console.log('✅ VM 인스턴스 상세 화면 스크린샷 저장 완료');
  });

  test('다양한 VM 상태별 화면 스크린샷', async ({ page }) => {
    // 로그인
    await login(page);
    
    const instances = [
      { id: '1', name: 'running-instance', status: 'RUNNING' },
      { id: '2', name: 'shutdown-instance', status: 'SHUTDOWN' }, 
      { id: '3', name: 'paused-instance', status: 'PAUSED' }
    ];

    for (const instance of instances) {
      await page.goto(`/servers/instances/${instance.id}`);
      
      // VM 상세 페이지 로딩 완료 대기
      await waitForVmDetailsLoaded(page);
      
      // 상태별 스크린샷 저장
      await page.screenshot({ 
        path: `screenshots/vm/vm-instance-${instance.status.toLowerCase()}.png`,
        fullPage: true 
      });

      console.log(`✅ ${instance.status} 상태 VM 스크린샷 저장 완료`);
    }
  });

  test('반응형 화면 스크린샷', async ({ page }) => {
    // 로그인
    await login(page);
    
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/servers/instances/1');
      
      // VM 상세 페이지 로딩 완료 대기
      await waitForVmDetailsLoaded(page);
      
      // 반응형 스크린샷 저장
      await page.screenshot({ 
        path: `screenshots/vm/vm-instance-${viewport.name}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name} 화면 크기 스크린샷 저장 완료`);
    }
  });
});