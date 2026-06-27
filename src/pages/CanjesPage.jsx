import { useApiList } from "../hooks/useApiList";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";
import { CoinIcon, InboxIcon } from "../components/ui/Icons";

export default function CanjesPage() {
  const { data, total, loading, error } = useApiList(
    () => api.get("/canjes", { params: { limit: 50 } }),
    []
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-cafe-100 rounded-xl flex items-center justify-center">
          <CoinIcon className="w-5 h-5 text-cafe-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cafe-900">Canjes</h1>
          <p className="text-xs text-cafe-500">{total} canjes registrados</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-2 text-sm">No hay canjes registrados.</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="bg-white rounded-2xl border border-cafe-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cafe-50 border-b border-cafe-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Recompensa</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Puntos</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cafe-50">
                {data.map((c) => (
                  <tr key={c.id} className="hover:bg-cafe-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-cafe-900">{c.recompensa?.nombre ?? c.recompensa_id}</td>
                    <td className="px-4 py-3 text-cafe-500">{c.usuario?.nombre ?? c.usuario_id}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-gold-500 font-semibold">
                        <CoinIcon className="w-3.5 h-3.5" />
                        {c.puntos_gastados ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cafe-400 text-xs">
                      {c.creado_en ? new Date(c.creado_en).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
