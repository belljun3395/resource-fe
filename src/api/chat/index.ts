export * from "@/api/chat/dto";

// 환경에 따른 API 선택
const createChatApi = async () => {
  const isDevelopment =
    import.meta.env.DEV || import.meta.env.MODE === "development";
  const useMock = import.meta.env.VITE_USE_MOCK === "true";

  if (isDevelopment && useMock) {
    const { chatApiMock } = await import("@/api/chat/api.mock");
    return chatApiMock;
  } else {
    const { chatApi } = await import("@/api/chat/api");
    return chatApi;
  }
};

// 싱글톤 패턴으로 API 인스턴스 관리
let chatApiInstance: Awaited<ReturnType<typeof createChatApi>> | null = null;

export const getChatApi = async () => {
  if (!chatApiInstance) {
    chatApiInstance = await createChatApi();
  }
  return chatApiInstance;
};
