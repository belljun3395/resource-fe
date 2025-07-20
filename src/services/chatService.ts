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
 * 메트릭 분석 응답 인터페이스
 */
export interface MetricsAnalysisResponse {
  /** 사용자 ID */
  userId: string;
  /** 생성 시간 */
  generatedAt: string;
  /** 시간 범위 */
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
 * 성능 통계 인터페이스
 */
export interface PerformanceStats {
  /** 평균 응답 시간 (ms) */
  avgResponseTime: number;
  /** 95퍼센타일 응답 시간 (ms) */
  p95ResponseTime: number;
  /** 오류율 (0-1) */
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
  /** 총 토큰 사용량 */
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
  /** 평균 품질 점수 (0-10) */
  avgQualityScore: number;
  /** 사용자 만족도 점수 (0-10) */
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
  /** 심각도 */
  severity: "info" | "warning" | "critical";
  /** 관련 데이터 */
  data: Record<string, any>;
  /** 권장사항 */
  recommendation: string;
}

/**
 * 메트릭 쿼리 요청 인터페이스
 */
export interface MetricsQueryRequest {
  /** 메트릭 이름 */
  metricName: string;
  /** 메트릭 타입 (선택적) */
  metricType?: "PERFORMANCE" | "USAGE" | "QUALITY" | "ERROR" | "SYSTEM";
  /** 사용자 ID (선택적) */
  userId?: string;
  /** 대화 ID (선택적) */
  conversationId?: string;
  /** 시작 시간 (선택적) */
  startTime?: string;
  /** 종료 시간 (선택적) */
  endTime?: string;
  /** 그룹화 기준 (선택적) */
  groupBy?: string[];
  /** 필터 조건 (선택적) */
  filters?: Record<string, string>;
  /** 집계 방법 (선택적) */
  aggregation?: string;
  /** 결과 제한 수 (선택적) */
  limit?: number;
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

import mockData from './mockData'

/* ==========================================================================
   Service Configuration
   ========================================================================== */
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || "http://localhost:3001";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

/**
 * ChatService 클래스
 * AI 채팅 및 메트릭 관련 API 호출을 담당
 */
class ChatService {
  /* ==========================================================================
     Private Methods
     ========================================================================== */

  /**
   * 공통 HTTP 요청 처리 메서드
   * @param endpoint - API 엔드포인트
   * @param options - 요청 옵션
   * @returns Promise<T> - 응답 데이터
   * @throws Error - HTTP 오류 또는 네트워크 오류 시
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${CHAT_API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          error: `HTTP ${response.status} ${response.statusText}`,
          code: response.status.toString(),
          timestamp: new Date().toISOString(),
          path: endpoint,
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  /* ==========================================================================
     Chat Methods
     ========================================================================== */

  /**
   * 일반 메시지 전송
   * @param request - 채팅 요청 데이터
   * @returns Promise<AgentResponse> - AI 응답
   */
  async sendMessage(request: ChatRequest): Promise<AgentResponse> {
    if (USE_MOCK) {
      // Mock 환경에서는 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      return mockData.createMockResponse(request.message);
    }
    
    return this.request<AgentResponse>("/api/v1/agent/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * 시스템 프롬프트와 함께 메시지 전송
   * @param request - 채팅 요청 데이터
   * @param systemPrompt - 시스템 프롬프트
   * @returns Promise<AgentResponse> - AI 응답
   */
  async sendMessageWithSystemPrompt(
    request: ChatRequest,
    systemPrompt: string
  ): Promise<AgentResponse> {
    if (USE_MOCK) {
      // Mock 환경에서는 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 1000));
      return mockData.createMockResponse(request.message);
    }
    
    return this.request<AgentResponse>(
      `/api/v1/agent/chat/system?systemPrompt=${encodeURIComponent(systemPrompt)}`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * 스트리밍 채팅 연결 생성
   * @param message - 사용자 메시지
   * @param conversationId - 대화 ID (선택적)
   * @param userId - 사용자 ID (선택적)
   * @returns EventSource - 스트리밍 연결
   */
  createStreamingChat(
    message: string,
    conversationId?: string,
    userId?: string
  ): EventSource {
    const params = new URLSearchParams();
    params.append("message", message);
    if (conversationId) params.append("conversationId", conversationId);
    if (userId) params.append("userId", userId);

    return new EventSource(
      `${CHAT_API_BASE_URL}/api/v1/agent/chat/stream?${params}`
    );
  }

  /* ==========================================================================
     Conversation Methods
     ========================================================================== */

  async getConversations(
    userId?: string,
    activeOnly: boolean = true
  ): Promise<Conversation[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); // 0.2-0.5초 지연
      const conversations = mockData.createMockConversations();
      return activeOnly ? conversations.filter(c => c.isActive) : conversations;
    }
    
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (activeOnly !== undefined)
      params.append("activeOnly", activeOnly.toString());

    return this.request<Conversation[]>(
      `/api/v1/agent/conversations?${params}`
    );
  }

  async deleteConversation(
    conversationId: string,
    userId?: string
  ): Promise<void> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);

    return this.request<void>(
      `/api/v1/agent/conversations/${conversationId}?${params}`,
      { method: "DELETE" }
    );
  }

  async getHealth(): Promise<{
    status: string;
    service: string;
    timestamp: number;
    activeConversations: number;
  }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200)); // 0.1-0.3초 지연
      return mockData.health;
    }
    
    return this.request("/api/v1/agent/health");
  }

  async getDashboard(
    userId?: string,
    hours: number = 24
  ): Promise<MetricsAnalysisResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500)); // 0.3-0.8초 지연
      return mockData.createMockMetrics();
    }
    
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("hours", hours.toString());

    return this.request<MetricsAnalysisResponse>(
      `/api/v1/metrics/dashboard?${params}`
    );
  }

  async getPerformanceMetrics(
    userId?: string,
    startTime?: string,
    endTime?: string
  ): Promise<Record<string, any>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 400));
      return mockData.performanceMetrics;
    }
    
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (startTime) params.append("startTime", startTime);
    if (endTime) params.append("endTime", endTime);

    return this.request<Record<string, any>>(
      `/api/v1/metrics/performance?${params}`
    );
  }

  async getUsageMetrics(
    userId?: string,
    days: number = 7
  ): Promise<Record<string, any>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 400));
      return mockData.usageMetrics;
    }
    
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("days", days.toString());

    return this.request<Record<string, any>>(`/api/v1/metrics/usage?${params}`);
  }

  async getQualityMetrics(
    userId?: string,
    days: number = 7
  ): Promise<Record<string, any>> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("days", days.toString());

    return this.request<Record<string, any>>(
      `/api/v1/metrics/quality?${params}`
    );
  }

  async queryMetrics(
    request: MetricsQueryRequest
  ): Promise<Record<string, any>> {
    return this.request<Record<string, any>>("/api/v1/metrics/query", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getInsights(
    userId?: string,
    days: number = 7
  ): Promise<Record<string, any>> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("days", days.toString());

    return this.request<Record<string, any>>(
      `/api/v1/metrics/insights?${params}`
    );
  }

  async getRealtimeMetrics(): Promise<Record<string, any>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      return mockData.realtimeMetrics;
    }
    
    return this.request<Record<string, any>>("/api/v1/metrics/realtime");
  }

  async getTopUsers(
    days: number = 7,
    limit: number = 10
  ): Promise<Record<string, any>> {
    const params = new URLSearchParams();
    params.append("days", days.toString());
    params.append("limit", limit.toString());

    return this.request<Record<string, any>>(
      `/api/v1/metrics/top-users?${params}`
    );
  }

  async getSystemMetrics(): Promise<Record<string, any>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 300));
      return mockData.systemMetrics;
    }
    
    return this.request<Record<string, any>>("/api/v1/metrics/system");
  }

  async getTrends(
    metricName: string,
    days: number = 30,
    granularity: "hourly" | "daily" | "weekly" = "daily"
  ): Promise<Record<string, any>> {
    const params = new URLSearchParams();
    params.append("metricName", metricName);
    params.append("days", days.toString());
    params.append("granularity", granularity);

    return this.request<Record<string, any>>(
      `/api/v1/metrics/trends?${params}`
    );
  }

}

export const chatService = new ChatService();
