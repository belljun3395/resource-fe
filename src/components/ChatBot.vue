<template>
  <div
    class="chatbot-container"
    v-if="isLoggedIn"
    data-testid="chatbot-container"
  >
    <div
      v-if="isOpen"
      class="chatbot-window"
      :class="{ 'chatbot-expanded': isExpanded }"
      data-testid="chatbot-window"
    >
      <div class="chatbot-header">
        <div class="chatbot-title">
          <span class="chatbot-icon">🤖</span>
          <span>{{ t("message.chatbot.title") }}</span>
        </div>
        <div class="chatbot-controls">
          <button
            @click="toggleExpand"
            class="control-button"
            :aria-label="
              isExpanded
                ? t('message.chatbot.collapse')
                : t('message.chatbot.expand')
            "
            data-testid="toggle-expand-button"
          >
            {{ isExpanded ? "−" : "+" }}
          </button>
          <button
            @click="closeChatbot"
            class="control-button"
            :aria-label="t('message.chatbot.close')"
            data-testid="close-button"
          >
            ×
          </button>
        </div>
      </div>

      <div class="chatbot-body" v-if="isExpanded">
        <div
          class="messages-container"
          ref="messagesContainer"
          data-testid="messages-container"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="message.type"
            :data-testid="`message-${message.type}`"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>

          <div v-if="isLoading" class="message assistant">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="topic-buttons" v-if="showTopicButtons">
          <div class="topic-header" v-if="messages.length > 1">
            <span class="topic-header-text"
              >💬 새로운 주제를 선택하거나 계속 대화하세요</span
            >
          </div>
          <div class="topic-grid">
            <button
              v-for="topic in quickTopics"
              :key="topic.id"
              @click="selectTopic(topic)"
              class="topic-button"
              :disabled="isLoading"
              :aria-label="
                t('message.chatbot.select-topic', { topic: topic.text })
              "
              :data-testid="`topic-${topic.id}`"
            >
              <span class="topic-icon">{{ topic.icon }}</span>
              <span class="topic-text">{{ topic.text }}</span>
            </button>
          </div>
          <div class="topic-actions" v-if="messages.length > 1">
            <button
              @click="hideTopicButtons"
              class="continue-chat-button"
              data-testid="continue-chat-button"
            >
              💬 현재 주제로 계속 대화하기
            </button>
          </div>
        </div>

        <div class="chatbot-input">
          <div class="input-container">
            <textarea
              v-model="currentMessage"
              @keydown="handleKeydown"
              :placeholder="t('message.chatbot.input-placeholder')"
              class="message-input"
              rows="1"
              ref="messageInput"
              :aria-label="t('message.chatbot.input-label')"
              data-testid="message-input"
            ></textarea>
            <button
              @click="sendMessage"
              :disabled="!currentMessage.trim() || isLoading"
              class="send-button"
              :aria-label="t('message.chatbot.send')"
              data-testid="send-button"
            >
              ↗
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="!isOpen"
      @click="openChatbot"
      class="chatbot-toggle"
      :aria-label="t('message.chatbot.open')"
      data-testid="chatbot-toggle"
    >
      <span class="toggle-icon">💬</span>
    </button>
  </div>
</template>

<script setup lang="ts">
/* ==========================================================================
   Imports
   ========================================================================== */
import { ref, nextTick, onMounted, computed, withDefaults } from "vue";
import { useI18n } from "vue-i18n";
import { chatApi } from "@/api/chat";
import { useUserStore } from "@/store/userStore";
import type { ChatMessage, QuickTopic } from "@/types/chatbot";

/* ==========================================================================
   Props & Emits
   ========================================================================== */
interface Props {
  /** 챗봇 초기 열림 상태 */
  initialOpen?: boolean;
  /** 최대 메시지 수 */
  maxMessages?: number;
  /** 사용자 정의 주제 목록 */
  customTopics?: QuickTopic[];
}

const props = withDefaults(defineProps<Props>(), {
  initialOpen: false,
  maxMessages: 100,
  customTopics: undefined,
});

interface Emits {
  /** 챗봇 열림/닫힘 상태 변경 */
  (e: "toggle", isOpen: boolean): void;
  /** 메시지 전송 */
  (e: "message-sent", message: ChatMessage): void;
  /** 응답 수신 */
  (e: "response-received", response: any): void;
  /** 에러 발생 */
  (e: "error", error: Error): void;
}

const emit = defineEmits<Emits>();

/* ==========================================================================
   Composables & Stores
   ========================================================================== */
const { t } = useI18n();
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLogin());

/* ==========================================================================
   Reactive State
   ========================================================================== */
const isOpen = ref(props.initialOpen);
const isExpanded = ref(false);
const isLoading = ref(false);
const currentMessage = ref("");
const messages = ref<ChatMessage[]>([]);
const messagesContainer = ref<HTMLElement>();
const messageInput = ref<HTMLTextAreaElement>();
const conversationId = ref<string>();
const showTopicButtons = ref(true);

/* ==========================================================================
   Utility Functions
   ========================================================================== */
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/* ==========================================================================
   Quick Topics Configuration
   ========================================================================== */
const defaultQuickTopics: QuickTopic[] = [
  {
    id: "general",
    icon: "💬",
    text: "일반 질문",
    message: "안녕하세요! 무엇을 도와드릴까요?",
  },
];

const quickTopics = computed(() => props.customTopics || defaultQuickTopics);

/* ==========================================================================
   Chatbot Controls
   ========================================================================== */
const openChatbot = () => {
  isOpen.value = true;
  isExpanded.value = true;
  emit("toggle", true);
  nextTick(() => {
    messageInput.value?.focus();
  });
};

const closeChatbot = () => {
  isOpen.value = false;
  isExpanded.value = false;
  emit("toggle", false);
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    nextTick(() => {
      messageInput.value?.focus();
    });
  }
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
  if (messages.value.length >= props.maxMessages) {
    messages.value.shift(); // 가장 오래된 메시지 제거
  }

  messages.value.push(message);

  // 이벤트 발생
  if (type === "user") {
    emit("message-sent", message);
  }

  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

/* ==========================================================================
   Message Sending Logic
   ========================================================================== */
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = currentMessage.value.trim();
  currentMessage.value = "";

  // 사용자 메시지 전송 시 주제 버튼 숨기기
  showTopicButtons.value = false;

  addMessage(userMessage, "user");
  isLoading.value = true;

  try {
    let response;

    response = await chatApi.sendMessage({
      message: userMessage,
      conversationId: conversationId.value,
      userId: generateUUID(),
    });

    if (response.conversationId) {
      conversationId.value = response.conversationId;
    }

    addMessage(response.content, "assistant");
    emit("response-received", response);

    // 응답 후 주제 버튼 다시 표시
    showTopicButtonsAfterResponse();
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    addMessage(t("message.chatbot.messages.error"), "assistant");
    showTopicButtonsAfterResponse();
    emit("error", error instanceof Error ? error : new Error(errorMessage));
  } finally {
    isLoading.value = false;
  }
};

/* ==========================================================================
   Utility Functions
   ========================================================================== */
const selectTopic = (topic: QuickTopic) => {
  currentMessage.value = topic.message;
  showTopicButtons.value = false; // 주제 선택 후 버튼 숨기기
  nextTick(() => {
    sendMessage();
  });
};

const hideTopicButtons = () => {
  showTopicButtons.value = false;
};

const showTopicButtonsAfterResponse = () => {
  // 응답 후 잠시 기다렸다가 주제 버튼 다시 표시
  setTimeout(() => {
    showTopicButtons.value = true;
  }, 1000);
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
   Lifecycle
   ========================================================================== */
onMounted(() => {
  addMessage(t("message.chatbot.messages.welcome"), "assistant");
});
</script>

<style scoped>
/* ==========================================================================
   Chatbot Container
   ========================================================================== */
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(
    --font-family-primary,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif
  );
}

/* ==========================================================================
   Toggle Button
   ========================================================================== */
.chatbot-toggle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* ==========================================================================
   Chatbot Window
   ========================================================================== */
.chatbot-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chatbot-expanded {
  height: 500px;
}

/* ==========================================================================
   Header
   ========================================================================== */
.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbot-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.chatbot-icon {
  font-size: 20px;
}

.chatbot-controls {
  display: flex;
  gap: 8px;
}

.control-button {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.2s;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ==========================================================================
   Body
   ========================================================================== */
.chatbot-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* ==========================================================================
   Messages
   ========================================================================== */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  align-items: flex-end;
}

.message.assistant {
  align-self: flex-start;
  align-items: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
  white-space: pre-wrap;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.assistant .message-content {
  background: #f1f3f4;
  color: #333;
}

.message-time {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
  padding: 0 4px;
}

/* ==========================================================================
   Typing Indicator
   ========================================================================== */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #888;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ==========================================================================
   Topic Buttons
   ========================================================================== */
.topic-buttons {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.topic-header {
  margin-bottom: 12px;
  text-align: center;
}

.topic-header-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.topic-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  min-height: 60px;
}

.topic-button:hover:not(:disabled) {
  border-color: #667eea;
  background: #f0f2ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.topic-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.topic-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.topic-text {
  color: #333;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
}

.topic-actions {
  margin-top: 12px;
  text-align: center;
}

.continue-chat-button {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-chat-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

/* ==========================================================================
   Input
   ========================================================================== */
.chatbot-input {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  max-height: 80px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.send-button {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ==========================================================================
   Scrollbar
   ========================================================================== */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
