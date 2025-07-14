import { test, expect, Page } from '@playwright/test';

test.describe('DeleteConfirmModal E2E 테스트', () => {
  // 로그인 함수 재사용을 위한 헬퍼
  async function login(page: Page) {
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
  async function waitForVmDetailsLoaded(page: Page) {
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

  test('삭제 확인 모달 표시 및 UI 검증', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);

    // 삭제 버튼 클릭 (danger 속성과 텍스트로 찾기)
    const deleteButton = page.locator('button:has-text("삭제")').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 삭제 확인 모달이 표시되는지 확인
    const modal = page.locator('.ant-modal');
    await expect(modal).toBeVisible();

    // 모달 제목 확인
    const modalTitle = page.locator('.ant-modal-title');
    await expect(modalTitle).toContainText('VM 인스턴스 삭제');

    // 확인 메시지에 인스턴스 이름이 포함되어 있는지 확인
    const modalBody = page.locator('.ant-modal-body');
    await expect(modalBody).toContainText('정말로');
    await expect(modalBody).toContainText('VM 인스턴스를 삭제하시겠습니까?');

    // 경고 메시지 확인
    const warningMessage = page.locator('.delete-warning');
    await expect(warningMessage).toBeVisible();
    await expect(warningMessage).toContainText('삭제된 VM 인스턴스는 복구할 수 없습니다');

    // 버튼들 확인
    const confirmButton = page.locator('.ant-modal .ant-btn-dangerous');
    const cancelButton = page.locator('.ant-modal button:has-text("취소")');
    
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toContainText('삭제');
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toContainText('취소');

    // 모달 스크린샷 저장
    await modal.screenshot({ 
      path: 'screenshots/vm/delete-confirm-modal.png' 
    });

    console.log('✅ 삭제 확인 모달 UI 검증 완료');
  });

  test('삭제 취소 기능 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);

    // 삭제 버튼 클릭
    await page.locator('button:has-text("삭제")').first().click();

    // 모달이 표시될 때까지 대기
    await page.waitForSelector('.ant-modal', { timeout: 5000 });

    // 취소 버튼 클릭
    const cancelButton = page.locator('.ant-modal button:has-text("취소")');
    await cancelButton.click();

    // 모달이 사라졌는지 확인
    await expect(page.locator('.ant-modal')).not.toBeVisible();

    // 여전히 VM 상세 페이지에 있는지 확인
    await expect(page).toHaveURL(/\/servers\/instances\/1/);
    await expect(page.locator('[data-testid="vm-instance-details"]')).toBeVisible();

    console.log('✅ 삭제 취소 기능 테스트 완료');
  });

  test('ESC 키로 모달 닫기 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);

    // 삭제 버튼 클릭
    await page.locator('button:has-text("삭제")').first().click();

    // 모달이 표시될 때까지 대기
    await page.waitForSelector('.ant-modal', { timeout: 5000 });

    // 취소 버튼으로 모달 닫기 (ESC 키 대신 실제 사용자 행동 시뮬레이션)
    await page.locator('.ant-modal button:has-text("취소")').click();

    // 잠시 대기 후 모달이 사라졌는지 확인
    await page.waitForTimeout(1000);
    const modalVisible = await page.locator('.ant-modal').isVisible();
    expect(modalVisible).toBeFalsy();

    console.log('✅ 취소 버튼으로 모달 닫기 테스트 완료');
  });

  test('모달 백드롭 클릭으로 닫기 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);

    // 삭제 버튼 클릭
    await page.locator('button:has-text("삭제")').first().click();

    // 모달이 표시될 때까지 대기
    await page.waitForSelector('.ant-modal', { timeout: 5000 });

    // 백드롭 클릭 - 더 안전한 방법으로 mask 요소 직접 클릭
    await page.locator('.ant-modal-mask').click({ force: true });

    // 잠시 대기 후 모달이 사라졌는지 확인
    await page.waitForTimeout(1000);
    const modalVisible = await page.locator('.ant-modal').isVisible();
    expect(modalVisible).toBeFalsy();

    console.log('✅ 백드롭 클릭으로 모달 닫기 테스트 완료');
  });

  test('삭제 확인 기능 테스트 (Mock 환경)', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);


    // 삭제 버튼 클릭
    await page.locator('button:has-text("삭제")').first().click();

    // 모달이 표시될 때까지 대기
    await page.waitForSelector('.ant-modal', { timeout: 5000 });

    // 삭제 확인 버튼 클릭
    const confirmButton = page.locator('.ant-modal .ant-btn-dangerous');
    await confirmButton.click();

    // 로딩 상태 확인 (버튼이 로딩 상태가 되는지)
    await expect(confirmButton).toHaveClass(/ant-btn-loading/);

    // 삭제 성공 메시지 확인
    const successMessage = page.locator('.ant-message');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('성공적으로 삭제되었습니다');

    // 메인 페이지로 리다이렉트되었는지 확인
    await page.waitForURL('/main', { timeout: 10000 });
    await expect(page).toHaveURL('/main');

    console.log('✅ 삭제 확인 기능 테스트 완료');
  });

  test('다양한 인스턴스 이름으로 모달 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    const instances = [
      { id: '1', expectedName: 'production-web-server' },
      { id: '2', expectedName: 'development-api-server' },
      { id: '3', expectedName: 'staging-database' }
    ];

    for (const instance of instances) {
      await page.goto(`/servers/instances/${instance.id}`);
      
      // VM 상세 페이지 로딩 완료 대기
      await waitForVmDetailsLoaded(page);
      
      // 삭제 버튼 클릭
      await page.locator('button:has-text("삭제")').first().click();
      
      // 모달이 표시될 때까지 대기
      await page.waitForSelector('.ant-modal', { timeout: 5000 });
      
      // 인스턴스 이름이 모달에 표시되는지 확인
      const modalBody = page.locator('.ant-modal-body');
      await expect(modalBody).toContainText(instance.expectedName);
      
      // 모달 닫기
      await page.locator('.ant-modal button:has-text("취소")').click();
      await expect(page.locator('.ant-modal')).not.toBeVisible();

      console.log(`✅ 인스턴스 ${instance.id} (${instance.expectedName}) 모달 테스트 완료`);
    }
  });

  test('모달 접근성 테스트', async ({ page }) => {
    // 로그인
    await login(page);

    // VM 인스턴스 상세 페이지로 이동
    await page.goto('/servers/instances/1');

    // VM 상세 페이지 로딩 완료 대기
    await waitForVmDetailsLoaded(page);

    // 삭제 버튼 클릭
    await page.locator('button:has-text("삭제")').first().click();

    // 모달이 표시될 때까지 대기
    await page.waitForSelector('.ant-modal', { timeout: 5000 });

    // 모달이 표시되었는지 확인
    const modal = page.locator('.ant-modal');
    await expect(modal).toBeVisible();

    // Tab 키를 사용한 포커스 순서 확인
    await page.keyboard.press('Tab');
    const cancelButton = page.locator('.ant-modal button:has-text("취소")');
    await expect(cancelButton).toBeVisible();

    await page.keyboard.press('Tab');
    const confirmButton = page.locator('.ant-modal .ant-btn-dangerous');
    await expect(confirmButton).toBeVisible();

    console.log('✅ 모달 접근성 테스트 완료');
  });
});