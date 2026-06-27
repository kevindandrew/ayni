import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicacionesService } from "../services/publicaciones.service";
import { useAuth } from "../context/AuthContext";
import { TIPO_PUBLICACION } from "../constants/types";
import { NewspaperIcon } from "../components/ui/Icons";

const TIPOS = [
  { value: TIPO_PUBLICACION.EVENTO,       label: "Evento" },
  { value: TIPO_PUBLICACION.CAMPANA,      label: "Campaña" },
  { value: TIPO_PUBLICACION.ADOPCION,     label: "Adopción" },
  { value: TIPO_PUBLICACION.VOLUNTARIADO, label: "Voluntariado" },
];

export default function NuevaPublicacionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tipo_publicacion: TIPO_PUBLICACION.EVENTO,
    titulo: "",
    contenido: "",
    fecha_evento: "",
    lugar_evento: "",
    cupos_disponibles: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("El título y el contenido son obligatorios.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const body = {
        entidad_id: user?.entidad_id ?? user?.id,
        tipo_publicacion: form.tipo_publicacion,
        titulo: form.titulo,
        contenido: form.contenido,
      };
      if (form.fecha_evento)      body.fecha_evento = form.fecha_evento;
      if (form.lugar_evento)      body.lugar_evento = form.lugar_evento;
      if (form.cupos_disponibles) body.cupos_disponibles = parseInt(form.cupos_disponibles, 10);

      await publicacionesService.create(body);
      navigate("/publicaciones");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(Array.isArray(msg) ? msg.map((e) => e.msg).join(", ") : msg || "Error al crear la publicación.");
    } finally {
      setLoading(false);
    }
  }

  const isEvento = form.tipo_publicacion === TIPO_PUBLICACION.EVENTO;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
          <NewspaperIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h1 className="text-xl font-bold text-cafe-900">Nueva publicación</h1>
      </div>

      <div className="bg-white rounded-2xl border border-cafe-100 p-6 space-y-5">
        {/* Tipo */}
        <div>
          <label className="block text-xs font-semibold text-cafe-700 mb-2 uppercase tracking-wide">Tipo</label>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("tipo_publicacion", value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                  form.tipo_publicacion === value
                    ? "border-cafe-900 bg-cafe-900 text-white"
                    : "border-cafe-200 text-cafe-700 hover:border-cafe-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Título *</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            placeholder="Título de la publicación"
            className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
          />
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Contenido *</label>
          <textarea
            value={form.contenido}
            onChange={(e) => set("contenido", e.target.value)}
            rows={4}
            placeholder="Describe tu publicación en detalle..."
            className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition resize-none"
          />
        </div>

        {isEvento && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Fecha del evento</label>
              <input
                type="datetime-local"
                value={form.fecha_evento}
                onChange={(e) => set("fecha_evento", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Lugar</label>
              <input
                type="text"
                value={form.lugar_evento}
                onChange={(e) => set("lugar_evento", e.target.value)}
                placeholder="Ej: Parque Central"
                className="w-full px-3 py-2.5 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 border border-cafe-200 text-cafe-700 text-sm font-medium rounded-xl hover:bg-cafe-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-cafe-900 text-white text-sm font-semibold rounded-xl hover:bg-cafe-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
