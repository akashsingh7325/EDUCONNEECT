import { apiRequest } from "./api";

export const getLibraryBooks = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") params.set(key, value);
  });
  return apiRequest(`/library/books${params.size ? `?${params}` : ""}`);
};
export const getLibraryCategories = () => apiRequest("/library/categories");
export const getLibraryBook = (id) => apiRequest(`/library/books/${id}`);
export const getMyLibraryBooks = () => apiRequest("/library/my-books");
export const addLibraryBook = (id, kind = "ACQUIRED") => apiRequest(`/library/books/${id}/add`, { method: "POST", body: JSON.stringify({ kind }) });
export const removeLibraryBook = (id, kind) => apiRequest(`/library/my-books/${id}${kind ? `?kind=${kind}` : ""}`, { method: "DELETE" });
export const getLibraryReader = (id) => apiRequest(`/library/reader/${id}`);
export const updateLibraryProgress = (id, percent, currentPage) => apiRequest(`/library/progress/${id}`, { method: "PUT", body: JSON.stringify({ percent, currentPage }) });