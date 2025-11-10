import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any
): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      url: endpoint,
      method,
      data: body,
    });
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "API error";
    throw new Error(message);
  }
}
