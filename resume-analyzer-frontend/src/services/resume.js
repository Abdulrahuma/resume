import API from "./api";

export const getMyResumes = () => API.get("/resume/my");

export const deleteResume = (id) =>
  API.delete(`/resume/${id}`);
