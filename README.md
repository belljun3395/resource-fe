# Resource-FE

가상 머신 리소스 관리 시스템의 프론트엔드 애플리케이션입니다.

## 🎯 프로젝트 개요

Vue 3 + TypeScript 기반의 현대적인 SPA(Single Page Application)로, 가상 머신 리소스의 생성, 조회, 수정, 삭제(CRUD) 기능을 제공하는 웹 애플리케이션입니다.

## 🛠 기술 스택

### 핵심 프레임워크
- **Vue 3** (3.5.13) - Composition API
- **TypeScript** (5.5.4) - 정적 타입 검사
- **Vite** (5.4.18) - 빌드 도구 및 개발 서버

### UI/UX
- **Ant Design Vue** (4.0.0-rc.6) - UI 컴포넌트 라이브러리
- **Vue I18n** (9.14.4) - 국제화 지원 (한국어/영어)

### 상태 관리 및 데이터
- **Pinia** (2.3.1) - 상태 관리
- **Vue Router** (4.5.0) - 라우팅
- **Axios** (1.10.0) - HTTP 클라이언트
- **TanStack Vue Query** (5.74.6) - 서버 상태 관리

### 폼 검증
- **VeeValidate** (4.15.0) - 폼 검증
- **Yup** (1.6.1) & **Zod** (3.24.3) - 스키마 검증

### 개발 도구
- **Vitest** - 단위 테스트
- **Storybook** - 컴포넌트 개발 환경
- **ESLint** + **Prettier** - 코드 품질 관리

## 📁 프로젝트 구조

```
src/
├── api/                    # API 관련 파일
│   └── api.ts             # Axios 인스턴스 설정
├── assets/                # 정적 자산
│   └── images/           # 이미지 파일들
├── components/            # Vue 컴포넌트
│   ├── AppHeader.vue     # 앱 헤더 컴포넌트
│   ├── LoginForm.vue     # 로그인 폼 컴포넌트
│   └── stories/          # Storybook 스토리
├── composables/           # Vue Composition Functions
│   └── loginFormValidation.ts
├── locales/               # 국제화 설정
│   └── index.ts
├── router/                # 라우팅 설정
│   └── index.ts
├── store/                 # 상태 관리 (Pinia)
│   └── userStore.ts      # 사용자 상태 관리
├── types/                 # TypeScript 타입 정의
│   ├── message/
│   │   └── loginMsg.ts
│   └── user.ts
├── utils/                 # 유틸리티 함수
│   ├── cookies.ts        # 쿠키 관리
│   └── date.ts          # 날짜 유틸리티
├── views/                 # 페이지 컴포넌트
│   ├── LoginPage.vue     # 로그인 페이지
│   └── NotFoundPage.vue  # 404 페이지
├── App.vue               # 루트 컴포넌트
└── main.ts              # 앱 진입점
```

## 🚀 시작하기

### 사전 요구사항
- Node.js (18.x 이상)
- pnpm (권장) 또는 npm

### 설치 및 실행

1. **의존성 설치**
```bash
pnpm install
```

2. **개발 서버 실행**
```bash
pnpm dev
```
브라우저에서 `http://localhost:3000` 으로 접속

3. **프로덕션 빌드**
```bash
pnpm build
```

## 📜 사용 가능한 스크립트

| 명령어 | 설명 |
|-------|------|
| `pnpm dev` | 개발 서버 실행 (포트 3000) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드된 앱 미리보기 |
| `pnpm test` | 단위 테스트 실행 |
| `pnpm test:ui` | 테스트 UI 실행 |
| `pnpm test:coverage` | 테스트 커버리지 측정 |
| `pnpm lint` | ESLint 실행 및 자동 수정 |
| `pnpm format` | Prettier로 코드 포맷팅 |
| `pnpm storybook` | Storybook 개발 서버 실행 |
| `pnpm build-storybook` | Storybook 정적 빌드 |

## ⚙️ 환경 설정

### 환경 변수
프로젝트 루트에 `.env` 파일을 생성하여 환경별 설정을 관리하세요.

```bash
# API 서버 URL
VITE_API_URL=http://localhost:8080/api

# 기타 환경 변수
VITE_APP_TITLE=Resource Management System
```

### TypeScript 설정
- **타겟**: ES2020
- **모듈 해석**: bundler
- **엄격 모드**: 활성화
- **경로 별칭**: `@/*` → `src/*`

## 🏗️ 아키텍처 특징

### 인증 시스템
- 쿠키 기반 세션 관리
- 라우터 가드를 통한 접근 제어
- Pinia를 통한 전역 사용자 상태 관리

### 컴포넌트 설계
- **재사용성**: props/emit 기반 컴포넌트 설계
- **타입 안전성**: TypeScript 인터페이스 활용
- **접근성**: Ant Design Vue의 접근성 기본 지원

### 상태 관리
- **로컬 상태**: Vue 3 Composition API
- **전역 상태**: Pinia stores
- **서버 상태**: TanStack Vue Query (향후 가상 머신 데이터 관리)
