import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import ImageSelectStep from "./ImageSelectStep.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";
import type { VmCreateFormData } from "@/types/vm-form";
import type { ImageSpec } from "@/types/image";

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

describe("ImageSelectStep.vue: VM 생성 이미지 선택 단계", () => {
  let mockFormData: VmCreateFormData;
  let mockImages: ImageSpec[];

  beforeEach(() => {
    mockFormData = {
      name: "test-vm",
      description: "test description",
      host: "",
      flavorId: null,
      sourceType: "IMAGE",
      sourceId: null,
    };

    mockImages = [
      {
        id: 1,
        name: "Ubuntu 22.04 LTS",
      },
      { id: 2, name: "CentOS 7" },
      {
        id: 3,
        name: "Windows Server 2019",
      },
    ];
  });

  describe("컴포넌트 렌더링", () => {
    it("이미지 선택 테이블이 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 제목이 렌더링되는지 확인
      expect(wrapper.find("h3").text()).toContain("Select Image");

      // 테이블이 렌더링되는지 확인
      expect(wrapper.find(".ant-table").exists()).toBe(true);

      // 이미지 데이터가 테이블에 표시되는지 확인
      const tableText = wrapper.find(".ant-table").text();
      expect(tableText).toContain("Ubuntu 22.04 LTS");
      expect(tableText).toContain("CentOS 7");
      expect(tableText).toContain("Windows Server 2019");
    });

    it("이전/다음 버튼이 렌더링되어야 합니다.", () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const buttons = wrapper.findAll(".step-actions button");
      expect(buttons).toHaveLength(2);

      // 이전 버튼 확인
      expect(buttons[0].text()).toContain("Previous");

      // 다음 버튼 확인
      expect(buttons[1].text()).toContain("Next");
    });

    it("이미지가 선택되지 않았을 때 다음 버튼이 비활성화되어야 합니다.", () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      expect(nextButton.attributes("disabled")).toBeDefined();
    });

    it("이미지가 선택되었을 때 다음 버튼이 활성화되어야 합니다.", () => {
      const formDataWithImage = { ...mockFormData, sourceId: 1 };

      const wrapper = mount(ImageSelectStep, {
        props: { formData: formDataWithImage, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const nextButton = wrapper.findAll(".step-actions button")[1];
      expect(nextButton.attributes("disabled")).toBeUndefined();
    });
  });

  describe("이미지 선택 기능", () => {
    it("이미지 선택 시 update:form-data 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 첫 번째 이미지 선택
      const firstRadio = wrapper.find("input[type='radio']");
      await firstRadio.setValue(true);

      // update:form-data 이벤트가 발생했는지 확인
      const emittedEvents = wrapper.emitted("update:form-data");
      expect(emittedEvents).toBeTruthy();
      expect(emittedEvents![0][0]).toEqual({
        ...mockFormData,
        sourceId: 1,
      });
    });

    it("선택된 이미지가 하이라이트되어야 합니다.", () => {
      const formDataWithImage = { ...mockFormData, sourceId: 1 };

      const wrapper = mount(ImageSelectStep, {
        props: { formData: formDataWithImage, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 라디오 버튼이 체크되어 있는지 확인 (Ant Design table row selection)
      const radioInput = wrapper.find("input[type='radio']");
      expect(radioInput.exists()).toBe(true);
      expect((radioInput.element as HTMLInputElement).checked).toBe(true);
    });
  });

  describe("이벤트 처리", () => {
    it("이전 버튼 클릭 시 previous 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: mockImages },
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
      const formDataWithImage = { ...mockFormData, sourceId: 1 };

      const wrapper = mount(ImageSelectStep, {
        props: { formData: formDataWithImage, images: mockImages },
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
      const formDataWithImage = { ...mockFormData, sourceId: 1 };

      const wrapper = mount(ImageSelectStep, {
        props: {
          formData: formDataWithImage,
          images: mockImages,
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
      const formDataWithImage = { ...mockFormData, sourceId: 1 };

      const wrapper = mount(ImageSelectStep, {
        props: {
          formData: formDataWithImage,
          images: mockImages,
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

  describe("빈 데이터 처리", () => {
    it("이미지가 없을 때 빈 테이블이 표시되어야 합니다.", () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: [] },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 테이블이 렌더링되는지 확인
      expect(wrapper.find(".ant-table").exists()).toBe(true);

      // 테이블 본문에 데이터 행이 없는지 확인
      const tableRows = wrapper.findAll(".ant-table-tbody tr[data-row-key]");
      expect(tableRows.length).toBe(0);
    });
  });

  describe("국제화(i18n)", () => {
    it("모든 텍스트가 번역되어야 합니다.", () => {
      const wrapper = mount(ImageSelectStep, {
        props: { formData: mockFormData, images: mockImages },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();

      // 제목 번역 확인
      expect(text).toContain("Select Image");

      // 버튼 텍스트 번역 확인
      expect(text).toContain("Previous");
      expect(text).toContain("Next");

      // 테이블 헤더 번역 확인
      expect(text).toContain("ID");
      expect(text).toContain("Name");
    });
  });
});
