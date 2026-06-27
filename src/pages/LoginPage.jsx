import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchIcon, EyeIcon, EyeOffIcon } from "../components/ui/Icons";
import Spinner from "../components/ui/Spinner";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Redirigir al dashboard cuando el usuario se confirma (después del commit)
  useEffect(() => {
    if (ready && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, ready, navigate]);

  // Mientras se verifica la sesión existente
  if (!ready) {
    return (
      <div className="min-h-screen bg-cafe-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Ya tiene sesión — useEffect redirige, no mostrar nada mientras
  if (user) return null;

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // La redirección ocurre en el useEffect de arriba cuando user cambia
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((e) => e.msg || e.message || String(e)).join(". "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(err.message || "Correo o contraseña incorrectos");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cafe-100 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-10 h-10 bg-cafe-900 rounded-xl flex items-center justify-center">
            <SearchIcon className="w-5 h-5 text-gold-400" />
          </div>
          <span className="text-2xl font-bold text-cafe-900 tracking-tight">
            Ayni<span className="text-gold-500">Search</span>
          </span>
        </div>
        <p className="text-cafe-500 text-sm">Juntos los encontramos</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="h-1.5 bg-linear-to-r from-cafe-900 to-gold-500" />

        <div className="p-7">
          <h2 className="text-xl font-bold text-cafe-900 mb-1">Bienvenido</h2>
          <p className="text-cafe-500 text-sm mb-6">
            Ingresa a tu cuenta para continuar
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="tu@correo.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 placeholder-cafe-300 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 focus:border-transparent transition"
              />
            </div>

            {/* Contraseña con ojito */}
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 placeholder-cafe-300 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-400 hover:text-cafe-700 transition-colors"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass
                    ? <EyeOffIcon className="w-5 h-5" />
                    : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-cafe-900 hover:bg-cafe-800 active:bg-cafe-950 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>

          <p className="text-center text-xs text-cafe-400 mt-6">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="text-cafe-700 font-semibold hover:underline"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-cafe-400">
        Plataforma de búsqueda solidaria · Ayni &copy; 2026
      </p>
    </div>
  );
}
