import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { reportesService } from "../services/reportes.service";
import { useApiList } from "../hooks/useApiList";
import ReporteCard from "../components/ui/ReporteCard";
import FilterChip from "../components/ui/FilterChip";
import Spinner from "../components/ui/Spinner";
import { ClipboardIcon, InboxIcon } from "../components/ui/Icons";
import { TIPO_REPORTE } from "../constants/types";

const FILTROS = [
  { label: "Todos",          value: null },
  { label: "Personas",       value: TIPO_REPORTE.PERSONA },
  { label: "Animales",       value: TIPO_REPORTE.ANIMAL },
  { label: "Accidentes",     value: TIPO_REPORTE.ACCIDENTE },
  { label: "Vulnerabilidad", value: TIPO_REPORTE.VULNERABILIDAD },
];

export default function ReportesPage() {
  const { search = "" } = useOutletContext() ?? {};
  const [tipo, setTipo] = useState(null);

  const { data, total, loading, error } = useApiList(
    () => reportesService.list({ tipo, limit: 50 }),
    [tipo]
  );

  const filtered = data.filter((r) =>
    !search ||
    r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    r.nombre_desaparecido?.toLowerCase().includes(search.toLowerCase()) ||
    r.ultima_ubicacion?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-cafe-900 rounded-xl flex items-center justify-center">
          <ClipboardIcon className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cafe-900">Todos los reportes</h1>
          <p className="text-xs text-cafe-500">{total} reportes en total</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTROS.map((f) => (
          <FilterChip
            key={f.label}
            label={f.label}
            active={tipo === f.value}
            onClick={() => setTipo(f.value)}
          />
        ))}
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
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
