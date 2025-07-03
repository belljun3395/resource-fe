import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Antd from "ant-design-vue";
import DeleteConfirmModal from "./DeleteConfirmModal.vue";
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

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

describe("DeleteConfirmModal.vue: VM 인스턴스 삭제 확인 모달 컴포넌트", () => {
  const defaultProps = {
    open: true,
    instanceName: "test-vm-instance",
    loading: false,
  };

  // 각 테스트 케이스 실행 전에 공통적으로 사용될 초기화 로직을 설정합니다.
  beforeEach(() => {
    // 모든 모의(mock) 함수의 호출 기록을 초기화합니다.
    vi.clearAllMocks();

    // DOM 요소 생성
    if (!document.getElementById("app")) {
      const app = document.createElement("div");
      app.id = "app";
      document.body.appendChild(app);
    }

    // 이전 테스트에서 남아있을 수 있는 모달 제거
    const existingModals = document.querySelectorAll(".ant-modal-wrap");
    existingModals.forEach((modal) => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
  });

  describe("컴포넌트 렌더링", () => {
    it("모달이 열린 상태에서 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 모달이 DOM에서 visible 상태인지 확인
      const modal = wrapper.findComponent({ name: "AModal" });
      expect(modal.exists()).toBe(true);
      expect(modal.props("open")).toBe(true);
    });

    it("props로 전달된 인스턴스 이름이 메시지에 포함되어야 합니다.", async () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        attachTo: document.getElementById("app")!,
        global: {
          plugins: [i18n, Antd],
        },
      });

      await flushPromises();
      // 모달이 body에 렌더링되므로 document.body에서 텍스트 확인
      const bodyText = document.body.textContent || "";
      expect(bodyText).toContain("test-vm-instance");
      wrapper.unmount();
    });

    it("모달이 닫힌 상태에서는 렌더링되지 않아야 합니다.", () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: {
          ...defaultProps,
          open: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const modal = wrapper.findComponent({ name: "AModal" });
      expect(modal.props("open")).toBe(false);
    });
  });

  describe("Props 처리", () => {
    it("loading prop이 true일 때 확인 버튼이 로딩 상태여야 합니다.", () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: {
          ...defaultProps,
          loading: true,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const modal = wrapper.findComponent({ name: "AModal" });
      expect(modal.props("confirmLoading")).toBe(true);
    });

    it("모달이 danger 타입으로 설정되어야 합니다.", () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      const modal = wrapper.findComponent({ name: "AModal" });
      expect(modal.props("okType")).toBe("danger");
    });
  });

  describe("이벤트 처리", () => {
    it("확인 버튼 클릭 시 confirm 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      const modal = wrapper.findComponent({ name: "AModal" });
      await modal.vm.$emit("ok");
      await flushPromises();

      expect(wrapper.emitted("confirm")).toBeTruthy();
      expect(wrapper.emitted("confirm")).toHaveLength(1);
    });

    it("취소 버튼 클릭 시 cancel 이벤트와 update:open 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd],
        },
      });

      const modal = wrapper.findComponent({ name: "AModal" });
      await modal.vm.$emit("cancel");
      await flushPromises();

      expect(wrapper.emitted("cancel")).toBeTruthy();
      expect(wrapper.emitted("update:open")).toBeTruthy();
      const updateOpenEvents = wrapper.emitted("update:open");
      expect(updateOpenEvents).toBeTruthy();
      expect(updateOpenEvents![0]).toEqual([false]);
    });
  });

  describe("v-model 바인딩", () => {
    it("open prop 변경 시 모달 상태가 업데이트되어야 합니다.", async () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: {
          ...defaultProps,
          open: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      expect(wrapper.findComponent({ name: "AModal" }).props("open")).toBe(
        false
      );

      await wrapper.setProps({ open: true });
      expect(wrapper.findComponent({ name: "AModal" }).props("open")).toBe(
        true
      );
    });
  });

  describe("국제화(i18n)", () => {
    it("다국어 메시지가 올바르게 표시되어야 합니다.", async () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        attachTo: document.getElementById("app")!,
        global: {
          plugins: [i18n, Antd],
        },
      });

      await flushPromises();
      // 영어 메시지가 표시되는지 확인 (fallback)
      const bodyText = document.body.textContent || "";
      expect(bodyText).toContain("test-vm-instance");
      wrapper.unmount();
    });
  });

  describe("다양한 인스턴스 이름 처리", () => {
    it("긴 인스턴스 이름도 올바르게 표시되어야 합니다.", async () => {
      const longName =
        "very-long-instance-name-for-testing-ui-components-with-extensive-data";
      const wrapper = mount(DeleteConfirmModal, {
        props: {
          ...defaultProps,
          instanceName: longName,
        },
        attachTo: document.getElementById("app")!,
        global: {
          plugins: [i18n, Antd],
        },
      });

      await flushPromises();
      const bodyText = document.body.textContent || "";
      expect(bodyText).toContain(longName);
      wrapper.unmount();
    });

    it("특수 문자가 포함된 인스턴스 이름도 올바르게 표시되어야 합니다.", async () => {
      const specialName = "test-vm_instance-001@production";
      const wrapper = mount(DeleteConfirmModal, {
        props: {
          ...defaultProps,
          instanceName: specialName,
        },
        attachTo: document.getElementById("app")!,
        global: {
          plugins: [i18n, Antd],
        },
      });

      await flushPromises();
      const bodyText = document.body.textContent || "";
      expect(bodyText).toContain(specialName);
      wrapper.unmount();
    });
  });

  describe("컴포넌트 구조", () => {
    it("삭제 경고 메시지가 올바른 스타일로 렌더링되어야 합니다.", async () => {
      const wrapper = mount(DeleteConfirmModal, {
        props: defaultProps,
        attachTo: document.getElementById("app")!,
        global: {
          plugins: [i18n, Antd],
        },
      });

      await flushPromises();
      // body에서 delete-warning 클래스를 가진 요소 찾기
      const warningElement = document.body.querySelector(".delete-warning");
      expect(warningElement).toBeTruthy();
      wrapper.unmount();
    });
  });
});
