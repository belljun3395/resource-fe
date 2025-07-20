import { chatInstance } from "@/api/common";
import type {
  ChatRequest,
  AgentResponse,
  Conversation,
  HealthResponse,
} from "@/api/chat/dto";

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<AgentResponse> {
    const response = await chatInstance.post<AgentResponse>(
      "/api/v1/agent/chat",
      request
    );
    return response.data;
  },

  async sendMessageWithSystemPrompt(
    request: ChatRequest,
    systemPrompt: string
  ): Promise<AgentResponse> {
    const response = await chatInstance.post<AgentResponse>(
      `/api/v1/agent/chat/system?systemPrompt=${encodeURIComponent(
        systemPrompt
      )}`,
      request
    );
    return response.data;
  },

  createStreamingChat(
    message: string,
    conversationId?: string,
    userId?: string
  ): EventSource {
    const params = new URLSearchParams();
    params.append("message", message);
    if (conversationId) params.append("conversationId", conversationId);
    if (userId) params.append("userId", userId);

    const baseURL = chatInstance.defaults.baseURL;
    return new EventSource(
      `${baseURL}/api/v1/agent/chat/stream?${params}`
    );
  },

  async getConversations(
    userId?: string,
    activeOnly: boolean = true
  ): Promise<Conversation[]> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (activeOnly !== undefined)
      params.append("activeOnly", activeOnly.toString());

    const response = await chatInstance.get<Conversation[]>(
      `/api/v1/agent/conversations?${params}`
    );
    return response.data;
  },

  async deleteConversation(
    conversationId: string,
    userId?: string
  ): Promise<void> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);

    await chatInstance.delete<void>(
      `/api/v1/agent/conversations/${conversationId}?${params}`
    );
  },

  async getHealth(): Promise<HealthResponse> {
    const response = await chatInstance.get<HealthResponse>(
      "/api/v1/agent/health"
    );
    return response.data;
  },
};
