import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import VmInstanceCreate from "./VmInstanceCreate.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";

// window.matchMedia mock
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// window.getComputedStyle mock
Object.defineProperty(window, "getComputedStyle", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(""),
    width: "0px",
    height: "0px",
  })),
});

// ant-design-vue의 message 객체를 모의(mock) 처리
vi.mock("ant-design-vue", async () => {
  const actual = await vi.importActual("ant-design-vue");
  return {
    ...actual,
    message: {
      config: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// VM API 모킹
vi.mock("@/api/vm", () => ({
  getVmApi: vi.fn().mockResolvedValue({
    createInstance: vi.fn(),
  }),
}));

// Vue Router 모킹
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

describe("VmInstanceCreate.vue: VM 인스턴스 생성 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("컴포넌트 렌더링", () => {
    it("VM 생성 컴포넌트가 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(VmInstanceCreate, {
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 메인 컨테이너가 렌더링되는지 확인
      expect(wrapper.find(".vm-instance-create").exists()).toBe(true);

      // Steps 컴포넌트가 렌더링되는지 확인
      expect(wrapper.find(".create-steps").exists()).toBe(true);

      // 컨텐츠 영역이 렌더링되는지 확인
      expect(wrapper.find(".step-content").exists()).toBe(true);
    });
  });
});
