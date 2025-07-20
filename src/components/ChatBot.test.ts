/**
 * ChatBot 컴포넌트 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { createPinia, setActivePinia } from "pinia";
import ChatBot from "./ChatBot.vue";
import { messages } from "@/locales";

// Mock chatService
vi.mock("@/services/chatService", () => ({
  chatService: {
    sendMessage: vi.fn(),
    sendMessageWithSystemPrompt: vi.fn(),
    getDashboard: vi.fn(),
  },
}));

// Mock userStore
vi.mock("@/store/userStore", () => ({
  useUserStore: vi.fn(() => ({
    isLogin: vi.fn(() => true),
  })),
}));

// Mock useChatBot composable
vi.mock("@/composables/useChatBot", () => ({
  useChatBot: vi.fn(() => ({
    state: {
      value: {
        isOpen: false,
        isExpanded: false,
        isLoading: false,
        currentMessage: "",
        messages: [],
        conversationId: undefined,
      },
    },
    messagesContainer: { value: null },
    messageInput: { value: null },
    isLoggedIn: { value: true },
    quickTopics: {
      value: [
        {
          id: "dashboard",
          icon: "📊",
          text: "대시보드 요약",
          message: "현재 시스템 대시보드 전체 요약을 보여주세요",
          category: "dashboard",
        },
        {
          id: "insights",
          icon: "💡",
          text: "인사이트 분석",
          message: "보고서를 위한 주요 인사이트와 분석 내용을 정리해주세요",
          category: "insights",
        },
      ],
    },
    openChatbot: vi.fn(),
    closeChatbot: vi.fn(),
    toggleExpand: vi.fn(),
    sendMessage: vi.fn(),
    selectTopic: vi.fn(),
    handleKeydown: vi.fn(),
    formatTime: vi.fn(() => "12:00"),
    initializeWelcomeMessage: vi.fn(),
  })),
}));

describe("ChatBot", () => {
  let i18n: any;
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    i18n = createI18n({
      legacy: false,
      locale: "ko",
      messages,
    });
  });

  const createWrapper = (props = {}) => {
    return mount(ChatBot, {
      props,
      global: {
        plugins: [i18n, pinia],
      },
    });
  };

  describe("컴포넌트 렌더링", () => {
    it("로그인된 사용자에게만 표시된다", () => {
      const wrapper = createWrapper();
      expect(wrapper.find('[data-testid="chatbot-container"]').exists()).toBe(true);
    });

    it("초기 상태에서 챗봇 토글 버튼이 표시된다", () => {
      const wrapper = createWrapper();
      expect(wrapper.find('[data-testid="chatbot-toggle"]').exists()).toBe(true);
    });

    it("Props를 올바르게 전달받는다", () => {
      const props = {
        initialOpen: true,
        initialExpanded: true,
        theme: "dark" as const,
      };
      const wrapper = createWrapper(props);
      expect(wrapper.props()).toEqual(expect.objectContaining(props));
    });
  });

  describe("챗봇 상태 관리", () => {
    it("챗봇이 열렸을 때 창이 표시된다", async () => {
      const wrapper = createWrapper({ initialOpen: true });
      expect(wrapper.find('[data-testid="chatbot-window"]').exists()).toBe(true);
    });

    it("챗봇이 확장되었을 때 본문이 표시된다", async () => {
      const wrapper = createWrapper({ 
        initialOpen: true, 
        initialExpanded: true 
      });
      expect(wrapper.find(".chatbot-body").exists()).toBe(true);
    });
  });

  describe("UI 요소 테스트", () => {
    it("헤더에 올바른 제목이 표시된다", () => {
      const wrapper = createWrapper({ initialOpen: true });
      const title = wrapper.find(".chatbot-title span:last-child");
      expect(title.text()).toBe("AI 어시스턴트");
    });

    it("컨트롤 버튼들이 올바르게 렌더링된다", () => {
      const wrapper = createWrapper({ initialOpen: true });
      expect(wrapper.find('[data-testid="chatbot-expand-button"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="chatbot-close-button"]').exists()).toBe(true);
    });

    it("메시지 입력창이 올바른 placeholder를 가진다", () => {
      const wrapper = createWrapper({ 
        initialOpen: true, 
        initialExpanded: true 
      });
      const input = wrapper.find('[data-testid="message-input"]');
      expect(input.attributes("placeholder")).toBe("메시지를 입력하세요...");
    });
  });

  describe("빠른 주제 버튼", () => {
    it("메시지가 적을 때 주제 버튼들이 표시된다", () => {
      const wrapper = createWrapper({ 
        initialOpen: true, 
        initialExpanded: true 
      });
      expect(wrapper.find('[data-testid="topic-buttons"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="topic-button-dashboard"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="topic-button-insights"]').exists()).toBe(true);
    });
  });

  describe("접근성", () => {
    it("버튼들에 올바른 aria-label이 설정되어 있다", () => {
      const wrapper = createWrapper({ initialOpen: true });
      
      const expandButton = wrapper.find('[data-testid="chatbot-expand-button"]');
      const closeButton = wrapper.find('[data-testid="chatbot-close-button"]');
      
      expect(expandButton.attributes("aria-label")).toBeTruthy();
      expect(closeButton.attributes("aria-label")).toBeTruthy();
    });

    it("토글 버튼에 올바른 aria-label이 설정되어 있다", () => {
      const wrapper = createWrapper();
      const toggleButton = wrapper.find('[data-testid="chatbot-toggle"]');
      expect(toggleButton.attributes("aria-label")).toBeTruthy();
    });
  });

  describe("반응형 디자인", () => {
    it("CSS 클래스가 올바르게 적용된다", () => {
      const wrapper = createWrapper({ initialOpen: true });
      expect(wrapper.find(".chatbot-window").exists()).toBe(true);
      expect(wrapper.find(".chatbot-header").exists()).toBe(true);
    });
  });

  describe("컴포넌트 라이프사이클", () => {
    it("컴포넌트가 마운트될 때 초기화 함수가 호출된다", () => {
      const { useChatBot } = require("@/composables/useChatBot");
      const mockUseChatBot = useChatBot as any;
      
      createWrapper();
      
      expect(mockUseChatBot).toHaveBeenCalledWith({
        customTopics: undefined,
        enableWelcomeMessage: true,
        enableAutoScroll: true,
      });
    });
  });
});