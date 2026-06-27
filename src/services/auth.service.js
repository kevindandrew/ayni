import api from "./api";

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  refresh: (refresh_token) => api.post("/auth/refresh", { refresh_token }),
};
