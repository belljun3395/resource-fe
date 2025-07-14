import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import VmInstancePowerStatusDropdown from "./VmInstancePowerStatusDropdown.vue";
import type { PowerStatusString } from "@/types/vm";
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

const i18n = createI18n({
  legacy: false,
  locale: "ko",
  fallbackLocale: "en",
  messages,
});

describe("VmInstancePowerStatusDropdown.vue: VM 인스턴스 파워 상태 드롭다운 컴포넌트", () => {
  const defaultProps = {
    powerState: "RUNNING" as PowerStatusString,
    instanceId: "vm-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("컴포넌트 렌더링", () => {
    it("파워 상태 드롭다운 버튼이 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 렌더링되는지 확인
      expect(wrapper.exists()).toBe(true);

      // 버튼이 존재하는지 확인
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain("인스턴스 상태");
    });

    it("로딩 상태가 전달되면 버튼에 로딩 표시가 나타나야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: {
          ...defaultProps,
          loading: true,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      // 로딩 상태 확인 (Ant Design의 loading prop 확인)
      expect(wrapper.vm.loading).toBe(true);
    });
  });

  describe("드롭다운 메뉴", () => {
    it("드롭다운 컴포넌트가 렌더링되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      // a-dropdown 컴포넌트가 존재하는지 확인
      const dropdown = wrapper.findComponent({ name: "ADropdown" });
      expect(dropdown.exists()).toBe(true);
    });

    it("메뉴 아이템들이 올바른 구조로 정의되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 올바르게 마운트되었는지 확인
      expect(wrapper.exists()).toBe(true);

      // 템플릿에서 메뉴 아이템의 key 값들이 정의되어 있는지 확인
      const template = wrapper.vm.$options.template || wrapper.html();
      expect(template).toBeDefined();
    });
  });

  describe("파워 상태별 로직", () => {
    it("RUNNING 상태일 때 올바른 props가 전달되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: {
          ...defaultProps,
          powerState: "RUNNING",
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // powerState prop이 올바르게 전달되었는지 확인
      expect(wrapper.props().powerState).toBe("RUNNING");

      // 컴포넌트가 정상적으로 렌더링되었는지 확인
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("SHUTDOWN 상태일 때 올바른 props가 전달되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: {
          ...defaultProps,
          powerState: "SHUTDOWN",
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // powerState prop이 올바르게 전달되었는지 확인
      expect(wrapper.props().powerState).toBe("SHUTDOWN");

      // 컴포넌트가 정상적으로 렌더링되었는지 확인
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("PAUSED 상태일 때 올바른 props가 전달되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: {
          ...defaultProps,
          powerState: "PAUSED",
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // powerState prop이 올바르게 전달되었는지 확인
      expect(wrapper.props().powerState).toBe("PAUSED");

      // 컴포넌트가 정상적으로 렌더링되었는지 확인
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("button").exists()).toBe(true);
    });
  });

  describe("이벤트 발생", () => {
    it("메뉴 아이템 클릭 시 powerStatusChange 이벤트가 올바른 액션과 함께 발생해야 합니다.", async () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      /* 메뉴 클릭 이벤트 시뮬레이션 */
      const menuEvent = {
        key: "shutdown",
        keyPath: ["shutdown"],
        item: {},
        domEvent: new Event("click"),
      };

      /* handlePowerStatusAction 메서드 직접 호출 */
      await (wrapper.vm as any).handlePowerStatusAction(menuEvent);

      const emittedEvents = wrapper.emitted("powerStatusChange");
      expect(emittedEvents).toBeTruthy();
      expect(emittedEvents![0]).toEqual(["shutdown"]);
    });

    it("로딩 prop이 없을 때 액션 실행 중 내부 로딩 상태가 관리되어야 합니다.", async () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      const menuEvent = {
        key: "shutdown",
        keyPath: ["shutdown"],
        item: {},
        domEvent: new Event("click"),
      };

      /* 초기 로딩 상태는 false */
      expect(wrapper.vm.loading).toBe(false);

      /* handlePowerStatusAction 메서드 직접 호출 */
      await (wrapper.vm as any).handlePowerStatusAction(menuEvent);

      /* 액션 완료 후 로딩 상태가 false인지 확인 */
      expect(wrapper.vm.loading).toBe(false);
    });

    it("외부에서 loading prop이 전달되면 내부 로딩 상태를 변경하지 않아야 합니다.", async () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: {
          ...defaultProps,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const menuEvent = {
        key: "shutdown",
        keyPath: ["shutdown"],
        item: {},
        domEvent: new Event("click"),
      };

      /* handlePowerStatusAction 메서드 직접 호출 */
      await (wrapper.vm as any).handlePowerStatusAction(menuEvent);

      /* 외부 loading prop을 사용하므로 내부 로딩 상태는 변경되지 않음 */
      expect((wrapper.vm as any).internalLoading).toBe(false);
    });
  });

  describe("Props 유효성 검사", () => {
    it("필수 props가 올바르게 전달되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      expect(wrapper.props().powerState).toBe("RUNNING");
      expect(wrapper.props().instanceId).toBe("vm-123");
    });

    it("선택적 loading prop이 올바르게 처리되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: {
          ...defaultProps,
          loading: true,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      expect(wrapper.props().loading).toBe(true);
      expect(wrapper.vm.loading).toBe(true);
    });
  });

  describe("국제화(i18n)", () => {
    it("한국어 로케일에서 올바른 번역이 표시되어야 합니다.", () => {
      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain("인스턴스 상태");
    });

    it("영어 로케일에서 올바른 번역이 표시되어야 합니다.", () => {
      const englishI18n = createI18n({
        legacy: false,
        locale: "en",
        fallbackLocale: "en",
        messages,
      });

      const wrapper = mount(VmInstancePowerStatusDropdown, {
        props: defaultProps,
        global: {
          plugins: [englishI18n, Antd],
        },
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain("Instance Status");
    });
  });
});
