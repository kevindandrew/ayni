import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usuariosService } from "../../services/usuarios.service";
import { useReportes } from "../../hooks/useReportes";
import { useApiList } from "../../hooks/useApiList";
import ReporteCard from "../../components/ui/ReporteCard";
import Spinner from "../../components/ui/Spinner";
import {
  PlusIcon, InboxIcon, InfoIcon, PencilIcon,
  CheckCircleIcon, CoinIcon, SearchIcon,
} from "../../components/ui/Icons";

function StatCard({ icon: Icon, label, value, bg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-cafe-100 px-4 py-3 flex items-center gap-3 flex-1 min-w-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-cafe-500 truncate">{label}</p>
        <p className="text-xl font-bold text-cafe-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function UsuarioDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mis reportes
  const { data: misReportes, total: totalMios, loading: loadingMios } = useApiList(
    () => usuariosService.reportes(user.id, { limit: 4 }),
    [user?.id]
  );

  // Reportes de la comunidad (recientes)
  const { data: comunidad, loading: loadingCom } = useReportes({ page: 1 });

  const encontrados = misReportes.filter(
    (r) => r.estado_resolucion === "encontrado"
  ).length;

  const initials = `${user?.nombre?.[0] ?? ""}${user?.apellido?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">

      {/* ── Banner de bienvenida ── */}
      <div className="bg-linear-to-r from-cafe-900 to-cafe-700 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center text-cafe-900 text-lg font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg truncate">Hola, {user?.nombre}</p>
          <p className="text-cafe-300 text-sm">¿Necesitas reportar un caso hoy?</p>
        </div>
        <button
          onClick={() => navigate("/reportes/nuevo")}
          className="ml-auto bg-gold-500 hover:bg-gold-400 active:bg-gold-300 text-cafe-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          Nuevo reporte
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="flex flex-wrap gap-3">
        <StatCard
          icon={PencilIcon}
          label="Mis reportes"
          value={totalMios}
          bg="bg-cafe-100"
          iconColor="text-cafe-700"
        />
        <StatCard
          icon={CheckCircleIcon}
          label="Encontrados"
          value={encontrados}
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          icon={CoinIcon}
          label="Mis puntos"
          value={user?.puntos ?? 0}
          bg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* ── Mis reportes recientes ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-cafe-900">Mis reportes recientes</h2>
          <button
            onClick={() => navigate("/mis-reportes")}
            className="text-xs text-cafe-500 hover:text-cafe-900 transition-colors"
          >
            Ver todos →
          </button>
        </div>

        {loadingMios && <div className="flex justify-center py-8"><Spinner /></div>}

        {!loadingMios && misReportes.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-cafe-100">
            <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
            <p className="text-cafe-500 mt-2 text-sm">Aún no has creado reportes.</p>
            <button
              onClick={() => navigate("/reportes/nuevo")}
              className="mt-3 px-4 py-2 bg-cafe-900 text-white text-xs font-medium rounded-xl hover:bg-cafe-800 transition-colors"
            >
              Crear mi primer reporte
            </button>
          </div>
        )}

        {!loadingMios && misReportes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {misReportes.map((r) => (
              <ReporteCard key={r.id} reporte={r} />
            ))}
          </div>
        )}
      </section>

      {/* ── Acciones rápidas ── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: PlusIcon,    label: "Nuevo reporte", desc: "Reporta un caso",        to: "/reportes/nuevo",  bg: "bg-cafe-900 text-white", iconCls: "text-gold-400" },
          { icon: SearchIcon,  label: "Buscar",        desc: "Encuentra a alguien",    to: "/buscar",          bg: "bg-white border border-cafe-100", iconCls: "text-cafe-700" },
          { icon: CoinIcon,    label: "Mis puntos",    desc: "Ve tu saldo",            to: "/puntos",          bg: "bg-white border border-cafe-100", iconCls: "text-cafe-700" },
        ].map(({ icon: Icon, label, desc, to, bg, iconCls }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`${bg} rounded-2xl p-4 text-left hover:shadow-md transition-all`}
          >
            <Icon className={`w-6 h-6 mb-2 ${iconCls}`} />
            <p className={`font-semibold text-sm ${bg.includes("cafe-900") ? "text-white" : "text-cafe-900"}`}>{label}</p>
            <p className={`text-xs mt-0.5 ${bg.includes("cafe-900") ? "text-cafe-300" : "text-cafe-500"}`}>{desc}</p>
          </button>
        ))}
      </section>

      {/* ── Reportes de la comunidad ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-cafe-900">Reportes de la comunidad</h2>
          <button
            onClick={() => navigate("/reportes")}
            className="text-xs text-cafe-500 hover:text-cafe-900 transition-colors"
          >
            Ver todos →
          </button>
        </div>

        {loadingCom && <div className="flex justify-center py-8"><Spinner /></div>}

        {!loadingCom && comunidad.length === 0 && (
          <div className="text-center py-8 bg-white rounded-2xl border border-cafe-100">
            <InboxIcon className="w-8 h-8 text-cafe-200 mx-auto" />
            <p className="text-cafe-500 mt-2 text-sm">No hay reportes aún.</p>
          </div>
        )}

        {!loadingCom && comunidad.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {comunidad.slice(0, 6).map((r) => (
              <ReporteCard key={r.id} reporte={r} />
            ))}
          </div>
        )}
      </section>

      {/* ── Cómo funciona ── */}
      <div className="bg-white border border-cafe-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <InfoIcon className="w-4 h-4 text-cafe-500" />
          <p className="font-semibold text-cafe-900 text-sm">¿Cómo funciona?</p>
        </div>
        <ul className="space-y-1 text-xs list-disc list-inside text-cafe-500">
          <li>Crea un reporte con los datos del desaparecido.</li>
          <li>La comunidad y voluntarios te ayudarán a encontrarlo.</li>
          <li>Ganas puntos por cada reporte validado que realices.</li>
          <li>Canjea tus puntos por recompensas en nuestra tienda.</li>
        </ul>
      </div>
    </div>
  );
}
