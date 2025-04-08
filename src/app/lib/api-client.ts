const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T, D = Record<string, unknown>>(
    endpoint: string,
    data: D,
    options: RequestInit = {}
  ) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T, D = Record<string, unknown>>(
    endpoint: string,
    data: D,
    options: RequestInit = {}
  ) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};
