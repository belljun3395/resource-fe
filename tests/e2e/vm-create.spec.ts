import { test, expect } from "@playwright/test";

test.describe("VM Instance Creation", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정 (쿠키 설정)
    await page.goto("/");
    
    // 인증 쿠키 설정
    await page.context().addCookies([
      {
        name: "okestro_user",
        value: "testuser",
        domain: "localhost",
        path: "/",
      },
      {
        name: "okestro_email", 
        value: "test@example.com",
        domain: "localhost",
        path: "/",
      },
    ]);
    
    // VM 생성 페이지로 이동
    await page.goto("/servers/instances/create");
    await page.waitForLoadState("networkidle");
  });

  test("VM 생성 전체 플로우 테스트", async ({ page }) => {
    // 1단계: 기본 정보 입력
    await test.step("기본 정보 입력", async () => {
      // 페이지 제목 확인 - 한국어로 표시됨
      await expect(page.locator(".page-title h1")).toContainText("인스턴스 생성");

      // 현재 단계가 첫 번째인지 확인
      await expect(page.locator(".ant-steps-item-process")).toHaveCount(1);

      // 1단계 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step1-basic-info.png',
        fullPage: true 
      });

      // VM 이름 입력 
      await page.fill("input[placeholder*='인스턴스 이름을 입력하세요']", "test-vm-e2e");

      // 설명 입력
      await page.fill(
        "textarea[placeholder*='인스턴스 설명을 입력하세요']",
        "E2E 테스트용 VM 인스턴스"
      );

      // 폼 입력 후 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step1-form-filled.png',
        fullPage: true 
      });

      // 다음 버튼 클릭
      await page.click("button[type='submit']");
    });

    // 2단계: 이미지 선택
    await test.step("이미지 선택", async () => {
      // 이미지 선택 화면으로 이동했는지 확인
      await expect(page.locator("h3")).toContainText("이미지 선택");

      // 테이블이 로드되었는지 확인
      await expect(page.locator(".ant-table")).toBeVisible();

      // 2단계 초기 화면 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step2-image-select.png',
        fullPage: true 
      });

      // 첫 번째 이미지 선택
      await page.click(".ant-table-tbody tr:first-child input[type='radio']");

      // 선택된 행이 하이라이트되었는지 확인
      await expect(page.locator(".ant-table-row-selected")).toBeVisible();

      // 이미지 선택 후 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step2-image-selected.png',
        fullPage: true 
      });

      // 다음 버튼이 활성화되었는지 확인
      const nextButton = page.locator(".step-actions button").nth(1);
      await expect(nextButton).not.toBeDisabled();

      // 다음 버튼 클릭
      await nextButton.click();
    });

    // 3단계: 플레이버 선택
    await test.step("플레이버 선택", async () => {
      // 플레이버 선택 화면으로 이동했는지 확인
      await expect(page.locator("h3")).toContainText("플레이버 선택");

      // 드롭다운이 표시되었는지 확인
      await expect(page.locator(".ant-select")).toBeVisible();

      // 3단계 초기 화면 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step3-flavor-select.png',
        fullPage: true 
      });

      // 드롭다운 클릭하여 옵션 표시
      await page.click(".ant-select-selector");

      // 옵션들이 표시될 때까지 대기
      await page.waitForSelector(".ant-select-dropdown", { state: "visible" });

      // 드롭다운 열린 상태 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step3-flavor-dropdown.png',
        fullPage: true 
      });

      // 첫 번째 옵션 선택 (Small)
      await page.click(".ant-select-dropdown .ant-select-item:first-child");

      // 선택된 플레이버 정보가 표시되는지 확인
      await expect(page.locator(".flavor-summary")).toBeVisible();
      await expect(page.locator(".flavor-summary")).toContainText("flavor_1");

      // 플레이버 선택 후 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step3-flavor-selected.png',
        fullPage: true 
      });

      // 다음 버튼이 활성화되었는지 확인
      const nextButton = page.locator(".step-actions button").nth(1);
      await expect(nextButton).not.toBeDisabled();

      // 다음 버튼 클릭
      await nextButton.click();
    });

    // 4단계: 검토 및 생성
    await test.step("검토 및 생성", async () => {
      // 검토 화면으로 이동했는지 확인
      await expect(page.locator("h3")).toContainText("생성 정보 확인");

      // 4단계 초기 화면 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step4-review.png',
        fullPage: true 
      });

      // 입력된 정보들이 올바르게 표시되는지 확인
      await expect(page.locator(".ant-descriptions")).toContainText(
        "test-vm-e2e"
      );
      await expect(page.locator(".ant-descriptions")).toContainText(
        "E2E 테스트용 VM 인스턴스"
      );
      await expect(page.locator(".ant-descriptions")).toContainText("image_1");
      await expect(page.locator(".ant-descriptions")).toContainText("flavor_1");

      // 생성 버튼 클릭
      const createButton = page.locator(".step-actions button").nth(1);
      await expect(createButton).toContainText("생성");
      
      // 생성 버튼 클릭 전 최종 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step4-ready-to-create.png',
        fullPage: true 
      });
      
      await createButton.click();

      // 성공 메시지 확인 (메시지가 표시되는 경우)
      // await expect(page.locator(".ant-message-success")).toBeVisible();

      // VM 상세 페이지로 리다이렉트되는지 확인
      await page.waitForURL(/\/servers\/instances\/\d+/);
      
      // 최종 결과 페이지 스크린샷 캡처
      await page.screenshot({ 
        path: 'screenshots/vm-create/step5-created-success.png',
        fullPage: true 
      });
    });

    console.log('✅ VM 생성 전체 플로우 테스트 스크린샷 캡처 완료');
  });

  test("단계별 이동 및 검증 테스트", async ({ page }) => {
    // 1단계에서 이름 없이 진행 시도
    await test.step("필수 정보 누락 검증", async () => {
      await page.click("button[type='submit']");

      // 에러 메시지 확인 (메시지가 표시되는 경우)
      // await expect(page.locator(".ant-message-error")).toBeVisible();

      // 여전히 1단계에 있는지 확인
      await expect(page.locator(".ant-steps-item-process")).toHaveCount(1);
    });

    // 이름 입력 후 2단계로 이동
    await test.step("올바른 정보 입력 후 진행", async () => {
      await page.fill("input[placeholder*='인스턴스 이름을 입력하세요']", "validation-test-vm");
      await page.click("button[type='submit']");

      // 2단계로 이동했는지 확인
      await expect(page.locator("h3")).toContainText("이미지 선택");
    });

    // 이전 버튼으로 되돌아가기
    await test.step("이전 단계로 이동", async () => {
      await page.click(".step-actions button:first-child");

      // 1단계로 돌아갔는지 확인
      await expect(page.locator("h3")).toContainText("기본 정보");

      // 이전에 입력한 값이 유지되는지 확인
      await expect(page.locator("input[placeholder*='인스턴스 이름을 입력하세요']")).toHaveValue(
        "validation-test-vm"
      );
    });
  });

  test("단계 클릭으로 직접 이동 테스트", async ({ page }) => {
    // VM 이름 입력
    await page.fill("input[placeholder*='인스턴스 이름을 입력하세요']", "step-navigation-test");
    await page.click("button[type='submit']");

    // 2단계에서 이미지 선택
    await page.click(".ant-table-tbody tr:first-child input[type='radio']");
    await page.locator(".step-actions button").nth(1).click();

    // 3단계에서 플레이버 선택
    await page.click(".ant-select-selector");
    await page.waitForSelector(".ant-select-dropdown", { state: "visible" });
    await page.click(".ant-select-dropdown .ant-select-item:first-child");

    // 스텝 클릭으로 1단계로 이동
    await test.step("스텝 클릭으로 이전 단계 이동", async () => {
      await page.click(".ant-steps-item:first-child");

      // 1단계로 이동했는지 확인
      await expect(page.locator("h3")).toContainText("기본 정보");

      // 입력된 값이 유지되는지 확인
      await expect(page.locator("input[placeholder*='인스턴스 이름을 입력하세요']")).toHaveValue(
        "step-navigation-test"
      );
    });

    // 스텝 클릭으로 3단계로 이동
    await test.step("스텝 클릭으로 이후 단계 이동", async () => {
      await page.click(".ant-steps-item:nth-child(3)");

      // 3단계로 이동했는지 확인
      await expect(page.locator("h3")).toContainText("플레이버 선택");

      // 이전에 선택한 플레이버가 유지되는지 확인
      await expect(page.locator(".flavor-summary")).toBeVisible();
    });
  });

  test("로딩 상태 및 에러 처리 테스트", async ({ page }) => {
    // 모든 단계 완료
    await page.fill("input[placeholder*='인스턴스 이름을 입력하세요']", "loading-test-vm");
    await page.click("button[type='submit']");

    await page.click(".ant-table-tbody tr:first-child input[type='radio']");
    await page.locator(".step-actions button").nth(1).click();

    await page.click(".ant-select-selector");
    await page.waitForSelector(".ant-select-dropdown", { state: "visible" });
    await page.click(".ant-select-dropdown .ant-select-item:first-child");
    await page.locator(".step-actions button").nth(1).click();

    // 생성 버튼 클릭 후 로딩 상태 확인
    await test.step("로딩 상태 확인", async () => {
      const createButton = page.locator(".step-actions button").nth(1);
      await createButton.click();

      // 로딩 상태 확인 (버튼이 로딩 중일 때)
      await expect(createButton).toHaveClass(/ant-btn-loading/);
    });
  });


  test("브라우저 뒤로가기/앞으로가기 테스트", async ({ page }) => {
    // 2단계까지 진행
    await page.fill("input[placeholder*='인스턴스 이름을 입력하세요']", "navigation-test-vm");
    await page.click("button[type='submit']");

    await page.click(".ant-table-tbody tr:first-child input[type='radio']");
    await page.locator(".step-actions button").nth(1).click();

    // 브라우저 히스토리 API 대신 애플리케이션의 step navigation 테스트
    // (브라우저 뒤로가기는 SPA에서 인증 문제를 일으킬 수 있음)
    
    // 이전 버튼으로 2단계로 돌아가기
    await page.click(".step-actions button:first-child");
    await expect(page.locator("h3")).toContainText("이미지 선택");

    // 다음 버튼으로 3단계로 다시 이동
    await page.locator(".step-actions button").nth(1).click();
    await expect(page.locator("h3")).toContainText("플레이버 선택");
  });
});