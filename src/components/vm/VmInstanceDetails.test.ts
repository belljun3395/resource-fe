import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Antd from "ant-design-vue";
import { message } from "ant-design-vue";
import VmInstanceDetails from "./VmInstanceDetails.vue";
import { VmInstance } from "@/types/vm";
import type { VmInstanceData } from "@/types/vm";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";

// window.matchMedia mock
// JSDOM에는 matchMedia가 없으므로, ant-design-vue 컴포넌트의 반응형 로직이 오류를 일으키지 않도록 mock 처리합니다.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ant-design-vue의 message 객체를 모의(mock) 처리합니다.
// 이를 통해 실제 메시지 UI를 띄우지 않고, 함수 호출 여부와 전달된 인자만 검증할 수 있습니다.
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

// navigator.clipboard API를 모의 처리합니다.
// 실제 클립보드에 접근하지 않고, writeText 함수가 올바른 값으로 호출되었는지 검증합니다.
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

describe("VmInstanceDetails.vue: VM 인스턴스 상세 정보 컴포넌트", () => {
  let mockVmInstance: VmInstance;

  // 각 테스트 케이스 실행 전에 공통적으로 사용될 초기화 로직을 설정합니다.
  beforeEach(() => {
    // 모든 모의(mock) 함수의 호출 기록을 초기화합니다.
    vi.clearAllMocks();

    // 테스트에 사용될 가상 머신 인스턴스 데이터를 생성합니다.
    const mockData: VmInstanceData = {
      name: "test-vm-instance",
      id: "vm-123",
      powerState: "RUNNING",
      alias: "test-alias",
      host: "test-host.example.com",
    };

    mockVmInstance = new VmInstance(mockData);
    // 클립보드 쓰기 함수가 기본적으로 성공하도록 설정합니다.
    mockWriteText.mockResolvedValue(undefined);
  });

  describe("컴포넌트 렌더링", () => {
    it("props로 전달된 데이터가 올바르게 렌더링되어야 합니다.", () => {
      // 컴포넌트를 마운트합니다.
      const wrapper = mount(VmInstanceDetails, {
        props: { instanceDetails: mockVmInstance },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 렌더링된 텍스트에 VM 인스턴스의 각 속성값이 포함되어 있는지 확인합니다.
      const text = wrapper.text();
      expect(text).toContain("test-vm-instance");
      expect(text).toContain("vm-123");
      expect(text).toContain("RUNNING");
      expect(text).toContain("test-alias");
      expect(text).toContain("test-host.example.com");
    });
  });

  describe("클립보드 복사 기능", () => {
    it("복사 버튼 클릭 시 navigator.clipboard.writeText가 올바른 값으로 호출되어야 합니다.", async () => {
      const wrapper = mount(VmInstanceDetails, {
        props: { instanceDetails: mockVmInstance },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 복사 버튼을 찾아 클릭 이벤트를 발생시킵니다.
      const copyButtons = wrapper.findAll(".copy-btn");
      await copyButtons[0].trigger("click");

      // writeText 함수가 VM ID 'vm-123'으로 호출되었는지 확인합니다.
      expect(mockWriteText).toHaveBeenCalledWith("vm-123");
    });

    it("클립보드 복사 성공 시 성공 메시지가 표시되어야 합니다.", async () => {
      const wrapper = mount(VmInstanceDetails, {
        props: { instanceDetails: mockVmInstance },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 복사 버튼을 클릭합니다.
      await wrapper.find(".copy-btn").trigger("click");
      // Promise가 처리될 때까지 기다립니다.
      await flushPromises();

      // message.success 함수가 올바른 내용으로 호출되었는지 확인합니다.
      expect(message.success).toHaveBeenCalledWith({
        content: "ID copied to clipboard!",
        style: { marginTop: "100px" },
      });
    });

    it("클립보드 복사 실패 시 에러 메시지가 표시되어야 합니다.", async () => {
      const error = new Error("Copy failed");
      // 클립보드 쓰기 함수가 실패하도록 설정합니다.
      mockWriteText.mockRejectedValue(error);

      const wrapper = mount(VmInstanceDetails, {
        props: { instanceDetails: mockVmInstance },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 복사 버튼을 클릭합니다.
      await wrapper.find(".copy-btn").trigger("click");
      // Promise의 reject 처리가 완료될 때까지 기다립니다.
      await flushPromises();

      // message.error 함수가 올바른 내용으로 호출되었는지 확인합니다.
      expect(message.error).toHaveBeenCalledWith({
        content: `Copy failed: ${error}`,
        style: { marginTop: "100px" },
      });
    });
  });

  describe("Props 유효성 검사", () => {
    it("instanceDetails prop으로 VmInstance 객체를 받아야 합니다.", () => {
      const wrapper = mount(VmInstanceDetails, {
        props: { instanceDetails: mockVmInstance },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 전달된 prop이 컴포넌트의 props와 일치하는지 확인합니다.
      expect(wrapper.props().instanceDetails).toStrictEqual(mockVmInstance);
    });
  });

  describe("국제화(i18n)", () => {
    it("각 라벨에 올바른 번역 키가 사용되어야 합니다.", () => {
      const wrapper = mount(VmInstanceDetails, {
        props: { instanceDetails: mockVmInstance },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Name");
      expect(text).toContain("ID");
      expect(text).toContain("Power State");
      expect(text).toContain("Alias");
      expect(text).toContain("Host");
    });
  });
});
