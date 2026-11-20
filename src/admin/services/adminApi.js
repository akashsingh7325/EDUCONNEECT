import { apiRequest } from "../../services/api";

export const getAdminOverview = () => apiRequest("/admin/dashboard/overview");
export const getAdminUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/users${query ? `?${query}` : ""}`);
};
export const getAdminUser = (id) => apiRequest(`/admin/users/${id}`);
export const updateAdminUserStatus = (id, status, reason) => apiRequest(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, reason }) });
export const getAdminAdmissions = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/admissions${query ? `?${query}` : ""}`);
};
export const getAdminAuditLogs = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/audit-logs${query ? `?${query}` : ""}`);
};

export const getAdminCourses = (params = {}) => apiRequest(`/admin/courses?${new URLSearchParams(params)}`);
export const getAdminCourse = (id) => apiRequest(`/admin/courses/${id}`);
export const createAdminCourse = (data) => apiRequest("/admin/courses", { method: "POST", body: JSON.stringify(data) });
export const updateAdminCourse = (id, data) => apiRequest(`/admin/courses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const updateAdminCourseStatus = (id, status) => apiRequest(`/admin/courses/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const getAdminDpps = (params = {}) => apiRequest(`/admin/dpps?${new URLSearchParams(params)}`);
export const getAdminDpp = (id) => apiRequest(`/admin/dpps/${id}`);
export const createAdminDpp = (data) => apiRequest("/admin/dpps", { method: "POST", body: JSON.stringify(data) });
export const updateAdminDppStatus = (id, status) => apiRequest(`/admin/dpps/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const saveAdminDppQuestion = (dppId, question, questionId) => apiRequest(`/admin/dpps/${dppId}/questions${questionId ? `/${questionId}` : ""}`, { method: questionId ? "PUT" : "POST", body: JSON.stringify(question) });
export const deleteAdminDppQuestion = (dppId, questionId) => apiRequest(`/admin/dpps/${dppId}/questions/${questionId}`, { method: "DELETE" });
export const getAdminDppAttempts = (dppId, params = {}) => apiRequest(`/admin/dpps/${dppId}/attempts?${new URLSearchParams(params)}`);

export const getAdminMaterials = (params = {}) => apiRequest(`/admin/materials?${new URLSearchParams(params)}`);
export const moderateAdminMaterial = (id, status, reason) => apiRequest(`/admin/materials/${id}/moderate`, { method: "PATCH", body: JSON.stringify({ status, reason }) });
export const removeAdminMaterial = (id, reason) => apiRequest(`/admin/materials/${id}`, { method: "DELETE", body: JSON.stringify({ reason }) });

export const getAdminAnalytics = () => apiRequest("/admin/analytics");
export const getAdminPaymentStatus = () => apiRequest("/admin/payments/status");
export const getAdminRolesStatus = () => apiRequest("/admin/roles/status");
export const getAdminLibraryBooks = (params = {}) => apiRequest(`/admin/library/books?${new URLSearchParams(params)}`);
export const createAdminLibraryCategory = (data) => apiRequest("/admin/library/categories", { method: "POST", body: JSON.stringify(data) });
export const createAdminLibraryBook = (data) => apiRequest("/admin/library/books", { method: "POST", body: JSON.stringify(data) });
export const updateAdminLibraryBook = (id, data) => apiRequest(`/admin/library/books/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const archiveAdminLibraryBook = (id) => apiRequest(`/admin/library/books/${id}`, { method: "DELETE" });
