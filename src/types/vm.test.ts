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
  type PowerStatusString,
  type PowerStatusCode,
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
