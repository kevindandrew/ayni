import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { publicacionesService } from "../../services/publicaciones.service";
import { useApiList } from "../../hooks/useApiList";
import { useReportes } from "../../hooks/useReportes";
import ReporteCard from "../../components/ui/ReporteCard";
import FilterChip from "../../components/ui/FilterChip";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { useState } from "react";
import {
  BuildingIcon, PlusIcon, InboxIcon,
  CalendarIcon, MegaphoneIcon, HeartIcon, HandshakeIcon,
  DocumentIcon, MapPinIcon, NewspaperIcon, ClipboardIcon,
} from "../../components/ui/Icons";

const PUB_ICON = {
  evento:       CalendarIcon,
  campana:      MegaphoneIcon,
  adopcion:     HeartIcon,
  voluntariado: HandshakeIcon,
};

const PUB_TIPO_COLOR = {
  evento:       "bg-blue-100 text-blue-700",
  campana:      "bg-amber-100 text-amber-700",
  adopcion:     "bg-green-100 text-green-700",
  voluntariado: "bg-purple-100 text-purple-700",
};

const PUB_TIPO_LABEL = {
  evento: "Evento", campana: "Campaña", adopcion: "Adopción", voluntariado: "Voluntariado",
};

const PUB_FILTERS = [
  { label: "Todas",        value: null },
  { label: "Eventos",      value: "evento" },
  { label: "Adopción",     value: "adopcion" },
  { label: "Campañas",     value: "campana" },
  { label: "Voluntariado", value: "voluntariado" },
];

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

function PublicacionCard({ pub, onClick }) {
  const PubIcon = PUB_ICON[pub.tipo_publicacion] ?? DocumentIcon;
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-cafe-100 p-4 flex gap-3 items-start hover:border-cafe-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="w-10 h-10 bg-cafe-50 rounded-xl flex items-center justify-center shrink-0">
        <PubIcon className="w-5 h-5 text-cafe-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PUB_TIPO_COLOR[pub.tipo_publicacion] ?? "bg-gray-100 text-gray-600"}`}>
            {PUB_TIPO_LABEL[pub.tipo_publicacion] ?? pub.tipo_publicacion}
          </span>
          {pub.estado && <Badge type={pub.estado} />}
        </div>
        <h3 className="font-semibold text-cafe-900 text-sm truncate">{pub.titulo}</h3>
        <p className="text-cafe-500 text-xs mt-0.5 line-clamp-2">{pub.contenido}</p>
        {pub.lugar_evento && (
          <p className="text-cafe-400 text-xs mt-1 flex items-center gap-1">
            <MapPinIcon className="w-3 h-3 shrink-0" />
            {pub.lugar_evento}
          </p>
        )}
      </div>
    </div>
  );
}

export default function EntidadDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pubFiltro, setPubFiltro] = useState(null);

  // Publicaciones de la entidad
  const { data: publicaciones, total: totalPubs, loading: pubLoading } = useApiList(
    () => publicacionesService.list({
      limit: 6,
      ...(pubFiltro ? { tipo: pubFiltro } : {}),
    }),
    [pubFiltro]
  );

  // Reportes de la comunidad
  const { data: reportes, loading: repLoading } = useReportes({ page: 1 });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">

      {/* ── Banner ── */}
      <div className="bg-linear-to-r from-cafe-900 to-cafe-700 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-cafe-800 rounded-xl flex items-center justify-center shrink-0">
          <BuildingIcon className="w-6 h-6 text-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg truncate">{user?.nombre} {user?.apellido}</p>
          <p className="text-cafe-300 text-sm">Panel de Entidad</p>
        </div>
        <button
          onClick={() => navigate("/publicaciones/nueva")}
          className="ml-auto bg-gold-500 hover:bg-gold-400 active:bg-gold-300 text-cafe-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          Nueva publicación
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="flex flex-wrap gap-3">
        <StatCard
          icon={NewspaperIcon}
          label="Publicaciones"
          value={totalPubs}
          bg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={ClipboardIcon}
          label="Reportes comunidad"
          value={reportes.length}
          bg="bg-cafe-100"
          iconColor="text-cafe-700"
        />
      </div>

      {/* ── Acciones rápidas ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: PlusIcon,       label: "Nueva publicación", desc: "Crea contenido",       to: "/publicaciones/nueva", primary: true },
          { icon: NewspaperIcon,  label: "Mis publicaciones", desc: "Gestiona tu contenido", to: "/publicaciones",       primary: false },
          { icon: ClipboardIcon,  label: "Ver reportes",       desc: "Comunidad",             to: "/reportes",            primary: false },
        ].map(({ icon: Icon, label, desc, to, primary }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`rounded-2xl p-4 text-left hover:shadow-md transition-all ${
              primary ? "bg-cafe-900 text-white" : "bg-white border border-cafe-100"
            }`}
          >
            <Icon className={`w-6 h-6 mb-2 ${primary ? "text-gold-400" : "text-cafe-700"}`} />
            <p className={`font-semibold text-sm ${primary ? "text-white" : "text-cafe-900"}`}>{label}</p>
            <p className={`text-xs mt-0.5 ${primary ? "text-cafe-300" : "text-cafe-500"}`}>{desc}</p>
          </button>
        ))}
      </div>

      {/* ── Publicaciones ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-cafe-900">Publicaciones recientes</h2>
          <button
            onClick={() => navigate("/publicaciones")}
            className="text-xs text-cafe-500 hover:text-cafe-900 transition-colors"
          >
            Ver todas →
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {PUB_FILTERS.map((f) => (
            <FilterChip
              key={f.label}
              label={f.label}
              active={pubFiltro === f.value}
              onClick={() => setPubFiltro(f.value)}
            />
          ))}
        </div>

        {pubLoading && <div className="flex justify-center py-8"><Spinner /></div>}

        {!pubLoading && publicaciones.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-cafe-100">
            <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
            <p className="text-cafe-500 mt-2 text-sm">No hay publicaciones aún.</p>
            <button
              onClick={() => navigate("/publicaciones/nueva")}
              className="mt-3 px-4 py-2 bg-cafe-900 text-white text-xs font-medium rounded-xl hover:bg-cafe-800 transition-colors"
            >
              Crear primera publicación
            </button>
          </div>
        )}

        {!pubLoading && publicaciones.length > 0 && (
          <div className="space-y-2">
            {publicaciones.map((p) => (
              <PublicacionCard
                key={p.id}
                pub={p}
                onClick={() => navigate("/publicaciones")}
              />
            ))}
          </div>
        )}
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

        {repLoading && <div className="flex justify-center py-8"><Spinner /></div>}

        {!repLoading && reportes.length === 0 && (
          <div className="text-center py-8 bg-white rounded-2xl border border-cafe-100">
            <InboxIcon className="w-8 h-8 text-cafe-200 mx-auto" />
            <p className="text-cafe-500 mt-2 text-sm">No hay reportes en la comunidad.</p>
          </div>
        )}

        {!repLoading && reportes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reportes.slice(0, 6).map((r) => (
              <ReporteCard key={r.id} reporte={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
