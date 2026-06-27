import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2" />

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-950 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-950">
              Ayni<span className="text-amber-500">Search</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Plataforma de búsqueda de personas y mascotas
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-xs text-blue-700 space-y-1">
            <p className="font-semibold mb-1">Cuentas de demostración:</p>
            <p>👤 <span className="font-mono">admin@ayni.com</span> / admin123</p>
            <p>🙋 <span className="font-mono">ciudadano@ayni.com</span> / user123</p>
            <p>🤝 <span className="font-mono">voluntario@ayni.com</span> / vol123</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            ¿Necesitas ayuda? Escríbenos a{" "}
            <span className="text-blue-600">ayuda@ayni.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
