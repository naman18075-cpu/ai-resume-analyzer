import api from "./api";

export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  return data;
}


export async function getProfile() {
  const { data } = await api.get("/auth/me");
  return data;
}
