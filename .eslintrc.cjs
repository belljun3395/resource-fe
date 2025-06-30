module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true, // Vue 3 setup script 매크로 지원
  },
  extends: [
    'plugin:vue/vue3-essential', // Vue 3 필수 규칙
    'eslint:recommended', // 기본 ESLint 권장 규칙
    '@vue/eslint-config-typescript', // TypeScript용 Vue ESLint 설정
    '@vue/eslint-config-prettier/skip-formatting', // Prettier와 충돌 방지
  ],
  parserOptions: {
    ecmaVersion: 'latest', // 최신 ECMAScript 문법 허용
  },
  rules: {
    'vue/multi-word-component-names': 'off', // 단일 단어 컴포넌트 이름 허용
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고 (단, _로 시작하는 인자 무시)
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 프로덕션에선 console 경고
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 프로덕션에선 debugger 경고
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true, // 테스트 파일에서는 jest 환경
      },
    },
  ],
};
