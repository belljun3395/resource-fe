import { getPowerStatusCode } from "@/types/vm.converter";

/**
 * VM 인스턴스의 전원 상태를 나타내는 열거형
 * 서버에서 전달되는 숫자 코드와 매핑됨
 */
export enum PowerStatus {
  /** 일시정지 상태 */
  PAUSED = 0,
  /** 종료 상태 */
  SHUTDOWN = 1,
  /** 크래시 상태 */
  CRASHED = 2,
  /** 상태 없음 (초기화되지 않음) */
  NOSTATE = 3,
  /** 실행 중 */
  RUNNING = 4,
  /** 서스펜드 상태 (절전 모드) */
  SUSPENDED = 5,
}

/** PowerStatus 열거형의 키를 문자열로 표현하는 타입 (예: "RUNNING", "PAUSED") */
export type PowerStatusString = keyof typeof PowerStatus;

/** PowerStatus 열거형의 값을 문자열로 표현하는 타입 (예: "0", "1", "4") */
export type PowerStatusCode = `${PowerStatus}`;

/**
 * VM 소스 정보를 나타내는 인터페이스
 */
export interface VmSource {
  /** 소스 타입 */
  type: string;
  /** 소스 ID */
  id: number;
  /** 소스 이름 */
  name: string;
}

/**
 * VM 플레이버 정보를 나타내는 인터페이스
 */
export interface VmFlavor {
  /** 플레이버 ID */
  id: number;
  /** 플레이버 이름 */
  name: string;
  /** 플레이버 설명 */
  description: string;
  /** 메모리 크기 */
  memory: number;
  /** 루트 디스크 크기 */
  rootDisk: number;
  /** vCPU 개수 */
  vcpu: number;
}

/**
 * VM 인스턴스 데이터의 공통 베이스 인터페이스
 */
export interface VmInstanceBaseData {
  /** 인스턴스 이름 */
  name: string;
  /** 인스턴스 고유 식별자 */
  id: string;
  /** 현재 전원 상태 */
  powerState: PowerStatusString;
  /** 사용자 정의 별칭 */
  alias: string;
  /** 호스트 서버 정보 */
  host: string;
}

/**
 * 단일 조회용 VM 인스턴스 데이터 구조
 * 최소한의 정보만 포함
 */
export interface VmInstanceDetailData extends VmInstanceBaseData {}

/**
 * 복수 조회용 VM 인스턴스 데이터 구조
 * 전체 정보 포함
 */
export interface VmInstanceListData extends VmInstanceBaseData {
  /** 인스턴스 설명 */
  description: string;
  /** VM 소스 정보 */
  source: VmSource;
  /** VM 플레이버 정보 */
  flavor: VmFlavor;
}

/**
 * VM 인스턴스를 표현하는 불변 클래스
 * 데이터 무결성을 보장하고 캡슐화를 통한 안전한 접근을 제공
 */
export class VmInstance<T extends VmInstanceBaseData> {
  /** 인스턴스 이름 (읽기 전용) */
  public readonly name: string;
  /** 인스턴스 고유 식별자 (읽기 전용) */
  public readonly id: string;
  /** 현재 전원 상태 (읽기 전용) */
  public readonly powerState: PowerStatusString;
  /** 사용자 정의 별칭 (읽기 전용) */
  public readonly alias: string;
  /** 호스트 서버 정보 (읽기 전용) */
  public readonly host: string;

  /**
   * VmInstance 생성자
   * @param data - VM 인스턴스 데이터
   */
  constructor(data: T) {
    this.name = data.name;
    this.id = data.id;
    this.powerState = data.powerState;
    this.alias = data.alias;
    this.host = data.host;
  }

  /**
   * 전원 상태를 숫자 코드로 반환하는 getter
   * @returns PowerStatusCode 타입의 전원 상태 코드 (예: "4")
   */
  get powerStateCode(): PowerStatusCode {
    return getPowerStatusCode(this.powerState);
  }
}

/**
 * 단일 조회용 VM 인스턴스 타입 별칭
 */
export type VmInstanceDetail = VmInstance<VmInstanceDetailData>;

/**
 * 복수 조회용 VM 인스턴스 클래스
 * 전체 정보를 포함하는 불변 클래스
 */
export class VmInstanceList extends VmInstance<VmInstanceListData> {
  /** 인스턴스 설명 (읽기 전용) */
  public readonly description: string;
  /** VM 소스 정보 (읽기 전용) */
  public readonly source: VmSource;
  /** VM 플레이버 정보 (읽기 전용) */
  public readonly flavor: VmFlavor;

  /**
   * VmInstanceList 생성자
   * @param data - VM 인스턴스 리스트 데이터
   */
  constructor(data: VmInstanceListData) {
    super(data);
    this.description = data.description;
    this.source = { ...data.source };
    this.flavor = { ...data.flavor };
  }
}
