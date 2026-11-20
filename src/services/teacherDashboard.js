import { apiRequest } from "./api";
export const getTeacherOfferings = () => apiRequest("/teachers/my/offerings");
export const getTeacherAdmissions = (status) => apiRequest(`/admissions/teacher${status ? `?status=${status}` : ""}`);
export const updateAdmissionStatus = (id, status, teacherNotes) => apiRequest(`/admissions/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, teacherNotes }) });
export const updateTeacherProfile = (profile) => apiRequest("/teachers/profile", { method: "PUT", body: JSON.stringify(profile) });
export const createTeacherOffering = (offering) => apiRequest("/teachers/offerings", { method: "POST", body: JSON.stringify(offering) });