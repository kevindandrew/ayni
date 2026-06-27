import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usuariosService } from "../services/usuarios.service";
import { useApiList } from "../hooks/useApiList";
import ReporteCard from "../components/ui/ReporteCard";
import Spinner from "../components/ui/Spinner";
import { PencilIcon, PlusIcon, InboxIcon } from "../components/ui/Icons";

export default function MisReportesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, total, loading, error } = useApiList(
    () => usuariosService.reportes(user.id, { limit: 50 }),
    [user?.id]
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cafe-100 rounded-xl flex items-center justify-center">
            <PencilIcon className="w-5 h-5 text-cafe-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cafe-900">Mis reportes</h1>
            <p className="text-xs text-cafe-500">{total} reportes creados</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/reportes/nuevo")}
          className="flex items-center gap-2 px-4 py-2 bg-cafe-900 text-white text-sm font-medium rounded-xl hover:bg-cafe-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-12 h-12 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">Aún no has creado reportes.</p>
          <button
            onClick={() => navigate("/reportes/nuevo")}
            className="mt-4 px-5 py-2 bg-cafe-900 text-white text-sm font-medium rounded-xl hover:bg-cafe-800 transition-colors"
          >
            Crear mi primer reporte
          </button>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((r) => <ReporteCard key={r.id} reporte={r} />)}
        </div>
      )}
    </div>
  );
}
