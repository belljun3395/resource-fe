import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import FlavorSelectStep from "./FlavorSelectStep.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";
import type { VmCreateFormData } from "@/types/vm-form";
import type { FlavorSpec } from "@/types/flavor";

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

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

describe("FlavorSelectStep.vue: VM 생성 플레이버 선택 단계", () => {
  let mockFormData: VmCreateFormData;
  let mockFlavors: FlavorSpec[];

  beforeEach(() => {
    mockFormData = {
      name: "test-vm",
      description: "test description",
      imageId: 1,
      flavorId: null,
    };

    mockFlavors = [
      {
        id: 1,
        name: "Small",
        description: "Small instance",
        vcpu: 1,
        memory: 1024,
        rootDisk: 10,
      },
      {
        id: 2,
        name: "Medium",
        description: "Medium instance",
        vcpu: 2,
        memory: 2048,
        rootDisk: 20,
      },
      {
        id: 3,
        name: "Large",
        description: "Large instance",
        vcpu: 4,
        memory: 4096,
        rootDisk: 40,
      },
    ];
  });

  describe("컴포넌트 렌더링", () => {
    it("플레이버 선택 드롭다운이 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 제목이 렌더링되는지 확인
      expect(wrapper.find("h3").text()).toContain("Select Flavor");

      // 드롭다운이 렌더링되는지 확인
      expect(wrapper.find(".ant-select").exists()).toBe(true);

      // 이전/다음 버튼이 렌더링되는지 확인
      const buttons = wrapper.findAll(".step-actions button");
      expect(buttons).toHaveLength(2);
    });

    it("플레이버가 선택되지 않았을 때 다음 버튼이 비활성화되어야 합니다.", () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      expect(nextButton.attributes("disabled")).toBeDefined();
    });

    it("플레이버가 선택되었을 때 다음 버튼이 활성화되어야 합니다.", () => {
      const formDataWithFlavor = { ...mockFormData, flavorId: 1 };

      const wrapper = mount(FlavorSelectStep, {
        props: { formData: formDataWithFlavor, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      expect(nextButton.attributes("disabled")).toBeUndefined();
    });
  });

  describe("플레이버 선택 기능", () => {
    it("플레이버 선택 시 update:form-data 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 플레이버 선택 시뮬레이션
      await wrapper.setProps({
        formData: { ...mockFormData, flavorId: 1 },
      });

      // 드롭다운에서 직접 선택 이벤트 발생
      const select = wrapper.findComponent({ name: "ASelect" });
      await select.vm.$emit("change", 1);
    });

    it("플레이버 선택 시 선택된 플레이버 정보가 표시되어야 합니다.", async () => {
      const formDataWithFlavor = { ...mockFormData, flavorId: 1 };

      const wrapper = mount(FlavorSelectStep, {
        props: { formData: formDataWithFlavor, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 선택된 플레이버 정보가 표시되는지 확인
      const flavorSummary = wrapper.find(".flavor-summary");
      expect(flavorSummary.exists()).toBe(true);

      const summaryText = flavorSummary.text();
      expect(summaryText).toContain("Small");
      expect(summaryText).toContain("Small instance");
      expect(summaryText).toContain("1 vCPU");
      expect(summaryText).toContain("1024 MB");
      expect(summaryText).toContain("10 GB");
    });

    it("플레이버가 선택되지 않았을 때 플레이버 정보가 표시되지 않아야 합니다.", () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 선택된 플레이버 정보가 표시되지 않는지 확인
      const flavorSummary = wrapper.find(".flavor-summary");
      expect(flavorSummary.exists()).toBe(false);
    });
  });

  describe("이벤트 처리", () => {
    it("이전 버튼 클릭 시 previous 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const previousButton = wrapper.findAll(".step-actions button")[0];
      await previousButton.trigger("click");

      // previous 이벤트가 발생했는지 확인
      const emittedEvents = wrapper.emitted("previous");
      expect(emittedEvents).toBeTruthy();
    });

    it("다음 버튼 클릭 시 next 이벤트가 발생해야 합니다.", async () => {
      const formDataWithFlavor = { ...mockFormData, flavorId: 1 };

      const wrapper = mount(FlavorSelectStep, {
        props: { formData: formDataWithFlavor, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      await nextButton.trigger("click");

      // next 이벤트가 발생했는지 확인
      const emittedEvents = wrapper.emitted("next");
      expect(emittedEvents).toBeTruthy();
    });
  });

  describe("로딩 상태", () => {
    it("로딩 상태일 때 다음 버튼이 로딩 상태로 표시되어야 합니다.", () => {
      const formDataWithFlavor = { ...mockFormData, flavorId: 1 };

      const wrapper = mount(FlavorSelectStep, {
        props: {
          formData: formDataWithFlavor,
          flavors: mockFlavors,
          loading: true,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      expect(nextButton.classes()).toContain("ant-btn-loading");
    });

    it("로딩 상태가 아닐 때 다음 버튼이 정상 상태로 표시되어야 합니다.", () => {
      const formDataWithFlavor = { ...mockFormData, flavorId: 1 };

      const wrapper = mount(FlavorSelectStep, {
        props: {
          formData: formDataWithFlavor,
          flavors: mockFlavors,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      expect(nextButton.classes()).not.toContain("ant-btn-loading");
    });
  });

  describe("플레이버 옵션 생성", () => {
    it("플레이버 데이터가 올바른 옵션으로 변환되어야 합니다.", () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const flavorOptions = wrapper.vm.flavorOptions;
      expect(flavorOptions).toHaveLength(3);

      expect(flavorOptions[0]).toEqual({
        value: 1,
        label: "Small",
        description: "Small instance",
        vcpu: 1,
        memory: 1024,
        rootDisk: 10,
      });

      expect(flavorOptions[1]).toEqual({
        value: 2,
        label: "Medium",
        description: "Medium instance",
        vcpu: 2,
        memory: 2048,
        rootDisk: 20,
      });
    });
  });

  describe("빈 데이터 처리", () => {
    it("플레이버가 없을 때 빈 드롭다운이 표시되어야 합니다.", () => {
      const wrapper = mount(FlavorSelectStep, {
        props: { formData: mockFormData, flavors: [] },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 드롭다운이 렌더링되지만 옵션이 없는 상태
      expect(wrapper.find(".ant-select").exists()).toBe(true);
      expect(wrapper.vm.flavorOptions).toHaveLength(0);
    });
  });

  describe("국제화(i18n)", () => {
    it("모든 텍스트가 번역되어야 합니다.", () => {
      const formDataWithFlavor = { ...mockFormData, flavorId: 1 };

      const wrapper = mount(FlavorSelectStep, {
        props: { formData: formDataWithFlavor, flavors: mockFlavors },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();

      // 제목 번역 확인
      expect(text).toContain("Select Flavor");

      // 버튼 텍스트 번역 확인
      expect(text).toContain("Previous");
      expect(text).toContain("Next");

      // 플레이버 정보 라벨 번역 확인
      expect(text).toContain("Name");
      expect(text).toContain("Description");
      expect(text).toContain("CPU");
      expect(text).toContain("Memory");
      expect(text).toContain("Disk");
    });
  });
});
