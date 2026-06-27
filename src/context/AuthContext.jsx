import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `ready` = true cuando ya sabemos si hay sesión o no
  const [ready, setReady] = useState(false);

  // Restaurar sesión al montar
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const invalid = !token || token === "undefined" || token === "null";
    if (invalid) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setReady(true);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setUser(r.data?.data ?? r.data))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setReady(true));
  }, []);

  // Escuchar cuando el interceptor detecta sesión expirada
  useEffect(() => {
    const handle = () => setUser(null);
    window.addEventListener("auth:expired", handle);
    return () => window.removeEventListener("auth:expired", handle);
  }, []);

  // login() lanza error si falla — el componente maneja el mensaje
  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });

    // La API devuelve { success, data: { access_token, refresh_token }, message }
    // Los tokens están anidados en data.data
    const tokenData = data.data ?? data;
    const token = tokenData.access_token || tokenData.token;
    if (!token) {
      throw new Error("El servidor no devolvió un token válido");
    }

    localStorage.setItem("access_token", token);
    if (tokenData.refresh_token) {
      localStorage.setItem("refresh_token", tokenData.refresh_token);
    }

    const me = await api.get("/auth/me");
    setUser(me.data?.data ?? me.data);
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
