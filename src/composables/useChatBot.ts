/**
 * ChatBot Composable
 * @file useChatBot.ts
 * @description 챗봇 로직을 재사용 가능한 Composable로 분리
 */

/* ==========================================================================
   Imports
   ========================================================================== */
import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { chatService } from '@/services/chatService';
import type { ChatMessage, QuickTopic } from '@/types/chatbot';

/* ==========================================================================
   Composable Options Interface
   ========================================================================== */
interface UseChatBotOptions {
  /** 최대 메시지 수 */
  maxMessages?: number;
  /** 초기 열림 상태 */
  initialOpen?: boolean;
  /** 사용자 정의 주제 목록 */
  customTopics?: QuickTopic[];
}

/* ==========================================================================
   Composable Return Type
   ========================================================================== */
interface UseChatBotReturn {
  // 상태
  isOpen: Ref<boolean>;
  isExpanded: Ref<boolean>;
  isLoading: Ref<boolean>;
  currentMessage: Ref<string>;
  messages: Ref<ChatMessage[]>;
  conversationId: Ref<string | undefined>;
  quickTopics: ComputedRef<QuickTopic[]>;
  
  // 액션
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleExpand: () => void;
  sendMessage: () => Promise<void>;
  selectTopic: (topic: QuickTopic) => void;
  addMessage: (content: string, type: 'user' | 'assistant') => void;
  
  // 유틸리티
  formatTime: (timestamp: Date) => string;
  handleKeydown: (event: KeyboardEvent) => void;
  
  // 이벤트 핸들러
  onToggle: (callback: (isOpen: boolean) => void) => void;
  onMessageSent: (callback: (message: ChatMessage) => void) => void;
  onResponseReceived: (callback: (response: any) => void) => void;
  onError: (callback: (error: Error) => void) => void;
}

/* ==========================================================================
   Default Quick Topics
   ========================================================================== */
const createDefaultQuickTopics = (t: any): QuickTopic[] => [
  {
    id: "dashboard",
    icon: "📊",
    text: t('chatbot.topics.dashboard'),
    message: t('chatbot.messages.dashboard-request')
  },
  {
    id: "insights",
    icon: "💡",
    text: t('chatbot.topics.insights'),
    message: t('chatbot.messages.insights-request')
  }
];

/* ==========================================================================
   Main Composable Function
   ========================================================================== */
/**
 * 챗봇 관련 로직을 제공하는 Composable
 * @param options - 챗봇 설정 옵션
 * @returns 챗봇 상태와 액션
 */
export function useChatBot(options: UseChatBotOptions = {}): UseChatBotReturn {
  const {
    maxMessages = 100,
    initialOpen = false,
    customTopics
  } = options;

  /* ==========================================================================
     I18n
     ========================================================================== */
  const { t } = useI18n();

  /* ==========================================================================
     Reactive State
     ========================================================================== */
  const isOpen = ref(initialOpen);
  const isExpanded = ref(false);
  const isLoading = ref(false);
  const currentMessage = ref('');
  const messages = ref<ChatMessage[]>([]);
  const conversationId = ref<string>();

  /* ==========================================================================
     Event Callbacks
     ========================================================================== */
  const toggleCallbacks = ref<Array<(isOpen: boolean) => void>>([]);
  const messageSentCallbacks = ref<Array<(message: ChatMessage) => void>>([]);
  const responseReceivedCallbacks = ref<Array<(response: any) => void>>([]);
  const errorCallbacks = ref<Array<(error: Error) => void>>([]);

  /* ==========================================================================
     Computed Properties
     ========================================================================== */
  const quickTopics = computed(() => 
    customTopics || createDefaultQuickTopics(t)
  );

  /* ==========================================================================
     Chatbot Controls
     ========================================================================== */
  const openChatbot = () => {
    isOpen.value = true;
    isExpanded.value = true;
    emitToggle(true);
  };

  const closeChatbot = () => {
    isOpen.value = false;
    isExpanded.value = false;
    emitToggle(false);
  };

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };

  /* ==========================================================================
     Message Management
     ========================================================================== */
  const addMessage = (content: string, type: 'user' | 'assistant') => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    
    // 최대 메시지 수 제한
    if (messages.value.length >= maxMessages) {
      messages.value.shift(); // 가장 오래된 메시지 제거
    }
    
    messages.value.push(message);
    
    // 이벤트 발생
    if (type === 'user') {
      emitMessageSent(message);
    }
  };

  /* ==========================================================================
     Message Sending Logic
     ========================================================================== */
  const sendMessage = async () => {
    if (!currentMessage.value.trim() || isLoading.value) return;

    const userMessage = currentMessage.value.trim();
    currentMessage.value = '';

    addMessage(userMessage, 'user');
    isLoading.value = true;

    try {
      // 대시보드 요약 또는 인사이트 분석 관련 질문인지 확인
      const isDashboardQuery =
        userMessage.toLowerCase().includes('대시보드') ||
        userMessage.toLowerCase().includes('요약') ||
        userMessage.toLowerCase().includes('현황') ||
        userMessage.toLowerCase().includes('상태') ||
        userMessage.toLowerCase().includes('지표');

      const isInsightQuery =
        userMessage.toLowerCase().includes('인사이트') ||
        userMessage.toLowerCase().includes('분석') ||
        userMessage.toLowerCase().includes('보고서') ||
        userMessage.toLowerCase().includes('개선') ||
        userMessage.toLowerCase().includes('제안') ||
        userMessage.toLowerCase().includes('최적화');

      const isValidQuery = isDashboardQuery || isInsightQuery;

      let response;
      if (isValidQuery) {
        // 메트릭 데이터를 먼저 가져온 후 시스템 프롬프트와 함께 전송
        try {
          const metricsData = await chatService.getDashboard();
          let systemPrompt = '';
          
          if (isDashboardQuery) {
            systemPrompt = `당신은 대시보드 요약 전문 AI 어시스턴트입니다.
현재 시스템 데이터를 바탕으로 핵심 지표와 현황을 요약해서 제공해주세요.

📊 성능 메트릭:
- 평균 응답시간: ${metricsData.performance?.avgResponseTime}ms
- 95퍼센타일 응답시간: ${metricsData.performance?.p95ResponseTime}ms  
- 오류율: ${(metricsData.performance?.errorRate * 100).toFixed(1)}%
- 처리량: ${metricsData.performance?.throughputPerHour}/시간

📈 사용량 통계:
- 총 대화수: ${metricsData.usage?.totalConversations}
- 평균 메시지/대화: ${metricsData.usage?.avgMessagesPerConversation}
- 총 토큰 사용량: ${metricsData.usage?.totalTokensUsed}

📋 품질 지표:
- 평균 품질점수: ${metricsData.quality?.avgQualityScore}/10
- 사용자 만족도: ${metricsData.quality?.userSatisfactionScore}/10
- 성공률: ${((metricsData.quality?.successfulInteractions / (metricsData.quality?.successfulInteractions + metricsData.quality?.failedInteractions)) * 100).toFixed(1)}%

대시보드 형태로 현재 상황을 명확하고 간결하게 요약해주세요.`;
          } else if (isInsightQuery) {
            systemPrompt = `당신은 인사이트 분석 전문 AI 어시스턴트입니다.
다음 데이터를 분석하여 보고서 작성에 활용할 수 있는 인사이트와 개선 제안을 제공해주세요.

📊 성능 메트릭:
- 평균 응답시간: ${metricsData.performance?.avgResponseTime}ms
- 95퍼센타일 응답시간: ${metricsData.performance?.p95ResponseTime}ms  
- 오류율: ${(metricsData.performance?.errorRate * 100).toFixed(1)}%
- 처리량: ${metricsData.performance?.throughputPerHour}/시간

📈 사용량 통계:
- 총 대화수: ${metricsData.usage?.totalConversations}
- 평균 메시지/대화: ${metricsData.usage?.avgMessagesPerConversation}
- 총 토큰 사용량: ${metricsData.usage?.totalTokensUsed}

📋 품질 지표:
- 평균 품질점수: ${metricsData.quality?.avgQualityScore}/10
- 사용자 만족도: ${metricsData.quality?.userSatisfactionScore}/10
- 성공률: ${((metricsData.quality?.successfulInteractions / (metricsData.quality?.successfulInteractions + metricsData.quality?.failedInteractions)) * 100).toFixed(1)}%

💡 주요 인사이트:
${metricsData.insights?.map(insight => `- ${insight.title}: ${insight.description}`).join('\n')}

데이터 분석을 통한 의미있는 인사이트와 실행 가능한 개선 제안을 제공해주세요.`;
          }

          response = await chatService.sendMessageWithSystemPrompt(
            {
              message: userMessage,
              conversationId: conversationId.value,
              userId: 'user-' + Date.now(),
            },
            systemPrompt
          );
        } catch (metricsError) {
          console.warn('메트릭 데이터 로드 실패:', metricsError);
          addMessage(
            t('chatbot.messages.metrics-error'),
            'assistant'
          );
          isLoading.value = false;
          return;
        }
      } else {
        // 주제 범위를 벗어난 질문에 대한 안내
        addMessage(
          t('chatbot.messages.scope-limited'),
          'assistant'
        );
        isLoading.value = false;
        return;
      }

      if (response.conversationId) {
        conversationId.value = response.conversationId;
      }

      addMessage(response.content, 'assistant');
      emitResponseReceived(response);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addMessage(
        t('chatbot.messages.error'),
        'assistant'
      );
      emitError(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      isLoading.value = false;
    }
  };

  /* ==========================================================================
     Utility Functions
     ========================================================================== */
  const selectTopic = (topic: QuickTopic) => {
    currentMessage.value = topic.message;
    nextTick(() => {
      sendMessage();
    });
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ==========================================================================
     Event Emitters
     ========================================================================== */
  const emitToggle = (isOpen: boolean) => {
    toggleCallbacks.value.forEach(callback => callback(isOpen));
  };

  const emitMessageSent = (message: ChatMessage) => {
    messageSentCallbacks.value.forEach(callback => callback(message));
  };

  const emitResponseReceived = (response: any) => {
    responseReceivedCallbacks.value.forEach(callback => callback(response));
  };

  const emitError = (error: Error) => {
    errorCallbacks.value.forEach(callback => callback(error));
  };

  /* ==========================================================================
     Event Listeners
     ========================================================================== */
  const onToggle = (callback: (isOpen: boolean) => void) => {
    toggleCallbacks.value.push(callback);
  };

  const onMessageSent = (callback: (message: ChatMessage) => void) => {
    messageSentCallbacks.value.push(callback);
  };

  const onResponseReceived = (callback: (response: any) => void) => {
    responseReceivedCallbacks.value.push(callback);
  };

  const onError = (callback: (error: Error) => void) => {
    errorCallbacks.value.push(callback);
  };

  /* ==========================================================================
     Initialization
     ========================================================================== */
  // 초기 환영 메시지 추가
  nextTick(() => {
    addMessage(
      t('chatbot.messages.welcome'),
      'assistant'
    );
  });

  /* ==========================================================================
     Return
     ========================================================================== */
  return {
    // 상태
    isOpen,
    isExpanded,
    isLoading,
    currentMessage,
    messages,
    conversationId,
    quickTopics,
    
    // 액션
    openChatbot,
    closeChatbot,
    toggleExpand,
    sendMessage,
    selectTopic,
    addMessage,
    
    // 유틸리티
    formatTime,
    handleKeydown,
    
    // 이벤트 핸들러
    onToggle,
    onMessageSent,
    onResponseReceived,
    onError,
  };
}