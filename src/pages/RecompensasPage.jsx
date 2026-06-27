import { useOutletContext } from "react-router-dom";
import { useApiList } from "../hooks/useApiList";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";
import { GiftIcon, InboxIcon, CoinIcon } from "../components/ui/Icons";

export default function RecompensasPage() {
  const { search = "" } = useOutletContext() ?? {};
  const { data, total, loading, error } = useApiList(
    () => api.get("/recompensas", { params: { limit: 50 } }),
    []
  );

  const filtered = data.filter((r) =>
    !search || r.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gold-300/30 rounded-xl flex items-center justify-center">
          <GiftIcon className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cafe-900">Recompensas</h1>
          <p className="text-xs text-cafe-500">{total} recompensas disponibles</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-2 text-sm">No hay recompensas disponibles.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-cafe-100 p-4 hover:border-gold-300 transition-colors">
              {r.imagen_url && (
                <img src={r.imagen_url} alt={r.nombre} className="w-full h-28 object-cover rounded-xl mb-3" />
              )}
              {!r.imagen_url && (
                <div className="w-full h-20 bg-gold-300/20 rounded-xl flex items-center justify-center mb-3">
                  <GiftIcon className="w-8 h-8 text-gold-400" />
                </div>
              )}
              <h3 className="font-semibold text-cafe-900 text-sm">{r.nombre}</h3>
              {r.descripcion && <p className="text-xs text-cafe-500 mt-1 line-clamp-2">{r.descripcion}</p>}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gold-500 font-semibold text-sm">
                  <CoinIcon className="w-4 h-4" />
                  {r.costo_puntos} pts
                </div>
                {r.stock !== -1 && (
                  <span className="text-xs text-cafe-400">{r.stock} disponibles</span>
                )}
                <button className="px-3 py-1.5 bg-cafe-900 text-white text-xs font-medium rounded-lg hover:bg-cafe-800 transition-colors">
                  Canjear
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
