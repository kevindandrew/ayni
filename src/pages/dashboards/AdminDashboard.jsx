import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useReportes } from "../../hooks/useReportes";
import ReporteCard from "../../components/ui/ReporteCard";
import FilterChip from "../../components/ui/FilterChip";
import Spinner from "../../components/ui/Spinner";
import { ClipboardIcon, BellIcon, CheckCircleIcon, InboxIcon } from "../../components/ui/Icons";
import { TIPO_REPORTE } from "../../constants/types";

const FILTERS = [
  { label: "Todos",          value: null },
  { label: "Personas",       value: TIPO_REPORTE.PERSONA },
  { label: "Animales",       value: TIPO_REPORTE.ANIMAL },
  { label: "Accidentes",     value: TIPO_REPORTE.ACCIDENTE },
  { label: "Vulnerabilidad", value: TIPO_REPORTE.VULNERABILIDAD },
];

function StatCard({ Icon, label, value, iconClass }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-cafe-100">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-cafe-500">{label}</p>
        <p className="text-xl font-bold text-cafe-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { search = "" } = useOutletContext() ?? {};
  const [tipo, setTipo] = useState(null);
  const { data, total, loading, error } = useReportes({ tipo });

  const activos     = data.filter((r) => r.estado_resolucion === "activo").length;
  const encontrados = data.filter((r) => r.estado_resolucion === "encontrado").length;

  const filtered = data.filter((r) =>
    search === "" ||
    r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    r.nombre_desaparecido?.toLowerCase().includes(search.toLowerCase()) ||
    r.ultima_ubicacion?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <StatCard Icon={ClipboardIcon} label="Total reportes" value={total}      iconClass="bg-cafe-100 text-cafe-700" />
        <StatCard Icon={BellIcon}      label="Activos"         value={activos}    iconClass="bg-amber-50 text-amber-600" />
        <StatCard Icon={CheckCircleIcon} label="Encontrados"  value={encontrados} iconClass="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <FilterChip key={f.label} label={f.label} active={tipo === f.value} onClick={() => setTipo(f.value)} />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-cafe-900">
          {tipo ? FILTERS.find((f) => f.value === tipo)?.label : "Todos los reportes"}
        </h2>
        {!loading && <span className="text-xs text-cafe-400">{filtered.length} resultados</span>}
      </div>

      {/* Content */}
      {loading && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-12 h-12 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">
            {search ? `Sin resultados para "${search}"` : "No hay reportes aún."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((r) => <ReporteCard key={r.id} reporte={r} />)}
        </div>
      )}
    </div>
  );
}
