/**
 * @file VM 관련 타입 및 클래스 단위 테스트
 * @description PowerStatus, VmInstance 등 VM과 관련된 타입, 열거형, 클래스의 동작을 검증합니다.
 */
import { describe, it, expect } from "vitest";
import {
  PowerStatus,
  getPowerStatusCode,
  getPowerStatusFromCode,
  VmInstance,
  PowerAction,
  POWER_ACTION_CODE_MAP,
  getPowerActionCode,
  type PowerStatusString,
  type PowerStatusCode,
  type PowerActionString,
  type VmInstanceData,
} from "./vm";

describe("PowerStatus: 전원 상태 열거형", () => {
  it("각 전원 상태에 대한 숫자 값이 정확해야 합니다.", () => {
    expect(PowerStatus.PAUSED).toBe(0);
    expect(PowerStatus.SHUTDOWN).toBe(1);
    expect(PowerStatus.CRASHED).toBe(2);
    expect(PowerStatus.NOSTATE).toBe(3);
    expect(PowerStatus.RUNNING).toBe(4);
    expect(PowerStatus.SUSPEN).toBe(5);
  });
});

describe("getPowerStatusCode: 전원 상태 문자열 -> 코드 변환", () => {
  it("PowerStatusString을 PowerStatusCode로 정확하게 변환해야 합니다.", () => {
    expect(getPowerStatusCode("PAUSED")).toBe("0");
    expect(getPowerStatusCode("SHUTDOWN")).toBe("1");
    expect(getPowerStatusCode("CRASHED")).toBe("2");
    expect(getPowerStatusCode("NOSTATE")).toBe("3");
    expect(getPowerStatusCode("RUNNING")).toBe("4");
    expect(getPowerStatusCode("SUSPEN")).toBe("5");
  });
});

describe("getPowerStatusFromCode: 전원 상태 코드 -> 문자열 변환", () => {
  it("PowerStatusCode를 PowerStatusString으로 정확하게 변환해야 합니다.", () => {
    expect(getPowerStatusFromCode("0")).toBe("PAUSED");
    expect(getPowerStatusFromCode("1")).toBe("SHUTDOWN");
    expect(getPowerStatusFromCode("2")).toBe("CRASHED");
    expect(getPowerStatusFromCode("3")).toBe("NOSTATE");
    expect(getPowerStatusFromCode("4")).toBe("RUNNING");
    expect(getPowerStatusFromCode("5")).toBe("SUSPEN");
  });
});

describe("PowerStatus 변환 함수의 양방향 일관성", () => {
  it("문자열 -> 코드 -> 문자열 변환 시 원래 값과 동일해야 합니다.", () => {
    const powerStates: PowerStatusString[] = [
      "PAUSED",
      "SHUTDOWN",
      "CRASHED",
      "NOSTATE",
      "RUNNING",
      "SUSPEN",
    ];
    powerStates.forEach((powerState) => {
      const code = getPowerStatusCode(powerState);
      const reversedState = getPowerStatusFromCode(code);
      expect(reversedState).toBe(powerState);
    });
  });

  it("코드 -> 문자열 -> 코드 변환 시 원래 값과 동일해야 합니다.", () => {
    const powerCodes: PowerStatusCode[] = ["0", "1", "2", "3", "4", "5"];
    powerCodes.forEach((code) => {
      const state = getPowerStatusFromCode(code);
      const reversedCode = getPowerStatusCode(state);
      expect(reversedCode).toBe(code);
    });
  });
});

describe("VmInstance: VM 인스턴스 클래스", () => {
  const mockVmData: VmInstanceData = {
    name: "test-vm",
    id: "vm-123",
    powerState: "RUNNING",
    alias: "test-alias",
    host: "test-host.com",
  };

  describe("생성자 (Constructor)", () => {
    it("주어진 데이터로 VmInstance를 생성하고 속성들이 올바르게 설정되어야 합니다.", () => {
      const vm = new VmInstance(mockVmData);
      expect(vm.name).toBe("test-vm");
      expect(vm.id).toBe("vm-123");
      expect(vm.alias).toBe("test-alias");
      expect(vm.host).toBe("test-host.com");
      expect(vm.powerState).toBe("RUNNING");
    });
  });

  describe("Getter: powerState 및 powerStateCode", () => {
    it("powerState getter가 올바른 전원 상태 문자열을 반환해야 합니다.", () => {
      const vm = new VmInstance(mockVmData);
      expect(vm.powerState).toBe("RUNNING");
    });

    it("powerStateCode getter가 올바른 전원 상태 코드를 반환해야 합니다.", () => {
      const vm = new VmInstance(mockVmData);
      expect(vm.powerStateCode).toBe("4");
    });
  });

  describe("데이터 불변성 (Immutability)", () => {
    it("인스턴스 생성 후 원본 데이터 객체를 변경해도 인스턴스의 속성은 영향을 받지 않아야 합니다.", () => {
      const originalData = { ...mockVmData };
      const vm = new VmInstance(originalData);

      // 원본 데이터를 수정합니다.
      originalData.name = "modified-name";
      originalData.powerState = "SHUTDOWN";

      // VmInstance의 속성은 변경되지 않아야 합니다.
      expect(vm.name).toBe("test-vm");
      expect(vm.powerState).toBe("RUNNING");
    });
  });

  describe("엣지 케이스 (Edge Cases)", () => {
    it("속성 값으로 빈 문자열이 주어져도 정상적으로 처리해야 합니다.", () => {
      const emptyData: VmInstanceData = {
        name: "",
        id: "",
        powerState: "NOSTATE",
        alias: "",
        host: "",
      };
      const vm = new VmInstance(emptyData);
      expect(vm.name).toBe("");
      expect(vm.id).toBe("");
      expect(vm.powerState).toBe("NOSTATE");
    });

    it("속성 값에 특수문자가 포함되어도 정상적으로 처리해야 합니다.", () => {
      const specialData: VmInstanceData = {
        name: "vm-!@#$",
        id: "id-!@#$",
        powerState: "RUNNING",
        alias: "alias-!@#$",
        host: "host-!@#$",
      };
      const vm = new VmInstance(specialData);
      expect(vm.name).toBe("vm-!@#$");
    });
  });
});

describe("PowerAction: 파워 액션 열거형", () => {
  it("각 파워 액션에 대한 문자열 값이 정확해야 합니다.", () => {
    expect(PowerAction.START).toBe("start");
    expect(PowerAction.SHUTDOWN).toBe("shutdown");
    expect(PowerAction.REBOOT).toBe("reboot");
    expect(PowerAction.PAUSE).toBe("pause");
  });

  it("PowerAction 열거형의 모든 값이 PowerActionString 타입과 일치해야 합니다.", () => {
    const actionValues: PowerActionString[] = Object.values(PowerAction);
    expect(actionValues).toEqual(["start", "shutdown", "reboot", "pause"]);
  });
});

describe("POWER_ACTION_CODE_MAP: 파워 액션 코드 매핑", () => {
  it("각 파워 액션에 대한 서버 코드 매핑이 정확해야 합니다.", () => {
    expect(POWER_ACTION_CODE_MAP[PowerAction.START]).toBe("0");
    expect(POWER_ACTION_CODE_MAP[PowerAction.SHUTDOWN]).toBe("1");
    expect(POWER_ACTION_CODE_MAP[PowerAction.REBOOT]).toBe("2");
    expect(POWER_ACTION_CODE_MAP[PowerAction.PAUSE]).toBe("3");
  });

  it("매핑 객체가 모든 PowerAction 값을 포함해야 합니다.", () => {
    const mappedActions = Object.keys(POWER_ACTION_CODE_MAP);
    const allActions = Object.values(PowerAction);

    expect(mappedActions.sort()).toEqual(allActions.sort());
  });
});

describe("getPowerActionCode: 파워 액션 -> 서버 코드 변환", () => {
  it("PowerActionString을 올바른 서버 코드로 변환해야 합니다.", () => {
    expect(getPowerActionCode("start")).toBe("0");
    expect(getPowerActionCode("shutdown")).toBe("1");
    expect(getPowerActionCode("reboot")).toBe("2");
    expect(getPowerActionCode("pause")).toBe("3");
  });

  it("PowerAction 열거형 값으로도 변환이 가능해야 합니다.", () => {
    expect(getPowerActionCode(PowerAction.START)).toBe("0");
    expect(getPowerActionCode(PowerAction.SHUTDOWN)).toBe("1");
    expect(getPowerActionCode(PowerAction.REBOOT)).toBe("2");
    expect(getPowerActionCode(PowerAction.PAUSE)).toBe("3");
  });
});

describe("PowerAction과 PowerStatus의 독립성", () => {
  it("PowerAction과 PowerStatus는 서로 다른 도메인을 다뤄야 합니다.", () => {
    // PowerAction은 사용자 액션을 나타냄
    const actions = Object.values(PowerAction);
    expect(actions).toEqual(["start", "shutdown", "reboot", "pause"]);

    // PowerStatus는 인스턴스 상태를 나타냄
    const statusKeys = Object.keys(PowerStatus).filter((key) =>
      isNaN(Number(key))
    );
    expect(statusKeys).toEqual([
      "PAUSED",
      "SHUTDOWN",
      "CRASHED",
      "NOSTATE",
      "RUNNING",
      "SUSPEN",
    ]);

    // 두 도메인은 서로 다름
    expect(actions).not.toEqual(statusKeys);
  });

  it("액션과 상태의 코드 체계가 다름을 확인해야 합니다.", () => {
    // PowerAction 코드는 문자열 "0", "1", "2", "3"
    const actionCodes = Object.values(POWER_ACTION_CODE_MAP);
    expect(actionCodes).toEqual(["0", "1", "2", "3"]);

    // PowerStatus 코드는 "0" ~ "5" (숫자 값만 추출)
    const statusCodes = Object.values(PowerStatus)
      .filter((val) => typeof val === "number")
      .map(String);
    expect(statusCodes).toEqual(["0", "1", "2", "3", "4", "5"]);

    // 액션 코드는 상태 코드의 부분집합
    actionCodes.forEach((code) => {
      expect(statusCodes).toContain(code);
    });
  });
});

describe("타입 안전성 테스트", () => {
  it("PowerActionString 타입이 올바른 값만 허용해야 합니다.", () => {
    const validActions: PowerActionString[] = [
      "start",
      "shutdown",
      "reboot",
      "pause",
    ];

    validActions.forEach((action) => {
      expect(() => getPowerActionCode(action)).not.toThrow();
    });
  });

  it("getPowerActionCode 함수가 타입 안전성을 보장해야 합니다.", () => {
    // 유효한 액션들
    expect(getPowerActionCode("start")).toBeDefined();
    expect(getPowerActionCode("shutdown")).toBeDefined();
    expect(getPowerActionCode("reboot")).toBeDefined();
    expect(getPowerActionCode("pause")).toBeDefined();
  });
});
