/**
 * 챗봇 관련 타입 정의
 * @file chatbot.ts
 * @description 챗봇 컴포넌트와 서비스에서 사용하는 타입들을 정의합니다.
 */

/* ==========================================================================
   기본 인터페이스
   ========================================================================== */

/**
 * 챗봇 메시지 인터페이스
 */
export interface ChatMessage {
  /** 메시지 고유 ID */
  id: string;
  /** 메시지 타입 (사용자 또는 어시스턴트) */
  type: 'user' | 'assistant';
  /** 메시지 내용 */
  content: string;
  /** 메시지 생성 시간 */
  timestamp: Date;
}

/**
 * 빠른 주제 선택 버튼 인터페이스
 */
export interface QuickTopic {
  /** 주제 고유 ID */
  id: string;
  /** 주제 아이콘 (이모지) */
  icon: string;
  /** 주제 표시 텍스트 */
  text: string;
  /** 전송할 메시지 내용 */
  message: string;
}

/* ==========================================================================
   API 요청/응답 인터페이스
   ========================================================================== */

/**
 * 채팅 요청 인터페이스
 */
export interface ChatRequest {
  /** 사용자 메시지 */
  message: string;
  /** 대화 ID (선택사항) */
  conversationId?: string;
  /** 사용자 ID (선택사항) */
  userId?: string;
  /** 사용자 에이전트 (선택사항) */
  userAgent?: string;
  /** 시스템 프롬프트 (선택사항) */
  systemPrompt?: string;
  /** 사용할 함수 목록 (선택사항) */
  functions?: string[];
}

/**
 * AI 에이전트 응답 인터페이스
 */
export interface AgentResponse {
  /** AI 응답 내용 */
  content: string;
  /** 대화 ID */
  conversationId: string;
  /** 응답 생성 시간 */
  timestamp: string;
  /** 스트리밍 응답 여부 */
  isStreaming: boolean;
  /** 참조 소스 목록 */
  sources: string[];
  /** 메타데이터 */
  metadata: {
    /** 응답 시간 */
    responseTime?: string;
    /** 사용된 도구 목록 */
    toolsUsed?: string[];
    /** 기타 메타데이터 */
    [key: string]: any;
  };
  /** 응답 상태 */
  status: 'SUCCESS' | 'ERROR' | 'PROCESSING';
}

/**
 * 대화 정보 인터페이스
 */
export interface Conversation {
  /** 대화 ID */
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
  /** 메시지 수 */
  messageCount: number;
  /** 활성 상태 */
  isActive: boolean;
}


/* ==========================================================================
   에러 관련 인터페이스
   ========================================================================== */

/**
 * 에러 응답 인터페이스
 */
export interface ErrorResponse {
  /** 오류 메시지 */
  error: string;
  /** 오류 코드 */
  code: string;
  /** 오류 발생 시간 */
  timestamp: string;
  /** 오류 발생 경로 */
  path: string;
}

/* ==========================================================================
   컴포넌트 Props 인터페이스
   ========================================================================== */

/**
 * ChatBot 컴포넌트 Props 인터페이스
 */
export interface ChatBotProps {
  /** 챗봇 초기 열림 상태 */
  initialOpen?: boolean;
  /** 최대 메시지 수 */
  maxMessages?: number;
  /** 사용자 정의 주제 목록 */
  customTopics?: QuickTopic[];
  /** API 베이스 URL 오버라이드 */
  apiBaseUrl?: string;
}

/**
 * ChatBot 컴포넌트 Emits 인터페이스
 */
export interface ChatBotEmits {
  /** 챗봇 열림/닫힘 상태 변경 */
  (e: 'toggle', isOpen: boolean): void;
  /** 메시지 전송 */
  (e: 'message-sent', message: ChatMessage): void;
  /** 응답 수신 */
  (e: 'response-received', response: AgentResponse): void;
  /** 에러 발생 */
  (e: 'error', error: Error): void;
}