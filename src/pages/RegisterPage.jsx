import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchIcon, EyeIcon, EyeOffIcon } from "../components/ui/Icons";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";

export default function RegisterPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", password: "", confirm: "", telefono: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) navigate("/dashboard", { replace: true });
  }, [user, ready, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-cafe-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (user) return null;

  function field(key) {
    return (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setError("");
    };
  }

  async function handleRegister() {
    const { nombre, apellido, email, password, confirm, telefono } = form;
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const body = {
        nombre:   nombre.trim(),
        apellido: apellido.trim(),
        email:    email.trim(),
        password,
        ...(telefono.trim() ? { telefono: telefono.trim() } : {}),
      };
      await api.post("/auth/register", body);
      navigate("/", { state: { registered: true } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((e) => e.msg || String(e)).join(". "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(err.message || "Error al crear la cuenta. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 placeholder-cafe-300 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 focus:border-transparent transition";
  const labelCls =
    "block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide";

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
          <h2 className="text-xl font-bold text-cafe-900 mb-1">Crear cuenta</h2>
          <p className="text-cafe-500 text-sm mb-6">Únete a la comunidad AyniSearch</p>

          <div className="space-y-4">
            {/* Nombre y apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  Nombre <span className="text-red-400 normal-case font-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={field("nombre")}
                  placeholder="Juan"
                  className={inputCls.replace("px-4", "px-3")}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Apellido <span className="text-red-400 normal-case font-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.apellido}
                  onChange={field("apellido")}
                  placeholder="Pérez"
                  className={inputCls.replace("px-4", "px-3")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>
                Correo electrónico <span className="text-red-400 normal-case font-normal">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={field("email")}
                placeholder="tu@correo.com"
                autoComplete="email"
                className={inputCls}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className={labelCls}>
                Teléfono{" "}
                <span className="text-cafe-400 font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={field("telefono")}
                placeholder="+51 999 999 999"
                className={inputCls}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className={labelCls}>
                Contraseña <span className="text-red-400 normal-case font-normal">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={field("password")}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className={inputCls + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-400 hover:text-cafe-700 transition-colors"
                >
                  {showPass
                    ? <EyeOffIcon className="w-5 h-5" />
                    : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className={labelCls}>
                Confirmar contraseña <span className="text-red-400 normal-case font-normal">*</span>
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={form.confirm}
                onChange={field("confirm")}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                className={inputCls}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-cafe-900 hover:bg-cafe-800 active:bg-cafe-950 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>

          <p className="text-center text-xs text-cafe-400 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="text-cafe-700 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-cafe-400">
        Plataforma de búsqueda solidaria · Ayni &copy; 2026
      </p>
    </div>
  );
}
