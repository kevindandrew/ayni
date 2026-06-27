import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/api"
    : "https://app-reportes-solidarios.onrender.com");

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token && refresh_token !== "undefined") {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token,
          });
          const newToken = data.access_token || data.token;
          if (newToken) {
            localStorage.setItem("access_token", newToken);
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
          }
        } catch {
          // refresh failed — fall through
        }
      }
      // Limpiar sesión y notificar la app sin recargar el browser
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(err);
  }
);

export default api;
