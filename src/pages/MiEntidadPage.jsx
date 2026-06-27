import { useAuth } from "../context/AuthContext";
import { entidadesService } from "../services/entidades.service";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { BuildingIcon } from "../components/ui/Icons";

export default function MiEntidadPage() {
  const { user } = useAuth();
  const { data, loading, error } = useApiList(
    () => entidadesService.get(user?.entidad_id ?? user?.id),
    [user?.entidad_id]
  );

  const entidad = Array.isArray(data) ? data[0] : data;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
          <BuildingIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold text-cafe-900">Mi entidad</h1>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && entidad && (
        <div className="bg-white rounded-2xl border border-cafe-100 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <BuildingIcon className="w-7 h-7 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-cafe-900">{entidad.nombre}</h2>
              {entidad.tipo && <p className="text-sm text-cafe-500">{entidad.tipo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Correo",    value: entidad.email },
              { label: "Teléfono",  value: entidad.telefono },
              { label: "Dirección", value: entidad.direccion },
              { label: "Ciudad",    value: entidad.ciudad },
            ].filter((f) => f.value).map(({ label, value }) => (
              <div key={label} className="bg-cafe-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-cafe-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-cafe-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {entidad.descripcion && (
            <div>
              <p className="text-xs font-semibold text-cafe-500 uppercase tracking-wide mb-1">Descripción</p>
              <p className="text-sm text-cafe-700">{entidad.descripcion}</p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !entidad && (
        <div className="text-center py-16 bg-white rounded-2xl border border-cafe-100">
          <BuildingIcon className="w-12 h-12 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-3 text-sm">No se encontró información de tu entidad.</p>
        </div>
      )}
    </div>
  );
}
