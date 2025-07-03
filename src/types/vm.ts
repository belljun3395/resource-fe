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
  SUSPEN = 5,
}

/** PowerStatus 열거형의 키를 문자열로 표현하는 타입 (예: "RUNNING", "PAUSED") */
export type PowerStatusString = keyof typeof PowerStatus;

/** PowerStatus 열거형의 값을 문자열로 표현하는 타입 (예: "0", "1", "4") */
export type PowerStatusCode = `${PowerStatus}`;

/**
 * VM 인스턴스의 기본 데이터 구조를 정의하는 인터페이스
 * VmInstance 클래스의 생성자에서 사용됨
 */
export interface VmInstanceData {
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

/**
 * VM 인스턴스를 표현하는 불변 클래스
 * 데이터 무결성을 보장하고 캡슐화를 통한 안전한 접근을 제공
 */
export class VmInstance {
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
  constructor(data: VmInstanceData) {
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
