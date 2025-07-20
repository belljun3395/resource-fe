import type {
  ChatRequest,
  AgentResponse,
  Conversation,
  ErrorResponse,
} from "@/api/chat/dto";
import mockData from "./api.mock";

const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || "http://localhost:3001";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

/**
 * ChatService 클래스
 * AI 채팅 관련 API 호출을 담당
 */
class ChatService {
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

  /**
   * 일반 메시지 전송
   * @param request - 채팅 요청 데이터
   * @returns Promise<AgentResponse> - AI 응답
   */
  async sendMessage(request: ChatRequest): Promise<AgentResponse> {
    if (USE_MOCK) {
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

  async getConversations(
    userId?: string,
    activeOnly: boolean = true
  ): Promise<Conversation[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
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
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      return mockData.health;
    }
    
    return this.request("/api/v1/agent/health");
  }

}

export const chatApi = new ChatService();