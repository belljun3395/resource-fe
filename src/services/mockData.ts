import type {
  AgentResponse,
  Conversation,
  MetricsAnalysisResponse,
} from '../types/chatbot'

// Mock 응답 생성 함수
const createMockResponse = (message: string): AgentResponse => {
  // 인사이트/대시보드 전용 응답들
  const dashboardResponses = [
    `📊 **현재 대시보드 요약**

**성능 지표:**
• 평균 응답시간: 245.5ms (목표: <300ms) ✅
• 95퍼센타일: 850.2ms (주의 필요)
• 오류율: 2.1% (정상 범위)

**사용량 현황:**
• 활성 대화: 128개 (전일 대비 +15%)
• 사용자 만족도: 9.2/10 (우수)

**권장사항:** 피크시간 성능 최적화 검토가 필요합니다.`,

    `💡 **주요 인사이트 분석**

**성능 트렌드:**
• 응답시간이 최근 일주일간 12% 개선
• 피크타임(14-16시) 부하 집중 현상

**사용 패턴:**
• 오후 시간대 사용량 45.2% 집중
• 스트리밍 기능 사용률 20% 증가

**개선 포인트:**
• 캐싱 전략 최적화로 응답시간 단축 가능
• 로드밸런싱으로 피크타임 안정성 향상`,

    `📈 **사용량 분석 리포트**

**대화 통계:**
• 총 대화수: 128개 (일평균 8.5회)
• 평균 대화 길이: 8.5메시지
• 완료율: 88.9%

**품질 지표:**
• 정확도: 94.5%
• 사용자 평점: 4.6/5
• 재사용률: 87.3%

**성장 추세:** 주간 사용량 25% 증가로 긍정적 성장세입니다.`,

    `🔍 **시스템 현황 체크**

**안정성:**
• 가동시간: 99.8% (30일 기준)
• 시스템 상태: 최적 (Optimal)
• 활성 연결: 234개

**리소스 사용률:**
• CPU: 45.2% (여유)
• 메모리: 42.5% (정상)
• 네트워크: 125.3MB/s 인바운드

**상태:** 모든 시스템이 정상 운영 중입니다.`
  ]

  // 대시보드 요약 관련 키워드 체크
  const isDashboardQuery = message.toLowerCase().includes('대시보드') ||
                          message.toLowerCase().includes('요약') ||
                          message.toLowerCase().includes('현황') ||
                          message.toLowerCase().includes('상태') ||
                          message.toLowerCase().includes('지표')

  // 인사이트 분석 관련 키워드 체크  
  const isInsightQuery = message.toLowerCase().includes('인사이트') ||
                        message.toLowerCase().includes('분석') ||
                        message.toLowerCase().includes('보고서') ||
                        message.toLowerCase().includes('개선') ||
                        message.toLowerCase().includes('제안') ||
                        message.toLowerCase().includes('최적화')

  const isValidQuery = isDashboardQuery || isInsightQuery

  let content
  if (isDashboardQuery) {
    // 대시보드 관련 응답 (첫 번째와 네 번째 응답)
    const dashboardSpecific = [dashboardResponses[0], dashboardResponses[3]]
    content = dashboardSpecific[Math.floor(Math.random() * dashboardSpecific.length)]
  } else if (isInsightQuery) {
    // 인사이트 분석 관련 응답 (두 번째와 세 번째 응답)
    const insightSpecific = [dashboardResponses[1], dashboardResponses[2]]
    content = insightSpecific[Math.floor(Math.random() * insightSpecific.length)]
  } else {
    content = "죄송합니다. 저는 **대시보드 요약**과 **인사이트 분석** 두 가지만 도와드릴 수 있습니다."
  }

  return {
    content,
    conversationId: `conv-${Date.now()}`,
    timestamp: new Date().toISOString(),
    isStreaming: false,
    sources: [],
    metadata: {
      responseTime: "150ms",
      toolsUsed: isValidQuery ? ["dashboard_analyzer", "metrics_monitor", "insight_generator"] : ["scope_filter"]
    },
    status: "SUCCESS"
  }
}

const createMockMetrics = (): MetricsAnalysisResponse => ({
  userId: "user-123",
  generatedAt: new Date().toISOString(),
  timeRange: "24 hours",
  performance: {
    avgResponseTime: 245.5,
    p95ResponseTime: 850.2,
    errorRate: 0.021,
    totalRequests: 1205,
    throughputPerHour: 50.2
  },
  usage: {
    totalConversations: 128,
    avgMessagesPerConversation: 8.5,
    avgMessageLength: 125.3,
    totalTokensUsed: 15420,
    featureUsage: {
      chat: 850,
      streaming: 245,
      systemPrompt: 110,
      metrics: 95
    },
    timeDistribution: {
      morning: 30.5,
      afternoon: 45.2,
      evening: 24.3
    }
  },
  quality: {
    avgQualityScore: 8.7,
    userSatisfactionScore: 9.2,
    successfulInteractions: 1180,
    failedInteractions: 25,
    qualityByFeature: {
      chat: 8.7,
      streaming: 8.2,
      systemPrompt: 9.1,
      metrics: 8.9
    }
  },
  insights: [
    {
      type: "performance",
      title: "응답 시간 최적화 필요",
      description: "피크 시간대 응답 시간이 평균보다 40% 높음",
      severity: "warning",
      data: { peakHours: ["14:00-16:00", "20:00-22:00"] },
      recommendation: "캐싱 전략 검토 및 인프라 스케일링 고려"
    },
    {
      type: "usage",
      title: "사용량 증가 추세",
      description: "지난 주 대비 대화수가 25% 증가",
      severity: "info",
      data: { growthRate: 0.25 },
      recommendation: "서버 용량 확장 계획 수립"
    },
    {
      type: "quality",
      title: "높은 사용자 만족도",
      description: "사용자 만족도가 9.2점으로 매우 높음",
      severity: "info",
      data: { satisfactionScore: 9.2 },
      recommendation: "현재 서비스 품질 유지"
    }
  ],
  rawData: {
    dailyStats: [
      { date: "2024-01-15", requests: 120, avgResponseTime: 230 },
      { date: "2024-01-16", requests: 135, avgResponseTime: 245 },
      { date: "2024-01-17", requests: 150, avgResponseTime: 260 }
    ]
  }
})

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
]

const mockData = {
  createMockResponse,
  createMockMetrics,
  createMockConversations,
  
  // 추가 Mock 데이터
  health: {
    status: "UP",
    service: "AI Agent",
    timestamp: Date.now(),
    activeConversations: 25
  },
  
  performanceMetrics: {
    cpu: { usage: 45.2, cores: 8 },
    memory: { used: 6.8, total: 16.0, percentage: 42.5 },
    network: { inbound: 125.3, outbound: 98.7 },
    disk: { used: 120.5, total: 500.0, percentage: 24.1 }
  },
  
  usageMetrics: {
    dailyActiveUsers: 156,
    totalSessions: 342,
    avgSessionDuration: 15.5,
    bounceRate: 12.3
  },
  
  qualityMetrics: {
    responseAccuracy: 94.5,
    userRating: 4.6,
    completionRate: 88.9,
    escalationRate: 5.2
  },
  
  realtimeMetrics: {
    currentLoad: 67.8,
    activeConnections: 234,
    requestsPerSecond: 12.5,
    errorCount: 3
  },
  
  systemMetrics: {
    uptime: 2592000, // 30 days in seconds
    version: "1.2.3",
    lastRestart: "2024-01-01T00:00:00Z",
    health: "optimal"
  },
  
  topUsers: [
    { userId: "user-001", requests: 456, lastSeen: "2024-01-17T10:00:00Z" },
    { userId: "user-002", requests: 389, lastSeen: "2024-01-17T09:30:00Z" },
    { userId: "user-003", requests: 312, lastSeen: "2024-01-17T08:45:00Z" },
    { userId: "user-004", requests: 287, lastSeen: "2024-01-17T07:20:00Z" },
    { userId: "user-005", requests: 234, lastSeen: "2024-01-17T06:15:00Z" }
  ],
  
  trends: {
    "api.response_time": [
      { timestamp: "2024-01-15T00:00:00Z", value: 230 },
      { timestamp: "2024-01-16T00:00:00Z", value: 245 },
      { timestamp: "2024-01-17T00:00:00Z", value: 260 },
      { timestamp: "2024-01-18T00:00:00Z", value: 255 },
      { timestamp: "2024-01-19T00:00:00Z", value: 240 }
    ]
  }
}

export default mockData