import { apiRequest } from "./api";

export async function getOfferings(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") params.set(key, value);
  });
  return apiRequest(`/offerings${params.size ? `?${params}` : ""}`);
}

export async function requestAdmission(offeringId, studentMessage = "") {
  return apiRequest("/admissions/request", {
    method: "POST",
    body: JSON.stringify({ offeringId, studentMessage }),
  });
}

export async function getMyAdmissions(status) {
  return apiRequest(`/admissions/my-admissions${status ? `?status=${status}` : ""}`);
}
