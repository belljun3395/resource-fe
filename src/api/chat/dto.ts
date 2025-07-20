/**
 * ChatService 관련 타입 정의
 */

/**
 * 채팅 요청 인터페이스
 */
export interface ChatRequest {
  /** 사용자 메시지 */
  message: string;
  /** 대화 ID (선택적) */
  conversationId?: string;
  /** 사용자 ID (선택적) */
  userId?: string;
  /** 사용자 에이전트 (선택적) */
  userAgent?: string;
  /** 시스템 프롬프트 (선택적) */
  systemPrompt?: string;
  /** 사용 가능한 함수 목록 (선택적) */
  functions?: string[];
}

/**
 * AI 에이전트 응답 인터페이스
 */
export interface AgentResponse {
  /** 응답 내용 */
  content: string;
  /** 대화 ID */
  conversationId: string;
  /** 응답 생성 시간 */
  timestamp: string;
  /** 스트리밍 여부 */
  isStreaming: boolean;
  /** 참조 소스 목록 */
  sources: string[];
  /** 응답 메타데이터 */
  metadata: {
    /** 응답 시간 */
    responseTime?: string;
    /** 사용된 도구 목록 */
    toolsUsed?: string[];
    /** 기타 메타데이터 */
    [key: string]: any;
  };
  /** 응답 상태 */
  status: "SUCCESS" | "ERROR" | "PROCESSING";
}

/**
 * 대화 정보 인터페이스
 */
export interface Conversation {
  /** 대화 고유 ID */
  id: string;
  /** 사용자 ID */
  userId: string;
  /** 대화 제목 */
  title: string;
  /** 대화 요약 */
  summary: string;
  /** 생성 시간 */
  createdAt: string;
  /** 마지막 활동 시간 */
  lastActivity: string;
  /** 메시지 개수 */
  messageCount: number;
  /** 활성 상태 */
  isActive: boolean;
}


/**
 * 에러 응답 인터페이스
 */
export interface ErrorResponse {
  /** 에러 메시지 */
  error: string;
  /** 에러 코드 */
  code: string;
  /** 에러 발생 시간 */
  timestamp: string;
  /** 에러 발생 경로 */
  path: string;
}