import { useOutletContext } from "react-router-dom";
import { entidadesService } from "../services/entidades.service";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { BuildingIcon, InboxIcon } from "../components/ui/Icons";

export default function EntidadesPage() {
  const { search = "" } = useOutletContext() ?? {};
  const { data, total, loading, error } = useApiList(
    () => entidadesService.list({ limit: 100 }),
    []
  );

  const filtered = data.filter((e) =>
    !search ||
    e.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    e.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
          <BuildingIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cafe-900">Entidades</h1>
          <p className="text-xs text-cafe-500">{total} entidades registradas</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-2 text-sm">No hay entidades registradas.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-cafe-100 p-4 hover:border-cafe-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <BuildingIcon className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-cafe-900 text-sm truncate">{e.nombre ?? "Sin nombre"}</h3>
                  {e.tipo && <p className="text-xs text-cafe-500 mt-0.5">{e.tipo}</p>}
                  {e.email && <p className="text-xs text-cafe-400 mt-1 truncate">{e.email}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
