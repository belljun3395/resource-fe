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
   메트릭 관련 인터페이스
   ========================================================================== */

/**
 * 성능 통계 인터페이스
 */
export interface PerformanceStats {
  /** 평균 응답 시간 (ms) */
  avgResponseTime: number;
  /** 95퍼센타일 응답 시간 (ms) */
  p95ResponseTime: number;
  /** 오류율 */
  errorRate: number;
  /** 총 요청 수 */
  totalRequests: number;
  /** 시간당 처리량 */
  throughputPerHour: number;
}

/**
 * 사용량 통계 인터페이스
 */
export interface UsageStats {
  /** 총 대화 수 */
  totalConversations: number;
  /** 대화당 평균 메시지 수 */
  avgMessagesPerConversation: number;
  /** 평균 메시지 길이 */
  avgMessageLength: number;
  /** 총 사용 토큰 수 */
  totalTokensUsed: number;
  /** 기능별 사용량 */
  featureUsage: Record<string, number>;
  /** 시간대별 분포 */
  timeDistribution: Record<string, number>;
}

/**
 * 품질 통계 인터페이스
 */
export interface QualityStats {
  /** 평균 품질 점수 */
  avgQualityScore: number;
  /** 사용자 만족도 점수 */
  userSatisfactionScore: number;
  /** 성공적인 상호작용 수 */
  successfulInteractions: number;
  /** 실패한 상호작용 수 */
  failedInteractions: number;
  /** 기능별 품질 점수 */
  qualityByFeature: Record<string, number>;
}

/**
 * 인사이트 정보 인터페이스
 */
export interface Insight {
  /** 인사이트 타입 */
  type: string;
  /** 인사이트 제목 */
  title: string;
  /** 인사이트 설명 */
  description: string;
  /** 심각도 수준 */
  severity: 'info' | 'warning' | 'critical';
  /** 관련 데이터 */
  data: Record<string, any>;
  /** 개선 권장사항 */
  recommendation: string;
}

/**
 * 메트릭 분석 응답 인터페이스
 */
export interface MetricsAnalysisResponse {
  /** 사용자 ID */
  userId: string;
  /** 생성 시간 */
  generatedAt: string;
  /** 분석 시간 범위 */
  timeRange: string;
  /** 성능 통계 */
  performance: PerformanceStats;
  /** 사용량 통계 */
  usage: UsageStats;
  /** 품질 통계 */
  quality: QualityStats;
  /** 인사이트 목록 */
  insights: Insight[];
  /** 원시 데이터 */
  rawData: Record<string, any>;
}

/**
 * 메트릭 쿼리 요청 인터페이스
 */
export interface MetricsQueryRequest {
  /** 메트릭 이름 */
  metricName: string;
  /** 메트릭 타입 */
  metricType?: 'PERFORMANCE' | 'USAGE' | 'QUALITY' | 'ERROR' | 'SYSTEM';
  /** 사용자 ID */
  userId?: string;
  /** 대화 ID */
  conversationId?: string;
  /** 시작 시간 */
  startTime?: string;
  /** 종료 시간 */
  endTime?: string;
  /** 그룹화 필드 */
  groupBy?: string[];
  /** 필터 조건 */
  filters?: Record<string, string>;
  /** 집계 방법 */
  aggregation?: string;
  /** 결과 제한 수 */
  limit?: number;
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