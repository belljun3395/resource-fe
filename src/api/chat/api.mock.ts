import type {
  AgentResponse,
  Conversation,
} from "@/api/chat/dto";

const createMockResponse = (message: string): AgentResponse => {
  const responses = [
    "안녕하세요! 무엇을 도와드릴까요?",
    "네, 어떤 것이 궁금하신가요?",
    "도움이 필요하시면 언제든 말씀해주세요!",
    "안녕하세요! 어떤 질문이 있으신가요?"
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
      toolsUsed: ["chat_assistant"]
    },
    status: "SUCCESS"
  };
};


const createMockConversations = (): Conversation[] => [
  {
    id: "conv-1",
    userId: "user-123",
    title: "서버 상태 확인",
    summary: "사용자가 서버 상태를 확인하고 모니터링 설정에 대해 문의함",
    createdAt: "2024-01-15T09:00:00Z",
    lastActivity: "2024-01-15T10:30:00Z",
    messageCount: 5,
    isActive: true
  },
  {
    id: "conv-2",
    userId: "user-123",
    title: "메트릭 분석 요청",
    summary: "성능 메트릭과 사용량 데이터에 대한 분석 요청",
    createdAt: "2024-01-14T14:20:00Z",
    lastActivity: "2024-01-14T15:45:00Z",
    messageCount: 8,
    isActive: false
  },
  {
    id: "conv-3",
    userId: "user-123",
    title: "인사이트 리포트",
    summary: "시스템 인사이트와 최적화 방안에 대한 논의",
    createdAt: "2024-01-13T11:10:00Z",
    lastActivity: "2024-01-13T12:00:00Z",
    messageCount: 3,
    isActive: true
  }
];

const mockData = {
  createMockResponse,
  createMockConversations,
  
  health: {
    status: "UP",
    service: "AI Agent",
    timestamp: Date.now(),
    activeConversations: 25
  }
};

export default mockData;