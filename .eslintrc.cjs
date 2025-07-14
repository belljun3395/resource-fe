module.exports = {
  root: true,
  env: {
    node: true,
    "vue/setup-compiler-macros": true, // Vue 3 setup script 매크로 지원
  },
  extends: [
    // Vue 3의 필수 ESLint 규칙 세트 (권장 기본값)
    "plugin:vue/vue3-essential",
    // JavaScript의 기본 ESLint 권장 규칙 세트
    "eslint:recommended",
    // TypeScript 지원을 위한 Vue 공식 ESLint 설정
    "@vue/eslint-config-typescript",
    // Prettier와 충돌하는 포맷팅 규칙을 비활성화 (Prettier 포맷팅만 사용)
    "@vue/eslint-config-prettier/skip-formatting",
    // Storybook 관련 권장 ESLint 규칙 세트
    "plugin:storybook/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest", // 최신 ECMAScript 문법 허용
  },
  rules: {
    "vue/multi-word-component-names": "off", // 단일 단어 컴포넌트 이름 허용
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 사용하지 않는 변수 경고 (단, _로 시작하는 인자 무시)
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // 프로덕션에선 console 경고
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off", // 프로덕션에선 debugger 경고
    "import/no-cycle": "error", // 순환 임포트 금지
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true, // 테스트 파일에서는 jest 환경
      },
    },
  ],
};
