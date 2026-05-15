import api from "./api";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/uploads/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function uploadJobDescription({ title, companyName, text, file }) {
  const formData = new FormData();
  formData.append("title", title);
  if (companyName) {
    formData.append("company_name", companyName);
  }
  if (text) {
    formData.append("text", text);
  }
  if (file) {
    formData.append("file", file);
  }

  const { data } = await api.post("/uploads/job-description", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function createAnalysis(payload) {
  const { data } = await api.post("/analyses", payload);
  return data;
}

export async function listAnalyses() {
  const { data } = await api.get("/analyses");
  return data;
}

export async function getAnalysis(id) {
  const { data } = await api.get(`/analyses/${id}`);
  return data;
}

export async function exportAnalysisPdf(id) {
  const response = await api.get(`/analyses/${id}/export`, { responseType: "blob" });
  return response.data;
}
