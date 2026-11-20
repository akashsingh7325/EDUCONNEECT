const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ACCESS_KEY = "educonnectAccessToken";
const REFRESH_KEY = "educonnectRefreshToken";
let refreshPromise = null;

export class ApiError extends Error {
  constructor(message, status, code, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("educonnectProfile");
  window.dispatchEvent(new Event("educonnect-session-expired"));
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) throw new ApiError("Session expired. Please log in again.", 401, "NO_REFRESH_TOKEN");

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        clearSession();
        throw new ApiError(body?.error?.message || "Session expired. Please log in again.", response.status, body?.error?.code, body);
      }

      localStorage.setItem(ACCESS_KEY, body.data.accessToken);
      localStorage.setItem(REFRESH_KEY, body.data.refreshToken);
      return body.data.accessToken;
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const execute = async (retryAfterRefresh) => {
    const token = localStorage.getItem(ACCESS_KEY);
    const headers = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const errorCode = body?.error?.code;
      if (response.status === 401 && retryAfterRefresh && localStorage.getItem(REFRESH_KEY)) {
        await refreshAccessToken();
        return execute(false);
      }
      if ((response.status === 401 || errorCode === "TOKEN_EXPIRED")
        && (localStorage.getItem(ACCESS_KEY) || localStorage.getItem(REFRESH_KEY))) {
        clearSession();
      }
      throw new ApiError(body?.error?.message || `Request failed (${response.status})`, response.status, errorCode, body);
    }
    return body;
  };

  return execute(true);
}

export function getApiUrl() {
  return API_URL;
}
