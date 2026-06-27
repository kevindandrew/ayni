import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reportesService } from "../services/reportes.service";
import { ROLES } from "../constants/roles";
import { TIPO_REPORTE_LABEL, ESTADO_LABEL } from "../constants/types";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import {
  ArrowLeftIcon, MapPinIcon, CalendarIcon, UserIcon, PawIcon,
  AlertTriangleIcon, ShieldAlertIcon, DocumentIcon, CheckCircleIcon,
  CheckIcon, XCircleIcon, PhotoIcon, ClockIcon,
} from "../components/ui/Icons";

const TYPE_ICON = {
  persona_desaparecida: UserIcon,
  animal_desaparecido:  PawIcon,
  accidente:            AlertTriangleIcon,
  vulnerabilidad:       ShieldAlertIcon,
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-cafe-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-cafe-900">{value}</p>
    </div>
  );
}

function ValidarModal({ reporte, onClose, onSuccess }) {
  const [decision, setDecision] = useState(null);
  const [motivo, setMotivo]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function submit() {
    if (!decision) { setError("Selecciona una decisión"); return; }
    if (decision === "rechazado" && !motivo.trim()) {
      setError("Debes indicar el motivo del rechazo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await reportesService.validar(reporte.id, {
        decision,
        motivo_rechazo: decision === "rechazado" ? motivo.trim() : null,
      });
      onSuccess(reporte.id, decision);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Error al validar el reporte");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="h-1.5 bg-linear-to-r from-cafe-900 to-gold-500" />
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-cafe-900 text-lg">Validar reporte</h3>
          <p className="text-sm text-cafe-500 line-clamp-2">{reporte.titulo}</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setDecision("aceptado"); setError(""); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                decision === "aceptado"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-cafe-100 bg-white hover:border-emerald-300"
              }`}
            >
              <CheckIcon className="w-7 h-7 text-emerald-600" />
              <span className="font-semibold text-sm text-emerald-700">Aceptar</span>
            </button>
            <button
              type="button"
              onClick={() => { setDecision("rechazado"); setError(""); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                decision === "rechazado"
                  ? "border-red-400 bg-red-50"
                  : "border-cafe-100 bg-white hover:border-red-300"
              }`}
            >
              <XCircleIcon className="w-7 h-7 text-red-500" />
              <span className="font-semibold text-sm text-red-600">Rechazar</span>
            </button>
          </div>

          {decision === "rechazado" && (
            <div>
              <label className="block text-xs font-semibold text-cafe-700 mb-1.5 uppercase tracking-wide">
                Motivo del rechazo
              </label>
              <textarea
                value={motivo}
                onChange={(e) => { setMotivo(e.target.value); setError(""); }}
                placeholder="Explica por qué se rechaza este reporte..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-cafe-200 bg-cafe-50 text-cafe-900 placeholder-cafe-300 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 focus:border-transparent transition resize-none"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-cafe-200 text-cafe-700 font-semibold text-sm hover:bg-cafe-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading || !decision}
              className="flex-1 py-3 rounded-xl bg-cafe-900 text-white font-semibold text-sm hover:bg-cafe-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReporteDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const [reporte, setReporte]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [imgIdx, setImgIdx]         = useState(0);
  const [showValidar, setShowValidar] = useState(false);
  const [validated, setValidated]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    reportesService.get(id)
      .then((res) => {
        if (cancelled) return;
        const payload = res.data?.data ?? res.data;
        setReporte(payload);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.detail || "No se pudo cargar el reporte.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  function handleValidated(reporteId, decision) {
    setShowValidar(false);
    setValidated(decision);
    setReporte((r) => r ? { ...r, estado_validacion: decision } : r);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cafe-600 hover:text-cafe-900 mb-6 text-sm font-medium transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Volver
        </button>
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-6 text-center">
          <p>{error || "Reporte no encontrado."}</p>
        </div>
      </div>
    );
  }

  const PlaceholderIcon = TYPE_ICON[reporte.tipo_reporte] ?? DocumentIcon;
  const imagenes = reporte.imagenes ?? [];
  const isAdmin = user?.rol === ROLES.ADMIN;
  const isPendiente = reporte.estado_validacion === "pendiente" || !reporte.estado_validacion;

  const fecha = reporte.fecha_desaparicion
    ? new Date(reporte.fecha_desaparicion).toLocaleDateString("es-PE", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : null;

  const creado = reporte.fecha_creacion
    ? new Date(reporte.fecha_creacion).toLocaleDateString("es-PE", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : null;

  return (
    <>
      {showValidar && (
        <ValidarModal
          reporte={reporte}
          onClose={() => setShowValidar(false)}
          onSuccess={handleValidated}
        />
      )}

      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cafe-600 hover:text-cafe-900 text-sm font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Volver
        </button>

        {/* Image gallery */}
        <div className="bg-white rounded-2xl overflow-hidden border border-cafe-100 shadow-sm">
          <div className="relative aspect-4/3 bg-cafe-50 flex items-center justify-center">
            {imagenes.length > 0 ? (
              <>
                <img
                  src={imagenes[imgIdx]?.url}
                  alt={reporte.titulo}
                  className="w-full h-full object-cover"
                />
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + imagenes.length) % imagenes.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4 text-cafe-700" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % imagenes.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors rotate-180"
                    >
                      <ArrowLeftIcon className="w-4 h-4 text-cafe-700" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {imagenes.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === imgIdx ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-cafe-200">
                <PlaceholderIcon className="w-16 h-16" />
                <p className="text-xs text-cafe-300">Sin imágenes</p>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-cafe-100 p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge type={reporte.tipo_reporte} />
            <Badge type={reporte.estado_resolucion ?? "activo"} />
            {reporte.estado_validacion && (
              <Badge type={reporte.estado_validacion} />
            )}
          </div>

          <h1 className="text-xl font-bold text-cafe-900 leading-tight">{reporte.titulo}</h1>

          {reporte.descripcion && (
            <p className="text-sm text-cafe-600 leading-relaxed">{reporte.descripcion}</p>
          )}
        </div>

        {/* Info grid */}
        <div className="bg-white rounded-2xl border border-cafe-100 p-5 shadow-sm">
          <h2 className="font-semibold text-cafe-900 mb-4 text-sm">Información del caso</h2>
          <div className="grid grid-cols-2 gap-4">
            {reporte.nombre_desaparecido && (
              <InfoRow label="Nombre" value={reporte.nombre_desaparecido} />
            )}
            {reporte.edad && (
              <InfoRow label="Edad" value={`${reporte.edad} años`} />
            )}
            {reporte.ultima_ubicacion && (
              <div className="col-span-2">
                <InfoRow label="Última ubicación" value={reporte.ultima_ubicacion} />
              </div>
            )}
            {fecha && (
              <InfoRow label="Fecha de desaparición" value={fecha} />
            )}
            {reporte.tipo_reporte && (
              <InfoRow label="Tipo" value={TIPO_REPORTE_LABEL[reporte.tipo_reporte] ?? reporte.tipo_reporte} />
            )}
            {reporte.subtipo_accidente && (
              <InfoRow label="Subtipo" value={reporte.subtipo_accidente} />
            )}
          </div>
        </div>

        {/* Datos adicionales */}
        {reporte.datos_adicionales && Object.keys(reporte.datos_adicionales).length > 0 && (
          <div className="bg-white rounded-2xl border border-cafe-100 p-5 shadow-sm">
            <h2 className="font-semibold text-cafe-900 mb-4 text-sm">Datos adicionales</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(reporte.datos_adicionales).map(([k, v]) =>
                v ? <InfoRow key={k} label={k.replace(/_/g, " ")} value={String(v)} /> : null
              )}
            </div>
          </div>
        )}

        {/* Motivo rechazo */}
        {reporte.motivo_rechazo && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Motivo de rechazo</p>
            <p className="text-sm text-red-800">{reporte.motivo_rechazo}</p>
          </div>
        )}

        {/* Footer meta */}
        {creado && (
          <div className="flex items-center gap-1.5 text-xs text-cafe-400">
            <ClockIcon className="w-3.5 h-3.5" />
            Publicado el {creado}
          </div>
        )}

        {/* Acciones admin */}
        {isAdmin && isPendiente && !validated && (
          <div className="bg-white rounded-2xl border border-cafe-100 p-5 shadow-sm space-y-3">
            <h2 className="font-semibold text-cafe-900 text-sm">Acciones de moderación</h2>
            <p className="text-xs text-cafe-500">Este reporte está pendiente de validación.</p>
            <button
              type="button"
              onClick={() => setShowValidar(true)}
              className="w-full py-3 bg-cafe-900 hover:bg-cafe-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Validar reporte
            </button>
          </div>
        )}

        {validated && (
          <div className={`rounded-2xl p-4 border ${
            validated === "aceptado"
              ? "bg-emerald-50 border-emerald-100"
              : "bg-red-50 border-red-100"
          }`}>
            <p className={`text-sm font-semibold ${
              validated === "aceptado" ? "text-emerald-700" : "text-red-700"
            }`}>
              {validated === "aceptado"
                ? "Reporte validado y aceptado correctamente."
                : "Reporte rechazado."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
