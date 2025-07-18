import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import Antd from "ant-design-vue";
import InstanceDetailView from "./InstanceDetailView.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";
import type { PowerStatusString } from "@/types/vm";

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

// VM API mock
vi.mock("@/api/vm", () => ({
  getVmApi: vi.fn(() => ({
    getInstance: vi.fn(),
    updatePowerStatus: vi.fn(),
    deleteInstance: vi.fn(),
  })),
}));

const i18n = createI18n({
  legacy: false,
  locale: "ko",
  fallbackLocale: "en",
  messages,
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    {
      path: "/servers/instances",
      component: { template: "<div>Instances</div>" },
    },
    { path: "/servers/instances/:instanceId", component: InstanceDetailView },
  ],
});

describe("InstanceDetailView.vue: VM 인스턴스 상세 뷰", () => {
  const defaultProps = {
    instanceId: "vm-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    router.push("/");
  });

  describe("삭제 버튼 상태 관리", () => {
    it("RUNNING 상태에서 삭제 버튼이 비활성화되어야 합니다.", async () => {
      const wrapper = mount(InstanceDetailView, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd, router],
        },
      });

      // RUNNING 상태로 설정
      (wrapper.vm as any).instanceDetails.powerState =
        "RUNNING" as PowerStatusString;
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('[key="delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(deleteButton.attributes("disabled")).toBeDefined();
    });

    it("SHUTDOWN 상태에서 삭제 버튼이 활성화되어야 합니다.", async () => {
      const wrapper = mount(InstanceDetailView, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd, router],
        },
      });

      // SHUTDOWN 상태로 설정
      (wrapper.vm as any).instanceDetails.powerState =
        "SHUTDOWN" as PowerStatusString;
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('[key="delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(deleteButton.attributes("disabled")).toBeUndefined();
    });

    it("PAUSED 상태에서 삭제 버튼이 활성화되어야 합니다.", async () => {
      const wrapper = mount(InstanceDetailView, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd, router],
        },
      });

      // PAUSED 상태로 설정
      (wrapper.vm as any).instanceDetails.powerState =
        "PAUSED" as PowerStatusString;
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('[key="delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(deleteButton.attributes("disabled")).toBeUndefined();
    });

    it("NOSTATE 상태에서 삭제 버튼이 활성화되어야 합니다.", async () => {
      const wrapper = mount(InstanceDetailView, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd, router],
        },
      });

      // NOSTATE 상태로 설정 (기본값)
      (wrapper.vm as any).instanceDetails.powerState =
        "NOSTATE" as PowerStatusString;
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('[key="delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(deleteButton.attributes("disabled")).toBeUndefined();
    });
  });

  describe("삭제 버튼 클릭 동작", () => {
    it("삭제 버튼이 활성화 상태일 때 클릭하면 모달이 열려야 합니다.", async () => {
      const wrapper = mount(InstanceDetailView, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd, router],
        },
      });

      // SHUTDOWN 상태로 설정하여 버튼 활성화
      (wrapper.vm as any).instanceDetails.powerState =
        "SHUTDOWN" as PowerStatusString;
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('[key="delete"]');
      expect((wrapper.vm as any).showDeleteModal).toBe(false);

      await deleteButton.trigger("click");
      expect((wrapper.vm as any).showDeleteModal).toBe(true);
    });

    it("삭제 버튼이 비활성화 상태일 때는 클릭이 무시되어야 합니다.", async () => {
      const wrapper = mount(InstanceDetailView, {
        props: defaultProps,
        global: {
          plugins: [i18n, Antd, router],
        },
      });

      // RUNNING 상태로 설정하여 버튼 비활성화
      (wrapper.vm as any).instanceDetails.powerState =
        "RUNNING" as PowerStatusString;
      await wrapper.vm.$nextTick();

      const deleteButton = wrapper.find('[key="delete"]');
      expect((wrapper.vm as any).showDeleteModal).toBe(false);

      // 비활성화된 버튼은 클릭 이벤트가 발생하지 않음
      await deleteButton.trigger("click");
      expect((wrapper.vm as any).showDeleteModal).toBe(false);
    });
  });
});
