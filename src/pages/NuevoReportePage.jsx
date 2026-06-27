import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportesService } from "../services/reportes.service";
import { TIPO_REPORTE, TIPO_REPORTE_LABEL } from "../constants/types";
import { PlusIcon } from "../components/ui/Icons";

const TIPOS = Object.entries(TIPO_REPORTE_LABEL);

export default function NuevoReportePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tipo_reporte: TIPO_REPORTE.PERSONA,
    titulo: "",
    descripcion: "",
    nombre_desaparecido: "",
    edad: "",
    ultima_ubicacion: "",
    fecha_desaparicion: "",
    raza_especie: "",
    color_descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const body = { ...form };
      if (body.edad) body.edad = parseInt(body.edad, 10);
      else delete body.edad;
      if (!body.nombre_desaparecido) delete body.nombre_desaparecido;
      if (!body.ultima_ubicacion) delete body.ultima_ubicacion;
      if (!body.fecha_desaparicion) delete body.fecha_desaparicion;
      if (!body.raza_especie) delete body.raza_especie;
      if (!body.color_descripcion) delete body.color_descripcion;

      await reportesService.create(body);
      navigate("/mis-reportes");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(Array.isArray(msg) ? msg.map((e) => e.msg).join(", ") : msg || "Error al crear el reporte.");
    } finally {
      setLoading(false);
    }
  }

  const isPersona = form.tipo_reporte === TIPO_REPORTE.PERSONA;
  const isAnimal  = form.tipo_reporte === TIPO_REPORTE.ANIMAL;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-cafe-900 rounded-xl flex items-center justify-center">
          <PlusIcon className="w-5 h-5 text-gold-400" />
        </div>
        <h1 className="text-xl font-bold text-cafe-900">Nuevo reporte</h1>
      </div>

      <div className="bg-white rounded-2xl border border-cafe-100 p-6 space-y-5">
        {/* Tipo */}
        <div>
          <label className="block text-xs font-semibold text-cafe-700 mb-2 uppercase tracking-wide">Tipo de reporte</label>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => set("tipo_reporte", value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors text-left ${
                  form.tipo_reporte === value
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
            placeholder="Ej: Se busca a Juan Pérez"
            className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Descripción *</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            rows={3}
            placeholder="Describe la situación con el mayor detalle posible..."
            className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition resize-none"
          />
        </div>

        {/* Persona/Animal fields */}
        {(isPersona || isAnimal) && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">
                {isPersona ? "Nombre completo" : "Nombre / Especie"}
              </label>
              <input
                type="text"
                value={form.nombre_desaparecido}
                onChange={(e) => set("nombre_desaparecido", e.target.value)}
                placeholder={isPersona ? "Nombre y apellido" : "Ej: Labrador dorado"}
                className="w-full px-3 py-2.5 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Edad</label>
              <input
                type="number"
                value={form.edad}
                onChange={(e) => set("edad", e.target.value)}
                placeholder="Años"
                min={0}
                className="w-full px-3 py-2.5 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
              />
            </div>
          </div>
        )}

        {isAnimal && (
          <div>
            <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Color / Descripción física</label>
            <input
              type="text"
              value={form.color_descripcion}
              onChange={(e) => set("color_descripcion", e.target.value)}
              placeholder="Ej: Pelo dorado, collar rojo"
              className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
            />
          </div>
        )}

        {/* Ubicación */}
        <div>
          <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Última ubicación conocida</label>
          <input
            type="text"
            value={form.ultima_ubicacion}
            onChange={(e) => set("ultima_ubicacion", e.target.value)}
            placeholder="Ej: Av. Libertad 123, La Paz"
            className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
          />
        </div>

        {(isPersona || isAnimal) && (
          <div>
            <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">Fecha de desaparición</label>
            <input
              type="datetime-local"
              value={form.fecha_desaparicion}
              onChange={(e) => set("fecha_desaparicion", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
            />
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
            {loading ? "Enviando..." : "Publicar reporte"}
          </button>
        </div>
      </div>
    </div>
  );
}
