# E2E 테스트 가이드

## 개요
이 프로젝트는 Playwright를 사용하여 E2E 테스트 및 스크린샷 자동화를 제공합니다.

## 사용 가능한 스크립트

### 기본 E2E 테스트
```bash
# 모든 E2E 테스트 실행 (headless)
pnpm test:e2e

# 브라우저 UI와 함께 테스트 실행
pnpm test:e2e:headed

# Playwright UI 모드로 테스트 실행
pnpm test:e2e:ui

# 디버그 모드로 테스트 실행
pnpm test:e2e:debug
```

### 유틸리티 스크립트
```bash
# 테스트 리포트 보기
pnpm test:e2e:report

# 스크린샷 폴더 정리
pnpm screenshots:clean

# Playwright 브라우저 설치/업데이트
pnpm test:e2e:install
```

## 자동화된 스크린샷

### 저장 위치
모든 스크린샷은 `screenshots/` 폴더에 저장됩니다.

### 테스트 항목
현재 구현된 테스트는 다음과 같은 스크린샷을 자동으로 생성합니다:
1. **기본 스크린샷**: 상세 화면의 전체 페이지 및 컴포넌트 단위 캡처
2. **상태별 스크린샷**: 다양한 상태별 화면 캡처
3. **반응형 스크린샷**: 데스크톱, 태블릿, 모바일 화면 크기별 캡처

## 환경변수 설정

### 포트 및 URL 커스터마이징
```bash
# 환경변수로 포트 설정 (Mock 서버 포트 변경)
E2E_PORT=3001 pnpm test:e2e

# 환경변수로 베이스 URL 설정 (외부 서버 테스트)
E2E_BASE_URL=https://dev.example.com pnpm test:e2e

# 로컬 다른 포트에 실행 중인 서버 테스트
E2E_BASE_URL=http://localhost:4000 pnpm test:e2e

# 환경변수 조합 사용 (Mock 서버를 특정 포트에 시작하고 테스트)
E2E_PORT=3001 pnpm test:e2e:headed

# .env 파일 사용 (선택사항)
cp .env.example .env
# .env 파일을 편집하여 원하는 설정값 입력
```

### 사용 가능한 환경변수
- `E2E_PORT`: Mock 서버 포트 (기본값: 3000)
  - 로컬 Mock 서버의 포트를 지정합니다
  - `E2E_BASE_URL`이 설정되지 않은 경우에만 사용됩니다
- `E2E_BASE_URL`: 테스트 대상 URL (기본값: http://localhost:${E2E_PORT})
  - 외부 서버 테스트 시 사용합니다
  - 설정 시 Mock 서버를 시작하지 않습니다

## Mock 서버 통합

Playwright 설정에서 `webServer` 옵션을 통해 Mock 서버가 자동으로 관리됩니다:

### 로컬 Mock 서버 사용 (기본값)
- 테스트 실행 시 `pnpm dev:mock` 명령으로 Mock 서버 자동 시작
- 환경변수 `E2E_PORT`로 포트 설정 가능 (기본값: 3000)
- CI 환경이 아닐 경우 기존 서버 재사용
- 테스트 완료 후 자동 종료

### 외부 서버 사용
- `E2E_BASE_URL`이 설정되면 Mock 서버를 시작하지 않음
- 이미 실행 중인 개발/스테이징 서버에 대해 테스트 가능
- 외부 API나 다른 환경에서의 E2E 테스트에 유용

## 로딩 상태 처리

Mock API의 의도적인 지연을 고려하여 다음 로직을 구현했습니다:

1. 컴포넌트 DOM 로딩 대기
2. `.loading` 클래스 제거 대기 (실제 데이터 로딩 완료)
3. 페이지 제목 변경 대기
4. 최대 15초 타임아웃 설정

## 개발 워크플로우

### 1. 빠른 테스트 실행
```bash
# 🚀 가장 간단한 방법
pnpm test:e2e:headed

# 🎯 다른 모드로 실행하고 싶다면
pnpm test:e2e         # 백그라운드 실행
pnpm test:e2e:ui      # UI 모드
pnpm test:e2e:debug   # 디버그 모드

# 🔧 포트를 변경하고 싶다면
E2E_PORT=3001 pnpm test:e2e:headed

# 🌐 외부 서버에 대해 테스트하고 싶다면
E2E_BASE_URL=https://dev.example.com pnpm test:e2e:headed
```

**자동 Mock 서버 관리:**
- 로컬 테스트: Mock 서버가 자동으로 시작됩니다
- 외부 서버 테스트: Mock 서버를 시작하지 않고 지정된 URL로 테스트합니다

### 2. 스크린샷 업데이트
```bash
pnpm screenshots:clean  # 기존 스크린샷 정리
pnpm test:e2e          # 새로운 스크린샷 생성
```

### 3. 테스트 결과 확인
```bash
pnpm test:e2e:report    # HTML 리포트 확인
```

## 문제 해결

### 브라우저 설치 문제
```bash
pnpm test:e2e:install
```

### Mock 서버 연결 문제
- Playwright 설정의 `webServer` 옵션이 자동으로 처리
- 수동으로 실행하려면: `pnpm dev:mock`

### 스크린샷 또는 테스트 실패
1. Mock API 응답 시간 확인
2. 로딩 대기 로직 검토  
3. 타임아웃 설정 조정
4. 환경변수 설정 확인

### 외부 서버 연결 문제
```bash
# 외부 서버가 실행 중인지 확인
curl -I $E2E_BASE_URL

# 환경변수 확인
echo $E2E_BASE_URL
echo $E2E_PORT

# 로컬 서버 강제 사용
unset E2E_BASE_URL && pnpm test:e2e:headed
```