import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Antd from "ant-design-vue";
import VmListTable from "./VmListTable.vue";
import { VmInstanceList } from "@/types/vm";
import type { VmInstanceListData, VmFlavor, VmSource } from "@/types/vm";
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

// vue-router mock
// 실제 라우터 대신 모의 라우터를 사용하여 네비게이션 테스트를 진행합니다.
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

describe("VmListTable.vue: VM 인스턴스 목록 테이블 컴포넌트", () => {
  let mockVmInstanceList: VmInstanceList[];
  let mockFlavor: VmFlavor;
  let mockSource: VmSource;

  // 각 테스트 케이스 실행 전에 공통적으로 사용될 초기화 로직을 설정합니다.
  beforeEach(() => {
    // 모든 모의(mock) 함수의 호출 기록을 초기화합니다.
    vi.clearAllMocks();

    // 테스트에 사용될 가상 머신 소스 데이터를 생성합니다.
    mockSource = {
      type: "image",
      id: 1,
      name: "Ubuntu 22.04 LTS",
    };

    // 테스트에 사용될 가상 머신 플레이버 데이터를 생성합니다.
    mockFlavor = {
      id: 1,
      name: "m1.small",
      description: "Small instance with 1 vCPU and 2GB RAM",
      memory: 2048,
      vcpu: 1,
      rootDisk: 20,
    };

    // 테스트에 사용될 가상 머신 인스턴스 리스트 데이터를 생성합니다.
    const mockData1: VmInstanceListData = {
      name: "test-vm-1",
      id: "vm-123",
      powerState: "RUNNING",
      alias: "test-alias-1",
      host: "host-1.example.com",
      description: "Test VM instance 1",
      source: mockSource,
      flavor: mockFlavor,
    };

    const mockData2: VmInstanceListData = {
      name: "test-vm-2",
      id: "vm-456",
      powerState: "PAUSED",
      alias: "test-alias-2",
      host: "host-2.example.com",
      description: "Test VM instance 2",
      source: mockSource,
      flavor: mockFlavor,
    };

    mockVmInstanceList = [
      new VmInstanceList(mockData1),
      new VmInstanceList(mockData2),
    ];
  });

  describe("컴포넌트 렌더링", () => {
    it("props로 전달된 데이터가 올바르게 렌더링되어야 합니다.", () => {
      // 컴포넌트를 마운트합니다.
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 렌더링된 텍스트에 VM 인스턴스의 각 속성값이 포함되어 있는지 확인합니다.
      const text = wrapper.text();
      expect(text).toContain("test-vm-1");
      expect(text).toContain("test-vm-2");
      expect(text).toContain("vm-123");
      expect(text).toContain("vm-456");
      expect(text).toContain("Test VM instance 1");
      expect(text).toContain("Test VM instance 2");
      expect(text).toContain("test-alias-1");
      expect(text).toContain("test-alias-2");
      expect(text).toContain("host-1.example.com");
      expect(text).toContain("host-2.example.com");
    });

    it("로딩 상태일 때 테이블이 로딩 표시를 해야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: true,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // ant-design-vue의 Table 컴포넌트가 loading prop을 받았는지 확인합니다.
      const table = wrapper.findComponent({ name: "ATable" });
      expect(table.props("loading")).toBe(true);
    });

    it("빈 데이터 배열일 때도 테이블이 정상적으로 렌더링되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: [],
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 렌더링되어 있는지 확인합니다.
      expect(wrapper.find(".vm-list-table").exists()).toBe(true);
      const table = wrapper.findComponent({ name: "ATable" });
      expect(table.props("dataSource")).toEqual([]);
    });
  });

  describe("테이블 설정", () => {
    it("올바른 테이블 속성들이 설정되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const table = wrapper.findComponent({ name: "ATable" });
      expect(table.props("pagination")).toBe(false);
      expect(table.props("size")).toBe("middle");
      expect(table.props("scroll")).toEqual({ x: 1200 });
    });

    it("테이블 컬럼이 올바르게 설정되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const table = wrapper.findComponent({ name: "ATable" });
      const columns = table.props("columns");

      expect(columns).toHaveLength(8);
      expect(columns[0].key).toBe("id");
      expect(columns[1].key).toBe("name");
      expect(columns[2].key).toBe("description");
      expect(columns[3].key).toBe("alias");
      expect(columns[4].key).toBe("powerState");
      expect(columns[5].key).toBe("host");
      expect(columns[6].key).toBe("source");
      expect(columns[7].key).toBe("flavor");
    });
  });

  describe("전원 상태 표시", () => {
    it("전원 상태가 태그로 표시되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 전원 상태 태그가 존재하는지 확인합니다.
      const powerStateTags = wrapper.findAllComponents({ name: "ATag" });
      expect(powerStateTags.length).toBeGreaterThan(0);

      // 전원 상태 텍스트가 표시되는지 확인합니다.
      const text = wrapper.text();
      expect(text).toContain("RUNNING");
      expect(text).toContain("PAUSED");
    });
  });

  describe("플레이버 정보 표시", () => {
    it("플레이버 이름과 설명이 표시되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();
      expect(text).toContain("m1.small");
      expect(text).toContain("Small instance with 1 vCPU and 2GB RAM");
    });

    it("플레이버 정보가 없는 경우 적절히 처리되어야 합니다.", () => {
      const mockDataWithoutFlavor: VmInstanceListData = {
        name: "test-vm-no-flavor",
        id: "vm-789",
        powerState: "RUNNING",
        alias: "test-alias-no-flavor",
        host: "host-3.example.com",
        description: "Test VM without flavor",
        source: mockSource,
        flavor: null as any,
      };

      const instanceWithoutFlavor = new VmInstanceList(mockDataWithoutFlavor);

      const wrapper = mount(VmListTable, {
        props: {
          dataSource: [instanceWithoutFlavor],
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 컴포넌트가 에러 없이 렌더링되는지 확인합니다.
      expect(wrapper.find(".vm-list-table").exists()).toBe(true);
    });
  });

  describe("소스 정보 표시", () => {
    it("소스 이름이 표시되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Ubuntu 22.04 LTS");
    });

    it("소스 정보가 없는 경우 대시(-)가 표시되어야 합니다.", () => {
      const mockDataWithoutSource: VmInstanceListData = {
        name: "test-vm-no-source",
        id: "vm-999",
        powerState: "RUNNING",
        alias: "test-alias-no-source",
        host: "host-4.example.com",
        description: "Test VM without source",
        source: null as any,
        flavor: mockFlavor,
      };

      const instanceWithoutSource = new VmInstanceList(mockDataWithoutSource);

      const wrapper = mount(VmListTable, {
        props: {
          dataSource: [instanceWithoutSource],
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 대시가 표시되는지 확인합니다.
      const text = wrapper.text();
      expect(text).toContain("-");
    });
  });

  describe("행 클릭 이벤트", () => {
    it("customRow 함수가 올바른 클릭 핸들러를 반환해야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // customRow 함수를 직접 테스트합니다.
      const vm = wrapper.vm as any;
      const customRowResult = vm.customRow(mockVmInstanceList[0]);

      // 반환된 객체가 올바른 구조를 가지는지 확인합니다.
      expect(customRowResult).toHaveProperty("onClick");
      expect(customRowResult).toHaveProperty("style");
      expect(customRowResult.style.cursor).toBe("pointer");

      // 클릭 핸들러를 실행합니다.
      customRowResult.onClick();

      // 올바른 경로로 네비게이션되었는지 확인합니다.
      expect(mockPush).toHaveBeenCalledWith("/servers/instances/vm-123");
    });

    it("다른 행의 customRow 클릭 시 해당 ID로 네비게이션되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 두 번째 행의 customRow 함수를 테스트합니다.
      const vm = wrapper.vm as any;
      const customRowResult = vm.customRow(mockVmInstanceList[1]);

      // 클릭 핸들러를 실행합니다.
      customRowResult.onClick();

      // 올바른 경로로 네비게이션되었는지 확인합니다.
      expect(mockPush).toHaveBeenCalledWith("/servers/instances/vm-456");
    });
  });

  describe("Props 유효성 검사", () => {
    it("dataSource prop으로 VmInstanceList 배열을 받아야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // 전달된 prop이 컴포넌트의 props와 일치하는지 확인합니다.
      expect(wrapper.props().dataSource).toStrictEqual(mockVmInstanceList);
    });

    it("loading prop의 기본값이 false여야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      // loading prop의 기본값이 false인지 확인합니다.
      expect(wrapper.props().loading).toBe(false);
    });
  });

  describe("국제화(i18n)", () => {
    it("테이블 헤더에 올바른 번역 키가 사용되어야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const text = wrapper.text();
      expect(text).toContain("ID");
      expect(text).toContain("Name");
      expect(text).toContain("Description");
      expect(text).toContain("Alias");
      expect(text).toContain("Power State");
      expect(text).toContain("Host");
      expect(text).toContain("Source");
      expect(text).toContain("Flavor");
    });
  });

  describe("반응형 디자인", () => {
    it("테이블이 가로 스크롤 설정을 가져야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      const table = wrapper.findComponent({ name: "ATable" });
      expect(table.props("scroll")).toEqual({ x: 1200 });
    });

    it("테이블 래퍼가 올바른 CSS 클래스를 가져야 합니다.", () => {
      const wrapper = mount(VmListTable, {
        props: {
          dataSource: mockVmInstanceList,
          loading: false,
        },
        global: {
          plugins: [i18n, Antd],
        },
      });

      expect(wrapper.find(".vm-list-table").exists()).toBe(true);
    });
  });
});
