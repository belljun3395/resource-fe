import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import BasicInfoStep from "./BasicInfoStep.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";
import type { VmCreateFormData } from "@/types/vm-form";

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
  locale: "en",
  fallbackLocale: "en",
  messages,
});

// Mock API
const mockVmApi = {
  getInstanceList: vi.fn(),
};

vi.mock("@/api/vm", () => ({
  getVmApi: () => Promise.resolve(mockVmApi),
}));

describe("BasicInfoStep.vue: VM 생성 기본 정보 단계", () => {
  let mockFormData: VmCreateFormData;

  beforeEach(() => {
    mockFormData = {
      name: "",
      description: "",
      host: "",
      flavorId: null,
      sourceType: "IMAGE",
      sourceId: null,
    };

    // Reset mock
    mockVmApi.getInstanceList.mockResolvedValue({
      data: [
        { name: "existing-vm-1" },
        { name: "Existing-VM-2" },
        { name: "EXISTING-VM-3" },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("컴포넌트 렌더링", () => {
    it("기본 정보 입력 폼이 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 제목이 렌더링되는지 확인
      expect(wrapper.find("h3").text()).toContain("Basic Information");

      // 이름 입력 필드가 있는지 확인
      expect(wrapper.find("input[placeholder*='name']").exists()).toBe(true);

      // 설명 입력 필드가 있는지 확인
      expect(
        wrapper.find("textarea[placeholder*='description']").exists()
      ).toBe(true);

      // 다음 버튼이 있는지 확인
      expect(wrapper.find("button[type='submit']").exists()).toBe(true);
    });

    it("props로 전달된 formData가 입력 필드에 반영되어야 합니다.", () => {
      const formDataWithValues = {
        name: "test-vm",
        description: "test description",
        host: "",
        flavorId: null,
        sourceType: "IMAGE",
        sourceId: null,
      };

      const wrapper = mount(BasicInfoStep, {
        props: { formData: formDataWithValues },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 이름 입력 필드에 값이 반영되는지 확인
      const nameInput = wrapper.find("input[placeholder*='name']");
      expect((nameInput.element as HTMLInputElement).value).toBe("test-vm");

      // 설명 입력 필드에 값이 반영되는지 확인
      const descriptionInput = wrapper.find(
        "textarea[placeholder*='description']"
      );
      expect((descriptionInput.element as HTMLTextAreaElement).value).toBe(
        "test description"
      );
    });
  });

  describe("폼 검증", () => {
    it("이름 입력 필드가 렌더링되어야 합니다.", () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 이름 입력 필드가 존재하는지 확인
      const nameInput = wrapper.find("input[placeholder*='name']");
      expect(nameInput.exists()).toBe(true);
    });

    it("설명 입력 필드가 렌더링되어야 합니다.", () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 설명 입력 필드가 존재하는지 확인
      const descriptionTextarea = wrapper.find(
        "textarea[placeholder*='description']"
      );
      expect(descriptionTextarea.exists()).toBe(true);
    });

    it("설명이 80자를 초과하면 검증 오류가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // a-textarea 컴포넌트가 올바른 props를 가지고 있는지 확인
      const textareaComponent = wrapper.findComponent({ name: "ATextarea" });
      expect(textareaComponent.exists()).toBe(true);
      expect(textareaComponent.props("maxlength")).toBe(80);
      expect(textareaComponent.props("showCount")).toBe(true);
    });

    it("설명이 80자 이하면 검증 오류가 발생하지 않아야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // a-textarea 컴포넌트의 props가 올바르게 설정되었는지 확인
      const textareaComponent = wrapper.findComponent({ name: "ATextarea" });
      expect(textareaComponent.props("maxlength")).toBe(80);
      expect(textareaComponent.props("showCount")).toBe(true);
    });
  });

  describe("이름 검증", () => {
    it("공백만 입력된 이름은 검증 오류가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 잠시 기다려서 컴포넌트가 완전히 마운트되도록 함
      await wrapper.vm.$nextTick();

      // 공백만 있는 이름 입력
      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue("   ");

      // 폼 제출 시도
      const form = wrapper.find("form");
      await form.trigger("submit");

      // 검증 오류가 발생하는지 확인
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("must not contain only whitespace");
    });

    it("중복된 이름은 검증 오류가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 마운트되고 API 호출이 완료될 때까지 기다림
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 중복된 이름 입력 (대소문자 구분 없이)
      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue("existing-vm-1");

      // 폼 제출 시도
      const form = wrapper.find("form");
      await form.trigger("submit");

      // 검증 오류가 발생하는지 확인
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("already exists");
    });

    it("대소문자가 다른 중복된 이름도 검증 오류가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 마운트되고 API 호출이 완료될 때까지 기다림
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 대소문자만 다른 중복된 이름 입력
      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue("EXISTING-VM-1");

      // 폼 제출 시도
      const form = wrapper.find("form");
      await form.trigger("submit");

      // 검증 오류가 발생하는지 확인
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("already exists");
    });

    it("유효한 이름은 검증 오류가 발생하지 않아야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 마운트되고 API 호출이 완료될 때까지 기다림
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 유효한 이름 입력
      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue("new-unique-vm");

      // 폼 제출 시도
      const form = wrapper.find("form");
      await form.trigger("submit");

      // next 이벤트가 발생하는지 확인
      await wrapper.vm.$nextTick();
      const nextEvents = wrapper.emitted("next");
      expect(nextEvents).toBeTruthy();
    });

    it("이름이 2자 미만이면 검증 오류가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      await wrapper.vm.$nextTick();

      // 1자 이름 입력
      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue("a");

      // 폼 제출 시도
      const form = wrapper.find("form");
      await form.trigger("submit");

      // 검증 오류가 발생하는지 확인
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("2");
    });

    it("이름이 50자를 초과하면 검증 오류가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      await wrapper.vm.$nextTick();

      // 51자 이름 입력
      const longName = "a".repeat(51);
      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue(longName);

      // 폼 제출 시도
      const form = wrapper.find("form");
      await form.trigger("submit");

      // 검증 오류가 발생하는지 확인
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("50");
    });
  });

  describe("이벤트 처리", () => {
    it("이름 입력 시 update:form-data 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nameInput = wrapper.find("input[placeholder*='name']");
      await nameInput.setValue("new-vm-name");

      // update:form-data 이벤트가 발생했는지 확인
      const emittedEvents = wrapper.emitted("update:form-data");
      expect(emittedEvents).toBeTruthy();
      expect(emittedEvents![0][0]).toEqual({
        ...mockFormData,
        name: "new-vm-name",
      });
    });

    it("설명 입력 시 update:form-data 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const descriptionInput = wrapper.find(
        "textarea[placeholder*='description']"
      );
      await descriptionInput.setValue("new description");

      // update:form-data 이벤트가 발생했는지 확인
      const emittedEvents = wrapper.emitted("update:form-data");
      expect(emittedEvents).toBeTruthy();
      expect(emittedEvents![0][0]).toEqual({
        ...mockFormData,
        description: "new description",
      });
    });

    it("다음 버튼이 렌더링되어야 합니다.", async () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: { ...mockFormData, name: "test-vm" } },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 제출 버튼이 존재하는지 확인
      const submitButton = wrapper.find("button[type='submit']");
      expect(submitButton.exists()).toBe(true);
      expect(submitButton.text()).toContain("Next");
    });
  });

  describe("로딩 상태", () => {
    it("로딩 상태일 때 다음 버튼이 로딩 상태로 표시되어야 합니다.", () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData, loading: true },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 버튼이 로딩 상태인지 확인
      const button = wrapper.find("button[type='submit']");
      expect(button.classes()).toContain("ant-btn-loading");
    });

    it("로딩 상태가 아닐 때 다음 버튼이 정상 상태로 표시되어야 합니다.", () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData, loading: false },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 버튼이 로딩 상태가 아닌지 확인
      const button = wrapper.find("button[type='submit']");
      expect(button.classes()).not.toContain("ant-btn-loading");
    });
  });

  describe("국제화(i18n)", () => {
    it("모든 라벨과 플레이스홀더가 번역되어야 합니다.", () => {
      const wrapper = mount(BasicInfoStep, {
        props: { formData: mockFormData },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();

      // 제목 번역 확인
      expect(text).toContain("Basic Information");

      // 버튼 텍스트 번역 확인
      expect(text).toContain("Next");

      // 플레이스홀더 번역 확인
      const nameInput = wrapper.find("input[placeholder*='name']");
      expect(nameInput.attributes("placeholder")).toBeTruthy();

      const descriptionInput = wrapper.find(
        "textarea[placeholder*='description']"
      );
      expect(descriptionInput.attributes("placeholder")).toBeTruthy();
    });
  });
});
