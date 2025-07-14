/**
 * @file API 응답을 VM 관련 모델로 변환하는 함수들
 * @description API 응답 객체를 애플리케이션 내부에서 사용하는 VmInstance, VmInstanceList 등의 불변 객체로 변환합니다.
 */
import type {
  VmInstanceDetailApiResponse,
  VmInstanceListApiResponse,
} from "@/api/vm/dto";
import {
  VmInstance,
  type VmInstanceDetail,
  type VmInstanceDetailData,
  VmInstanceList,
  type PowerStatusString,
  PowerStatus,
  type PowerStatusCode,
} from "./vm";

/**
 * 단일 조회 API 응답을 VmInstanceDetail로 변환
 */
export function createVmInstanceFromDetailApi(
  apiData: VmInstanceDetailApiResponse
): VmInstanceDetail {
  return new VmInstance<VmInstanceDetailData>({
    name: apiData.name,
    id: apiData.id.toString(),
    powerState: apiData.powerStatus,
    alias: apiData.alias,
    host: apiData.host,
  });
}

/**
 * 복수 조회 API 응답을 VmInstanceList로 변환
 */
export function createVmInstanceFromListApi(
  apiData: VmInstanceListApiResponse
): VmInstanceList {
  return new VmInstanceList({
    id: apiData.id.toString(),
    name: apiData.name,
    description: apiData.description,
    alias: apiData.alias,
    powerState: apiData.powerStatus,
    host: apiData.host,
    source: apiData.source,
    flavor: apiData.flavor,
  });
}

/**
 * PowerStatusString에 따른 Ant Design Tag 색상을 반환하는 유틸리티 함수
 * @param status - 전원 상태 문자열 (예: "RUNNING")
 * @returns Ant Design Tag 색상 (예: "success")
 */
export function getPowerStatusColor(status: PowerStatusString): string {
  const colorMap: Record<PowerStatusString, string> = {
    RUNNING: "success",
    SHUTDOWN: "default",
    PAUSED: "warning",
    CRASHED: "error",
    NOSTATE: "default",
    SUSPENDED: "processing",
  };
  return colorMap[status] || "default";
}

/**
 * PowerStatusString을 PowerStatusCode로 변환하는 유틸리티 함수
 * @param powerState - 변환할 전원 상태 문자열 (예: "RUNNING")
 * @returns 해당하는 전원 상태 코드 (예: "4")
 */
export function getPowerStatusCode(
  powerState: PowerStatusString
): PowerStatusCode {
  return PowerStatus[powerState].toString() as PowerStatusCode;
}

/**
 * PowerStatusCode를 PowerStatusString으로 변환하는 유틸리티 함수
 * @param code - 변환할 전원 상태 코드 (예: "4")
 * @returns 해당하는 전원 상태 문자열 (예: "RUNNING")
 */
export function getPowerStatusFromCode(
  code: PowerStatusCode
): PowerStatusString {
  return PowerStatus[Number(code)] as PowerStatusString;
}
