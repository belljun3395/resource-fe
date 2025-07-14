/**
 * 컴포넌트별 Props와 Emits 타입 정의
 */

import type { PowerStatusString, PowerActionString } from "./vm";

/**
 * VmInstancePowerStatusDropdown 컴포넌트의 Props 인터페이스
 */
export interface VmInstancePowerStatusDropdownProps {
  /** 현재 인스턴스의 파워 상태 */
  powerState: PowerStatusString;
  /** 인스턴스 ID */
  instanceId: string | number;
  /** 로딩 상태 (선택적) */
  loading?: boolean;
}

/**
 * VmInstancePowerStatusDropdown 컴포넌트의 Emits 인터페이스
 */
export interface VmInstancePowerStatusDropdownEmits {
  /** 파워 상태 변경 액션이 선택되었을 때 발생하는 이벤트 */
  (e: "powerStatusChange", action: PowerActionString): void;
}

/**
 * Ant Design Menu Click Event 타입
 */
export interface MenuClickEvent {
  key: string;
  keyPath: string[];
  item: any;
  domEvent: Event;
}
