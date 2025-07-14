import type { PowerStatusString, VmInstanceList } from "@/types/vm";

/* ==========================================================================
   API 요청 파라미터 인터페이스
   ========================================================================== */

/**
 * VM 목록 API 요청 파라미터 인터페이스
 */
export interface VmListRequest {
  /** 페이지 번호 (0부터 시작) */
  page: number;
  /** 페이지 크기 */
  size: number;
}

/* ==========================================================================
   API 응답 인터페이스 (서버 -> 클라이언트)
   ========================================================================== */

/**
 * VM 인스턴스 API 응답의 공통 베이스 인터페이스
 */
export interface VmInstanceBaseApiResponse {
  id: number;
  name: string;
  alias: string;
  powerStatus: PowerStatusString;
  host: string;
}

/**
 * 단일 VM 인스턴스 조회 API 응답 인터페이스
 * 최소한의 정보만 포함
 */
export interface VmInstanceDetailApiResponse
  extends VmInstanceBaseApiResponse {}

/**
 * 복수 VM 인스턴스 조회 API 응답 인터페이스
 * 전체 정보 포함
 */
export interface VmInstanceListApiResponse extends VmInstanceBaseApiResponse {
  description: string;
  source: VmSource;
  flavor: VmFlavor;
}

/**
 * VM 목록 API 응답 인터페이스 (서버 응답)
 */
export interface VmListApiResponse {
  pageSize: number;
  pageNumber: number;
  totalPageCount: number;
  totalCount: number;
  data: VmInstanceListApiResponse[];
}

/* ==========================================================================
   프론트엔드 도메인 응답 인터페이스 (클라이언트 내부)
   ========================================================================== */

/**
 * VM 목록 응답 인터페이스 (프론트엔드 도메인)
 * API 응답을 도메인 객체로 변환한 후 사용
 */
export interface VmListResponse {
  /** 페이지 크기 */
  pageSize: number;
  /** 페이지 번호 */
  pageNumber: number;
  /** 전체 페이지 수 */
  totalPageCount: number;
  /** 전체 항목 수 */
  totalCount: number;
  /** VM 인스턴스 목록 */
  data: VmInstanceList[];
}

export interface VmSource {
  type: string;
  id: number;
  name: string;
}

export interface VmFlavor {
  id: number;
  name: string;
  description: string;
  memory: number;
  rootDisk: number;
  vcpu: number;
}

export interface VmInstanceCreateRequest {
  name: string;
  description?: string;
  imageId: number;
  flavorId: number;
}

export interface PowerStatusUpdateResponse {
  success: boolean;
  message?: string;
  instanceId: string | number;
  newPowerStatus?: PowerStatusString;
}

export interface VmDeleteApiResponse {
  instanceId: number;
  isAccepted: boolean;
  isDeleted: boolean;
}
