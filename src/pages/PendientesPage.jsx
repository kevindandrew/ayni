import { useOutletContext } from "react-router-dom";
import { reportesService } from "../services/reportes.service";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { ClockIcon, InboxIcon, CheckCircleIcon } from "../components/ui/Icons";
import { TIPO_REPORTE_LABEL, ESTADO_LABEL } from "../constants/types";

function Badge({ children, color }) {
  const colors = {
    amber:  "bg-amber-100 text-amber-700",
    blue:   "bg-blue-100 text-blue-700",
    green:  "bg-emerald-100 text-emerald-700",
    gray:   "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  );
}

export default function PendientesPage() {
  const { search = "" } = useOutletContext() ?? {};
  const { data, total, loading, error } = useApiList(
    () => reportesService.listPendientes({ limit: 50 }),
    []
  );

  const filtered = data.filter((r) =>
    !search ||
    r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    r.nombre_desaparecido?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cafe-900">Pendientes de validar</h1>
            <p className="text-xs text-cafe-500">{total} reportes esperando revisión</p>
          </div>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <CheckCircleIcon className="w-12 h-12 text-emerald-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">No hay reportes pendientes.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-cafe-100 p-4 flex items-start gap-4 hover:border-cafe-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cafe-100 flex items-center justify-center shrink-0">
                <ClockIcon className="w-5 h-5 text-cafe-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-cafe-900 text-sm">{r.titulo}</h3>
                  <Badge color="amber">{TIPO_REPORTE_LABEL[r.tipo_reporte] ?? r.tipo_reporte}</Badge>
                </div>
                {r.nombre_desaparecido && (
                  <p className="text-xs text-cafe-500">{r.nombre_desaparecido}</p>
                )}
                {r.ultima_ubicacion && (
                  <p className="text-xs text-cafe-400 mt-0.5">{r.ultima_ubicacion}</p>
                )}
              </div>
              <button className="shrink-0 px-3 py-1.5 bg-cafe-900 text-white text-xs font-medium rounded-lg hover:bg-cafe-800 transition-colors">
                Validar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
