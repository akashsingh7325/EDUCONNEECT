import { apiRequest, clearSession } from "./api";

export async function login(email, password) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
  return storeSession(response.data);
}

export async function register(fullName, email, password) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password, role: "STUDENT" }),
  });
  return storeSession(response.data);
}

export function storeSession(data) {
  localStorage.setItem("educonnectAccessToken", data.accessToken);
  localStorage.setItem("educonnectRefreshToken", data.refreshToken);
  localStorage.setItem("educonnectProfile", JSON.stringify(data.user));
  localStorage.setItem("educonnectCurrentUser", JSON.stringify(data.user));
  localStorage.setItem("educonnectAccount", JSON.stringify(data.user));
  window.dispatchEvent(new Event("educonnect-profile-updated"));
  return data.user;
}

export async function getCurrentUser() {
  const response = await apiRequest("/auth/me");
  const user = response.data.user;
  localStorage.setItem("educonnectProfile", JSON.stringify(user));
  return user;
}

export async function logout() {
  const refreshToken = localStorage.getItem("educonnectRefreshToken");
  try {
    await apiRequest("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) });
  } catch {
    // Local cleanup still completes when the backend session is unavailable.
  } finally {
    clearSession();
  }
}
