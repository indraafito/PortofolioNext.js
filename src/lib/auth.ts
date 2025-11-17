const AUTH_TOKEN_KEY = "authToken";
const AUTH_EVENT = "auth-changed";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const onAuthChange = (callback: (token: string | null) => void) => {
  const handler = () => callback(getAuthToken());
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);
  handler();
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};


