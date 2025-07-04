export * from "@/api/vm/dto";

// 환경에 따른 API 선택
const createVmApi = async () => {
  const isDevelopment = import.meta.env.DEV;
  const useMock = import.meta.env.VITE_USE_MOCK === "true";

  if (isDevelopment && useMock) {
    const { vmApiMock } = await import("@/api/vm/api.mock");
    return vmApiMock;
  } else {
    const { vmApi } = await import("@/api/vm/api");
    return vmApi;
  }
};

// 싱글톤 패턴으로 API 인스턴스 관리
let vmApiInstance: Awaited<ReturnType<typeof createVmApi>> | null = null;

export const getVmApi = async () => {
  if (!vmApiInstance) {
    vmApiInstance = await createVmApi();
  }
  return vmApiInstance;
};
