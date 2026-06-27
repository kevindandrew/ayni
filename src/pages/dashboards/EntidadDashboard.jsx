import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { publicacionesService } from "../../services/publicaciones.service";
import { useReportes } from "../../hooks/useReportes";
import ReporteCard from "../../components/ui/ReporteCard";
import FilterChip from "../../components/ui/FilterChip";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import {
  BuildingIcon, PlusIcon, InboxIcon,
  CalendarIcon, MegaphoneIcon, HeartIcon, HandshakeIcon, DocumentIcon, MapPinIcon,
} from "../../components/ui/Icons";

const PUB_ICON = {
  evento:       CalendarIcon,
  campana:      MegaphoneIcon,
  adopcion:     HeartIcon,
  voluntariado: HandshakeIcon,
};

const PUB_FILTERS = [
  { label: "Todas",         value: null },
  { label: "Eventos",       value: "evento" },
  { label: "Adopción",      value: "adopcion" },
  { label: "Campañas",      value: "campana" },
  { label: "Voluntariado",  value: "voluntariado" },
];

function PublicacionCard({ pub }) {
  const PubIcon = PUB_ICON[pub.tipo_publicacion] ?? DocumentIcon;
  return (
    <div className="bg-white rounded-2xl border border-cafe-100 shadow-sm p-4 flex gap-3 items-start hover:shadow-md transition-shadow">
      <div className="w-11 h-11 bg-cafe-50 rounded-xl flex items-center justify-center shrink-0">
        <PubIcon className="w-5 h-5 text-cafe-600" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-cafe-900 text-sm truncate">{pub.titulo}</h3>
          <Badge type={pub.estado ?? "publicado"} />
        </div>
        <p className="text-cafe-500 text-xs mt-1 line-clamp-2">{pub.contenido}</p>
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
  const { search = "" } = useOutletContext() ?? {};
  const [pubFiltro, setPubFiltro] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [pubLoading, setPubLoading] = useState(true);
  const { data: reportes, loading: repLoading } = useReportes({});

  useEffect(() => {
    setPubLoading(true);
    const params = { limit: 20 };
    if (pubFiltro) params.tipo = pubFiltro;
    publicacionesService
      .list(params)
      .then((res) => {
        const payload = res.data;
        setPublicaciones(Array.isArray(payload) ? payload : payload?.items ?? []);
      })
      .catch(() => setPublicaciones([]))
      .finally(() => setPubLoading(false));
  }, [pubFiltro]);

  const reportesFiltrados = reportes.filter((r) =>
    search === "" || r.titulo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-cafe-900 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-cafe-800 rounded-xl flex items-center justify-center shrink-0">
          <BuildingIcon className="w-6 h-6 text-gold-400" />
        </div>
        <div>
          <p className="font-bold text-lg">{user?.nombre} {user?.apellido}</p>
          <p className="text-cafe-300 text-sm">Panel de Entidad</p>
        </div>
        <button className="ml-auto bg-gold-500 hover:bg-gold-400 text-cafe-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5">
          <PlusIcon className="w-4 h-4" />
          Nueva publicación
        </button>
      </div>

      {/* Publicaciones */}
      <section className="space-y-3">
        <h2 className="font-semibold text-cafe-900">Publicaciones</h2>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {PUB_FILTERS.map((f) => (
            <FilterChip key={f.label} label={f.label} active={pubFiltro === f.value} onClick={() => setPubFiltro(f.value)} />
          ))}
        </div>

        {pubLoading && <div className="flex justify-center py-8"><Spinner /></div>}

        {!pubLoading && publicaciones.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-cafe-100">
            <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
            <p className="text-cafe-500 mt-2 text-sm">No hay publicaciones aún.</p>
          </div>
        )}

        {!pubLoading && publicaciones.map((p) => <PublicacionCard key={p.id} pub={p} />)}
      </section>

      {/* Reportes recientes */}
      <section className="space-y-3">
        <h2 className="font-semibold text-cafe-900">Reportes de la comunidad</h2>
        {repLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!repLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reportesFiltrados.slice(0, 6).map((r) => <ReporteCard key={r.id} reporte={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
