import { useApiList } from "../hooks/useApiList";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";
import { IdCardIcon, InboxIcon, CheckCircleIcon } from "../components/ui/Icons";

export default function VerificacionesPage() {
  const { data, total, loading, error } = useApiList(
    () => api.get("/verificaciones", { params: { limit: 50 } }),
    []
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
          <IdCardIcon className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cafe-900">Verificaciones</h1>
          <p className="text-xs text-cafe-500">{total} verificaciones pendientes</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <CheckCircleIcon className="w-12 h-12 text-emerald-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">No hay verificaciones pendientes.</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="space-y-2">
          {data.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-cafe-100 p-4 flex items-center gap-4 hover:border-cafe-300 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <IdCardIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-cafe-900 text-sm">{v.nombre ?? v.id}</p>
                <p className="text-xs text-cafe-400">{v.tipo ?? "Verificación"}</p>
              </div>
              <button className="shrink-0 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                Revisar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
