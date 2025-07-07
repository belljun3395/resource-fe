import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import ReviewStep from "./ReviewStep.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";
import type { VmCreateFormData } from "@/types/vm-form";
import type { ImageSpec } from "@/types/image";
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

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

describe("ReviewStep.vue: VM 생성 검토 단계", () => {
  let mockFormData: VmCreateFormData;
  let mockImages: ImageSpec[];
  let mockFlavors: FlavorSpec[];

  beforeEach(() => {
    mockFormData = {
      name: "test-vm",
      description: "test description",
      imageId: 1,
      flavorId: 1,
    };

    mockImages = [
      {
        id: 1,
        name: "Ubuntu 22.04 LTS",
      },
      { id: 2, name: "CentOS 7" },
    ];

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
    ];
  });

  describe("컴포넌트 렌더링", () => {
    it("검토 정보가 올바르게 렌더링되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 제목이 렌더링되는지 확인
      expect(wrapper.find("h3").text()).toContain("Review & Create");

      // 검토 정보가 렌더링되는지 확인
      expect(wrapper.find(".ant-descriptions").exists()).toBe(true);

      // 이전/생성 버튼이 렌더링되는지 확인
      const buttons = wrapper.findAll(".step-actions button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text()).toContain("Previous");
      expect(buttons[1].text()).toContain("Create");
    });

    it("입력된 모든 정보가 표시되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();

      // 인스턴스 이름 확인
      expect(text).toContain("test-vm");

      // 설명 확인
      expect(text).toContain("test description");

      // 이미지 이름 확인
      expect(text).toContain("Ubuntu 22.04 LTS");

      // 플레이버 정보 확인
      expect(text).toContain("Small");
      expect(text).toContain("1 vCPU");
      expect(text).toContain("1024 MB");
      expect(text).toContain("10 GB");
      expect(text).toContain("Small instance");
    });

    it("설명이 없을 때 기본 메시지가 표시되어야 합니다.", () => {
      const formDataWithoutDescription = {
        ...mockFormData,
        description: "",
      };

      const wrapper = mount(ReviewStep, {
        props: {
          formData: formDataWithoutDescription,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();
      expect(text).toContain("No description");
    });
  });

  describe("선택된 이미지 및 플레이버 매칭", () => {
    it("올바른 이미지가 선택되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // selectedImage computed 값 확인
      expect(wrapper.vm.selectedImage).toEqual(mockImages[0]);
    });

    it("올바른 플레이버가 선택되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // selectedFlavor computed 값 확인
      expect(wrapper.vm.selectedFlavor).toEqual(mockFlavors[0]);
    });

    it("존재하지 않는 이미지 ID일 때 undefined가 반환되어야 합니다.", () => {
      const formDataWithInvalidImage = {
        ...mockFormData,
        imageId: 999,
      };

      const wrapper = mount(ReviewStep, {
        props: {
          formData: formDataWithInvalidImage,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      expect(wrapper.vm.selectedImage).toBeUndefined();
    });

    it("존재하지 않는 플레이버 ID일 때 undefined가 반환되어야 합니다.", () => {
      const formDataWithInvalidFlavor = {
        ...mockFormData,
        flavorId: 999,
      };

      const wrapper = mount(ReviewStep, {
        props: {
          formData: formDataWithInvalidFlavor,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      expect(wrapper.vm.selectedFlavor).toBeUndefined();
    });
  });

  describe("이벤트 처리", () => {
    it("이전 버튼 클릭 시 previous 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
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

    it("생성 버튼 클릭 시 create 이벤트가 발생해야 합니다.", async () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const createButton = wrapper.findAll(".step-actions button")[1];
      await createButton.trigger("click");

      // create 이벤트가 발생했는지 확인
      const emittedEvents = wrapper.emitted("create");
      expect(emittedEvents).toBeTruthy();
    });
  });

  describe("로딩 상태", () => {
    it("로딩 상태일 때 생성 버튼이 로딩 상태로 표시되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
          loading: true,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const createButton = wrapper.findAll(".step-actions button")[1];
      expect(createButton.classes()).toContain("ant-btn-loading");
    });

    it("로딩 상태가 아닐 때 생성 버튼이 정상 상태로 표시되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const createButton = wrapper.findAll(".step-actions button")[1];
      expect(createButton.classes()).not.toContain("ant-btn-loading");
    });
  });

  describe("플레이버 정보 표시", () => {
    it("플레이버 태그가 올바르게 표시되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 플레이버 태그들이 렌더링되는지 확인
      const tags = wrapper.findAll(".ant-tag");
      expect(tags.length).toBeGreaterThan(0);

      // 각 태그의 내용 확인
      const tagTexts = tags.map((tag) => tag.text());
      expect(tagTexts).toContain("1 vCPU");
      expect(tagTexts).toContain("1024 MB");
      expect(tagTexts).toContain("10 GB");
    });

    it("플레이버 정보가 올바른 색상으로 표시되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const tags = wrapper.findAll(".ant-tag");

      // 색상 클래스 확인
      expect(tags.some((tag) => tag.classes().includes("ant-tag-blue"))).toBe(
        true
      );
      expect(tags.some((tag) => tag.classes().includes("ant-tag-green"))).toBe(
        true
      );
      expect(tags.some((tag) => tag.classes().includes("ant-tag-orange"))).toBe(
        true
      );
    });
  });

  describe("국제화(i18n)", () => {
    it("모든 텍스트가 번역되어야 합니다.", () => {
      const wrapper = mount(ReviewStep, {
        props: {
          formData: mockFormData,
          images: mockImages,
          flavors: mockFlavors,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();

      // 제목 번역 확인
      expect(text).toContain("Review & Create");

      // 버튼 텍스트 번역 확인
      expect(text).toContain("Previous");
      expect(text).toContain("Create");

      // 라벨 번역 확인
      expect(text).toContain("Name");
      expect(text).toContain("Description");
      expect(text).toContain("Image");
      expect(text).toContain("Flavor");
    });
  });
});
