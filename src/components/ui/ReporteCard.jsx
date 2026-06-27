import { Link } from "react-router-dom";
import Badge from "./Badge";
import { MapPinIcon, UserIcon, PawIcon, AlertTriangleIcon, ShieldAlertIcon, DocumentIcon } from "./Icons";

const TYPE_ICON = {
  persona_desaparecida: UserIcon,
  animal_desaparecido:  PawIcon,
  accidente:            AlertTriangleIcon,
  vulnerabilidad:       ShieldAlertIcon,
};

export default function ReporteCard({ reporte }) {
  const {
    id,
    titulo,
    tipo_reporte,
    ultima_ubicacion,
    estado_resolucion,
    nombre_desaparecido,
    fecha_desaparicion,
    imagenes,
  } = reporte;

  const PlaceholderIcon = TYPE_ICON[tipo_reporte] ?? DocumentIcon;
  const firstImage = imagenes?.[0]?.url ?? null;
  const fecha = fecha_desaparicion
    ? new Date(fecha_desaparicion).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link to={`/reportes/${id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-cafe-100">
      {/* Image area */}
      <div className="relative aspect-4/3 bg-cafe-50 flex items-center justify-center">
        {firstImage ? (
          <img src={firstImage} alt={titulo} className="w-full h-full object-cover" />
        ) : (
          <PlaceholderIcon className="w-12 h-12 text-cafe-200" />
        )}
        <span className="absolute top-2 left-2">
          <Badge type={tipo_reporte} />
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-cafe-900 text-sm leading-tight line-clamp-2">{titulo}</h3>

        {nombre_desaparecido && (
          <p className="text-cafe-600 text-xs mt-0.5 font-medium">{nombre_desaparecido}</p>
        )}

        {ultima_ubicacion && (
          <p className="text-cafe-500 text-xs mt-1 flex items-center gap-1">
            <MapPinIcon className="w-3 h-3 shrink-0" />
            <span className="truncate">{ultima_ubicacion}</span>
          </p>
        )}

        <div className="flex items-center justify-between mt-2 gap-2">
          {fecha && <p className="text-cafe-400 text-xs">{fecha}</p>}
          <Badge type={estado_resolucion ?? "activo"} className="ml-auto" />
        </div>
      </div>
    </Link>
  );
}
