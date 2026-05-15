import api from "./api";

export async function getAdminOverview() {
  const { data } = await api.get("/admin/overview");
  return data;
}
