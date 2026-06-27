import { useOutletContext } from "react-router-dom";
import { usuariosService } from "../services/usuarios.service";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { UsersIcon, InboxIcon } from "../components/ui/Icons";
import { ROLE_LABELS } from "../constants/roles";

const ROLE_COLORS = {
  administrador: "bg-purple-100 text-purple-700",
  entidad:       "bg-blue-100 text-blue-700",
  usuario:       "bg-cafe-100 text-cafe-700",
};

export default function UsuariosPage() {
  const { search = "" } = useOutletContext() ?? {};
  const { data, total, loading, error } = useApiList(
    () => usuariosService.list({ limit: 100 }),
    []
  );

  const filtered = data.filter((u) =>
    !search ||
    u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    u.apellido?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
          <UsersIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cafe-900">Usuarios</h1>
          <p className="text-xs text-cafe-500">{total} usuarios registrados</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
      {error && <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-cafe-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
              <p className="text-cafe-500 mt-2 text-sm">No se encontraron usuarios.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cafe-50 border-b border-cafe-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Usuario</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Correo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Rol</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-cafe-500 uppercase tracking-wide">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-50">
                  {filtered.map((u) => {
                    const initials = `${u.nombre?.[0] ?? ""}${u.apellido?.[0] ?? ""}`.toUpperCase();
                    return (
                      <tr key={u.id} className="hover:bg-cafe-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold-400 text-cafe-900 flex items-center justify-center text-xs font-bold shrink-0">
                              {initials || "?"}
                            </div>
                            <span className="font-medium text-cafe-900">{u.nombre} {u.apellido}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-cafe-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.rol] ?? "bg-gray-100 text-gray-600"}`}>
                            {ROLE_LABELS[u.rol] ?? u.rol}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block w-2 h-2 rounded-full ${u.activo !== false ? "bg-emerald-400" : "bg-red-400"}`} />
                          <span className="ml-2 text-cafe-500 text-xs">{u.activo !== false ? "Activo" : "Inactivo"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
