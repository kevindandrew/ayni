import { useNavigate } from "react-router-dom";
import { publicacionesService } from "../services/publicaciones.service";
import { useAuth } from "../context/AuthContext";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { NewspaperIcon, PlusIcon, InboxIcon } from "../components/ui/Icons";

const TIPO_COLOR = {
  evento:       "bg-blue-100 text-blue-700",
  campana:      "bg-amber-100 text-amber-700",
  adopcion:     "bg-green-100 text-green-700",
  voluntariado: "bg-purple-100 text-purple-700",
};
const TIPO_LABEL = {
  evento: "Evento", campana: "Campaña", adopcion: "Adopción", voluntariado: "Voluntariado",
};

export default function PublicacionesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, total, loading, error } = useApiList(
    () => publicacionesService.list({ entidad_id: user?.entidad_id, limit: 50 }),
    [user?.entidad_id]
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
            <NewspaperIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cafe-900">Mis publicaciones</h1>
            <p className="text-xs text-cafe-500">{total} publicaciones</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/publicaciones/nueva")}
          className="flex items-center gap-2 px-4 py-2 bg-cafe-900 text-white text-sm font-medium rounded-xl hover:bg-cafe-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Nueva
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-12 h-12 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">Aún no tienes publicaciones.</p>
          <button
            onClick={() => navigate("/publicaciones/nueva")}
            className="mt-4 px-5 py-2 bg-cafe-900 text-white text-sm font-medium rounded-xl hover:bg-cafe-800 transition-colors"
          >
            Crear primera publicación
          </button>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="space-y-3">
          {data.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-cafe-100 p-4 hover:border-cafe-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_COLOR[p.tipo_publicacion] ?? "bg-gray-100 text-gray-600"}`}>
                      {TIPO_LABEL[p.tipo_publicacion] ?? p.tipo_publicacion}
                    </span>
                  </div>
                  <h3 className="font-semibold text-cafe-900">{p.titulo}</h3>
                  <p className="text-sm text-cafe-500 mt-1 line-clamp-2">{p.contenido}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-1 rounded-lg font-medium ${p.activo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
