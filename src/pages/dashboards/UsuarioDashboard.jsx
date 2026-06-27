import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useReportes } from "../../hooks/useReportes";
import ReporteCard from "../../components/ui/ReporteCard";
import FilterChip from "../../components/ui/FilterChip";
import Spinner from "../../components/ui/Spinner";
import { PlusIcon, InboxIcon, InfoIcon } from "../../components/ui/Icons";
import { TIPO_REPORTE } from "../../constants/types";

const FILTERS = [
  { label: "Todos",      value: null },
  { label: "Personas",   value: TIPO_REPORTE.PERSONA },
  { label: "Animales",   value: TIPO_REPORTE.ANIMAL },
  { label: "Accidentes", value: TIPO_REPORTE.ACCIDENTE },
];

export default function UsuarioDashboard() {
  const { user } = useAuth();
  const { search = "" } = useOutletContext() ?? {};
  const [tipo, setTipo] = useState(null);
  const { data, loading, error } = useReportes({ tipo });

  const filtered = data.filter((r) =>
    search === "" ||
    r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    r.nombre_desaparecido?.toLowerCase().includes(search.toLowerCase()) ||
    r.ultima_ubicacion?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Greeting banner */}
      <div className="bg-cafe-900 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center text-cafe-900 text-lg font-bold shrink-0">
          {`${user?.nombre?.[0] ?? ""}${user?.apellido?.[0] ?? ""}`.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-lg">Hola, {user?.nombre}</p>
          <p className="text-cafe-300 text-sm">¿Necesitas reportar un caso hoy?</p>
        </div>
        <button className="ml-auto bg-gold-500 hover:bg-gold-400 text-cafe-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" />
          Nuevo reporte
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <FilterChip key={f.label} label={f.label} active={tipo === f.value} onClick={() => setTipo(f.value)} />
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-cafe-900">Reportes recientes</h2>
        {!loading && <span className="text-xs text-cafe-400">{filtered.length} casos</span>}
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-12 h-12 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">
            {search ? `Sin resultados para "${search}"` : "Aún no hay reportes."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((r) => <ReporteCard key={r.id} reporte={r} />)}
        </div>
      )}

      {/* Info card */}
      <div className="bg-white border border-cafe-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <InfoIcon className="w-4 h-4 text-cafe-500" />
          <p className="font-semibold text-cafe-900 text-sm">¿Cómo funciona?</p>
        </div>
        <ul className="space-y-1 text-xs list-disc list-inside text-cafe-500">
          <li>Crea un reporte con los datos del desaparecido.</li>
          <li>La comunidad y voluntarios te ayudarán a encontrarlo.</li>
          <li>Ganas puntos por cada reporte validado que realices.</li>
        </ul>
      </div>
    </div>
  );
}
