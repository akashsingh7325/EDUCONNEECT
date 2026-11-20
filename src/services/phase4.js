import { apiRequest } from "./api";

export const getCourses = (params = {}) => {
  const search = new URLSearchParams(params).toString();
  return apiRequest(`/courses${search ? `?${search}` : ""}`);
};
export const getMyCourseEnrollments = () => apiRequest("/courses/my-enrollments");
export const enrollInCourse = (courseId) => apiRequest(`/courses/${courseId}/enroll`, { method: "POST" });
export const cancelCourseEnrollment = (courseId) => apiRequest(`/courses/${courseId}/enroll`, { method: "DELETE" });

export const getMaterials = (params = {}) => {
  const search = new URLSearchParams(params).toString();
  return apiRequest(`/materials${search ? `?${search}` : ""}`);
};
export const getMyNotes = () => apiRequest("/materials/my-notes");
export const saveMaterialToHub = (materialId) => apiRequest(`/materials/${materialId}/save`, { method: "POST" });
export const removeMaterialFromHub = (materialId) => apiRequest(`/materials/${materialId}/save`, { method: "DELETE" });

export const getDpps = (params = {}) => {
  const search = new URLSearchParams(params).toString();
  return apiRequest(`/dpps${search ? `?${search}` : ""}`);
};
export const getDpp = (dppId) => apiRequest(`/dpps/${dppId}`);
export const startDppAttempt = (dppId) => apiRequest(`/dpps/${dppId}/attempts`, { method: "POST" });
export const submitDppAttempt = (attemptId, answers) => apiRequest(`/dpps/attempts/${attemptId}/submit`, { method: "POST", body: JSON.stringify({ answers }) });
export const getMyDppAttempts = () => apiRequest("/dpps/my-attempts");
