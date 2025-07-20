import axios, { type AxiosInstance } from "axios";

function createInstance(): AxiosInstance {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 120000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createChatInstance(): AxiosInstance {
  return axios.create({
    baseURL: import.meta.env.VITE_CHAT_API_URL as string,
    timeout: 120000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const instance = createInstance();
export const chatInstance = createChatInstance();

export interface ApiResponse<T> {
  data: T;
  message: string;
  code: string;
}
