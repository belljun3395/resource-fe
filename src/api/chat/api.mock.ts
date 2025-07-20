import type { 
  ChatRequest,
  AgentResponse, 
  Conversation, 
  HealthResponse 
} from "@/api/chat/dto";

export const chatApiMock = {
  async sendMessage(_request: ChatRequest): Promise<AgentResponse> {
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );
    
    const responses = [
      "안녕하세요! 무엇을 도와드릴까요?",
      "네, 어떤 것이 궁금하신가요?",
      "도움이 필요하시면 언제든 말씀해주세요!",
      "안녕하세요! 어떤 질문이 있으신가요?",
    ];

    const content = responses[Math.floor(Math.random() * responses.length)];

    return {
      content,
      conversationId: `conv-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isStreaming: false,
      sources: [],
      metadata: {
        responseTime: "150ms",
        toolsUsed: ["chat_assistant"],
      },
      status: "SUCCESS",
    };
  },

  async sendMessageWithSystemPrompt(
    request: ChatRequest,
    _systemPrompt: string
  ): Promise<AgentResponse> {
    await new Promise((resolve) =>
      setTimeout(resolve, 700 + Math.random() * 1000)
    );
    
    return this.sendMessage(request);
  },

  createStreamingChat(
    _message: string,
    _conversationId?: string,
    _userId?: string
  ): EventSource {
    // Mock EventSource for development
    const mockEventSource = new EventSource('data:text/plain,');
    return mockEventSource;
  },

  async getConversations(
    _userId?: string,
    activeOnly: boolean = true
  ): Promise<Conversation[]> {
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );
    
    const conversations = [
      {
        id: "conv-1",
        userId: "user-123",
        title: "서버 상태 확인",
        summary: "사용자가 서버 상태를 확인하고 모니터링 설정에 대해 문의함",
        createdAt: "2024-01-15T09:00:00Z",
        lastActivity: "2024-01-15T10:30:00Z",
        messageCount: 5,
        isActive: true,
      },
      {
        id: "conv-2",
        userId: "user-123",
        title: "메트릭 분석 요청",
        summary: "성능 메트릭과 사용량 데이터에 대한 분석 요청",
        createdAt: "2024-01-14T14:20:00Z",
        lastActivity: "2024-01-14T15:45:00Z",
        messageCount: 8,
        isActive: false,
      },
      {
        id: "conv-3",
        userId: "user-123",
        title: "인사이트 리포트",
        summary: "시스템 인사이트와 최적화 방안에 대한 논의",
        createdAt: "2024-01-13T11:10:00Z",
        lastActivity: "2024-01-13T12:00:00Z",
        messageCount: 3,
        isActive: true,
      },
    ];
    
    return activeOnly
      ? conversations.filter((c) => c.isActive)
      : conversations;
  },

  async deleteConversation(
    _conversationId: string,
    _userId?: string
  ): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 200)
    );
  },

  async getHealth(): Promise<HealthResponse> {
    await new Promise((resolve) =>
      setTimeout(resolve, 100 + Math.random() * 200)
    );
    
    return {
      status: "UP",
      service: "AI Agent",
      timestamp: Date.now(),
      activeConversations: 25,
    };
  },
};
