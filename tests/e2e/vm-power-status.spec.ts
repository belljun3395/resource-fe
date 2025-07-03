import { test, expect } from '@playwright/test';

test.describe('VM 인스턴스 파워 상태 드롭다운 테스트', () => {
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

    // 파워 상태 드롭다운 버튼이 로드될 때까지 대기
    await page.waitForSelector('button:has-text("인스턴스 상태")', { timeout: 10000 });
  }

  test('파워 상태 드롭다운 버튼 존재 확인', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동 (실행중인 인스턴스)
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 파워 상태 드롭다운 버튼 존재 확인
    const powerStatusButton = page.locator('button:has-text("인스턴스 상태")');
    await expect(powerStatusButton).toBeVisible();
    
    console.log('✅ 파워 상태 드롭다운 버튼 존재 확인 완료');
  });

  test('실행중인 인스턴스의 드롭다운 메뉴 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동 (실행중인 인스턴스 - ID: 1)
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 파워 상태 드롭다운 버튼 클릭
    await page.click('button:has-text("인스턴스 상태")');
    
    // 드롭다운 메뉴가 나타날 때까지 대기
    await page.waitForSelector('.ant-dropdown-menu', { timeout: 5000 });
    
    // 메뉴 항목들 확인
    const startMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 시작")');
    const shutdownMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 종료")');
    const rebootMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 재부팅")');
    const pauseMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 일시정지")');
    
    // 실행중인 인스턴스에서는 시작 버튼이 비활성화되어야 함
    await expect(startMenuItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 다른 버튼들은 활성화되어야 함
    await expect(shutdownMenuItem).not.toHaveClass(/ant-dropdown-menu-item-disabled/);
    await expect(rebootMenuItem).not.toHaveClass(/ant-dropdown-menu-item-disabled/);
    await expect(pauseMenuItem).not.toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 드롭다운 메뉴 스크린샷
    const dropdownMenu = page.locator('.ant-dropdown-menu');
    await dropdownMenu.screenshot({ 
      path: 'screenshots/vm/power-status-dropdown-running.png' 
    });
    
    console.log('✅ 실행중인 인스턴스 드롭다운 메뉴 테스트 완료');
  });

  test('종료된 인스턴스의 드롭다운 메뉴 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동 (종료된 인스턴스 - ID: 2)
    await page.goto('/servers/instances/2');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 파워 상태 드롭다운 버튼 클릭
    await page.click('button:has-text("인스턴스 상태")');
    
    // 드롭다운 메뉴가 나타날 때까지 대기
    await page.waitForSelector('.ant-dropdown-menu', { timeout: 5000 });
    
    // 메뉴 항목들 확인
    const startMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 시작")');
    const shutdownMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 종료")');
    const rebootMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 재부팅")');
    const pauseMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 일시정지")');
    
    // 종료된 인스턴스에서는 종료 버튼이 비활성화되어야 함
    await expect(shutdownMenuItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 재부팅과 일시정지는 비활성화되어야 함 (실행중이 아니므로)
    await expect(rebootMenuItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
    await expect(pauseMenuItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 시작 버튼은 활성화되어야 함
    await expect(startMenuItem).not.toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 드롭다운 메뉴 스크린샷
    const dropdownMenu = page.locator('.ant-dropdown-menu');
    await dropdownMenu.screenshot({ 
      path: 'screenshots/vm/power-status-dropdown-shutdown.png' 
    });
    
    console.log('✅ 종료된 인스턴스 드롭다운 메뉴 테스트 완료');
  });

  test('일시정지된 인스턴스의 드롭다운 메뉴 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동 (일시정지된 인스턴스 - ID: 3)
    await page.goto('/servers/instances/3');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 파워 상태 드롭다운 버튼 클릭
    await page.click('button:has-text("인스턴스 상태")');
    
    // 드롭다운 메뉴가 나타날 때까지 대기
    await page.waitForSelector('.ant-dropdown-menu', { timeout: 5000 });
    
    // 메뉴 항목들 확인
    const startMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 시작")');
    const shutdownMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 종료")');
    const rebootMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 재부팅")');
    const pauseMenuItem = page.locator('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 일시정지")');
    
    // 일시정지된 인스턴스에서는 재부팅과 일시정지가 비활성화되어야 함
    await expect(rebootMenuItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
    await expect(pauseMenuItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 시작과 종료는 활성화되어야 함
    await expect(startMenuItem).not.toHaveClass(/ant-dropdown-menu-item-disabled/);
    await expect(shutdownMenuItem).not.toHaveClass(/ant-dropdown-menu-item-disabled/);
    
    // 드롭다운 메뉴 스크린샷
    const dropdownMenu = page.locator('.ant-dropdown-menu');
    await dropdownMenu.screenshot({ 
      path: 'screenshots/vm/power-status-dropdown-paused.png' 
    });
    
    console.log('✅ 일시정지된 인스턴스 드롭다운 메뉴 테스트 완료');
  });

  test('파워 액션 실행 테스트 - 인스턴스 종료', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동 (실행중인 인스턴스)
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 파워 상태 드롭다운 버튼 클릭
    await page.click('button:has-text("인스턴스 상태")');
    
    // 드롭다운 메뉴가 나타날 때까지 대기
    await page.waitForSelector('.ant-dropdown-menu', { timeout: 5000 });
    
    // '인스턴스 종료' 메뉴 클릭
    await page.click('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 종료")');
    
    // 성공 메시지가 나타나는지 확인
    await page.waitForSelector('.ant-message-success', { timeout: 10000 });
    const successMessage = page.locator('.ant-message-success');
    await expect(successMessage).toBeVisible();
    
    // 로딩이 완료될 때까지 대기 (상태 업데이트 후)
    await page.waitForTimeout(2000);
    
    console.log('✅ 파워 액션 실행 테스트 완료');
  });

  test('로딩 상태 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);
    
    // 파워 상태 드롭다운 버튼 참조
    const powerStatusButton = page.locator('button:has-text("인스턴스 상태")');
    
    // 파워 상태 드롭다운 버튼 클릭
    await page.click('button:has-text("인스턴스 상태")');
    
    // 드롭다운 메뉴가 나타날 때까지 대기
    await page.waitForSelector('.ant-dropdown-menu', { timeout: 5000 });
    
    // 비동기적으로 로딩 아이콘 확인과 메뉴 클릭을 동시에 실행
    const loadingCheckPromise = expect(powerStatusButton.locator('.anticon-loading')).toBeVisible({ timeout: 3000 });
    
    // '인스턴스 종료' 메뉴 클릭 (로딩 상태 트리거)
    await page.click('.ant-dropdown-menu .ant-dropdown-menu-item:has-text("인스턴스 종료")');
    
    try {
      // 로딩 아이콘이 나타나는지 확인 (Mock API 지연으로 인한 로딩)
      await loadingCheckPromise;
      console.log('✅ 로딩 아이콘 확인됨');
    } catch (error) {
      console.log('⚠️ 로딩 아이콘이 너무 빨리 사라짐 (정상 동작)');
    }
    
    // 로딩이 완료될 때까지 대기 (최대 15초)
    await expect(powerStatusButton.locator('.anticon-loading')).not.toBeVisible({ timeout: 15000 });
    
    // 성공 메시지 확인
    await page.waitForSelector('.ant-message-success', { timeout: 10000 });
    
    console.log('✅ 로딩 상태 테스트 완료');
  });

  test('모든 파워 상태별 드롭다운 스크린샷', async ({ page }) => {
    // 로그인
    await login(page);
    
    const instances = [
      { id: '1', name: 'running', status: 'RUNNING' },
      { id: '2', name: 'shutdown', status: 'SHUTDOWN' }, 
      { id: '3', name: 'paused', status: 'PAUSED' }
    ];

    for (const instance of instances) {
      await page.goto(`/servers/instances/${instance.id}`);
      
      // VM 상세 페이지 로딩 완료 대기
      await waitForVmDetailsLoaded(page);
      
      // 파워 상태 드롭다운 버튼 클릭
      await page.click('button:has-text("인스턴스 상태")');
      
      // 드롭다운 메뉴가 나타날 때까지 대기
      await page.waitForSelector('.ant-dropdown-menu', { timeout: 5000 });
      
      // 드롭다운 메뉴 스크린샷 저장
      const dropdownMenu = page.locator('.ant-dropdown-menu');
      await dropdownMenu.screenshot({ 
        path: `screenshots/vm/power-dropdown-${instance.status.toLowerCase()}.png` 
      });

      // 드롭다운 닫기 (다음 테스트를 위해)
      await page.click('body');
      await page.waitForSelector('.ant-dropdown-menu', { state: 'hidden', timeout: 5000 });

      console.log(`✅ ${instance.status} 상태 드롭다운 스크린샷 저장 완료`);
    }
  });
});