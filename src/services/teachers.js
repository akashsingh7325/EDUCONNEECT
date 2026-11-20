import { apiRequest } from "./api";

export async function getTeachers(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") params.set(key, value);
  });
  return apiRequest(`/teachers${params.size ? `?${params}` : ""}`);
}

export async function getNearbyTeachers(latitude, longitude, radiusKm = 25, subject) {
  const params = new URLSearchParams({ latitude, longitude, radiusKm });
  if (subject && subject !== "All") params.set("subject", subject);
  return apiRequest(`/teachers/nearby?${params}`);
}

export async function getTeacherProfile(id) {
  return apiRequest(`/teachers/${id}`);
}
