import { useAuth } from "../context/AuthContext";
import { usuariosService } from "../services/usuarios.service";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { CoinIcon, InboxIcon, StarIcon } from "../components/ui/Icons";

export default function PuntosPage() {
  const { user } = useAuth();
  const { data, total, loading, error } = useApiList(
    () => usuariosService.puntos(user.id, { limit: 50 }),
    [user?.id]
  );

  const totalPts = user?.puntos ?? data.reduce((s, t) => s + (t.puntos ?? 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gold-300/30 rounded-xl flex items-center justify-center">
          <CoinIcon className="w-5 h-5 text-gold-500" />
        </div>
        <h1 className="text-xl font-bold text-cafe-900">Mis puntos</h1>
      </div>

      {/* Balance card */}
      <div className="bg-linear-to-r from-cafe-900 to-cafe-700 rounded-2xl p-6 text-white">
        <p className="text-cafe-300 text-sm mb-1">Puntos disponibles</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold">{totalPts ?? 0}</span>
          <span className="text-gold-400 font-semibold mb-1">pts</span>
        </div>
        <p className="text-cafe-400 text-xs mt-3">
          <StarIcon className="inline w-3.5 h-3.5 mr-1 text-gold-400" />
          Gana puntos reportando y colaborando
        </p>
      </div>

      <h2 className="font-semibold text-cafe-900">Historial</h2>

      {loading && <div className="flex justify-center py-10"><Spinner /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-2 text-sm">Sin movimientos de puntos aún.</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="space-y-2">
          {data.map((t, i) => (
            <div key={t.id ?? i} className="bg-white rounded-xl border border-cafe-100 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cafe-900">{t.descripcion ?? t.concepto ?? "Movimiento"}</p>
                {t.creado_en && (
                  <p className="text-xs text-cafe-400 mt-0.5">
                    {new Date(t.creado_en).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              <span className={`font-semibold text-sm ${(t.puntos ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {(t.puntos ?? 0) >= 0 ? "+" : ""}{t.puntos ?? 0} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
