import { getAuthToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { auth = false, headers, body, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (body && !finalHeaders.has("Content-Type") && !(body instanceof FormData)) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body && !(body instanceof FormData) && typeof body !== "string" ? JSON.stringify(body) : body,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiGet = <T>(path: string, options?: FetchOptions) => request<T>(path, { ...options, method: "GET" });
export const apiPost = <T>(path: string, body?: unknown, options?: FetchOptions) =>
  request<T>(path, { ...options, method: "POST", body });
export const apiPut = <T>(path: string, body?: unknown, options?: FetchOptions) =>
  request<T>(path, { ...options, method: "PUT", body });
export const apiPatch = <T>(path: string, body?: unknown, options?: FetchOptions) =>
  request<T>(path, { ...options, method: "PATCH", body });
export const apiDelete = <T>(path: string, options?: FetchOptions) =>
  request<T>(path, { ...options, method: "DELETE" });


