/**
 * ChatBot Composable
 * @file useChatBot.ts
 * @description 챗봇 로직을 재사용 가능한 Composable로 분리
 */

/* ==========================================================================
   Imports
   ========================================================================== */
import { ref, computed, nextTick, type Ref, type ComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import { chatApi } from "@/api/chat";
import type { ChatMessage, QuickTopic } from "@/types/chatbot";

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
  addMessage: (content: string, type: "user" | "assistant") => void;

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
const createDefaultQuickTopics = (): QuickTopic[] => [
  {
    id: "general",
    icon: "💬",
    text: "일반 질문",
    message: "안녕하세요! 무엇을 도와드릴까요?",
  },
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
  const { maxMessages = 100, initialOpen = false, customTopics } = options;

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
  const currentMessage = ref("");
  const messages = ref<ChatMessage[]>([]);
  const conversationId = ref<string>();

  /* ==========================================================================
     Utility Functions  
     ========================================================================== */
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

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
  const quickTopics = computed(
    () => customTopics || createDefaultQuickTopics()
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
  const addMessage = (content: string, type: "user" | "assistant") => {
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
    if (type === "user") {
      emitMessageSent(message);
    }
  };

  /* ==========================================================================
     Message Sending Logic
     ========================================================================== */
  const sendMessage = async () => {
    if (!currentMessage.value.trim() || isLoading.value) return;

    const userMessage = currentMessage.value.trim();
    currentMessage.value = "";

    addMessage(userMessage, "user");
    isLoading.value = true;

    try {
      const response = await chatApi.sendMessage({
        message: userMessage,
        conversationId: conversationId.value,
        userId: generateUUID(),
      });

      if (response.conversationId) {
        conversationId.value = response.conversationId;
      }

      addMessage(response.content, "assistant");
      emitResponseReceived(response);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addMessage(t("chatbot.messages.error"), "assistant");
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
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ==========================================================================
     Event Emitters
     ========================================================================== */
  const emitToggle = (isOpen: boolean) => {
    toggleCallbacks.value.forEach((callback) => callback(isOpen));
  };

  const emitMessageSent = (message: ChatMessage) => {
    messageSentCallbacks.value.forEach((callback) => callback(message));
  };

  const emitResponseReceived = (response: any) => {
    responseReceivedCallbacks.value.forEach((callback) => callback(response));
  };

  const emitError = (error: Error) => {
    errorCallbacks.value.forEach((callback) => callback(error));
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
    addMessage(t("chatbot.messages.welcome"), "assistant");
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
