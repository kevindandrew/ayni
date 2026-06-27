import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { reportesService } from "../services/reportes.service";
import { useApiList } from "../hooks/useApiList";
import Spinner from "../components/ui/Spinner";
import { ClockIcon, CheckCircleIcon, CheckIcon, XCircleIcon } from "../components/ui/Icons";
import { TIPO_REPORTE_LABEL } from "../constants/types";

function TipoBadge({ children }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
      {children}
    </span>
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
      onSuccess(reporte.id);
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
          <p className="text-sm text-cafe-600 font-medium line-clamp-2">{reporte.titulo}</p>

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

export default function PendientesPage() {
  const { search = "" } = useOutletContext() ?? {};
  const { data, total, loading, error, setData } = useApiList(
    () => reportesService.listPendientes({ limit: 50 }),
    []
  );

  const [validando, setValidando] = useState(null);

  const filtered = data.filter((r) =>
    !search ||
    r.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    r.nombre_desaparecido?.toLowerCase().includes(search.toLowerCase())
  );

  function handleValidated(reporteId) {
    setValidando(null);
    setData((prev) => prev.filter((r) => r.id !== reporteId));
  }

  return (
    <>
      {validando && (
        <ValidarModal
          reporte={validando}
          onClose={() => setValidando(null)}
          onSuccess={handleValidated}
        />
      )}

      <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cafe-900">Pendientes de validar</h1>
            <p className="text-xs text-cafe-500">{total} reportes esperando revisión</p>
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-cafe-100">
            <CheckCircleIcon className="w-12 h-12 text-emerald-200 mx-auto" />
            <p className="text-cafe-500 mt-3 text-sm">No hay reportes pendientes.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-cafe-100 p-4 flex items-start gap-4 hover:border-cafe-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-cafe-100 flex items-center justify-center shrink-0">
                  <ClockIcon className="w-5 h-5 text-cafe-500" />
                </div>
                <Link to={`/reportes/${r.id}`} className="flex-1 min-w-0 group">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-cafe-900 text-sm group-hover:underline">
                      {r.titulo}
                    </h3>
                    <TipoBadge>{TIPO_REPORTE_LABEL[r.tipo_reporte] ?? r.tipo_reporte}</TipoBadge>
                  </div>
                  {r.nombre_desaparecido && (
                    <p className="text-xs text-cafe-500">{r.nombre_desaparecido}</p>
                  )}
                  {r.ultima_ubicacion && (
                    <p className="text-xs text-cafe-400 mt-0.5">{r.ultima_ubicacion}</p>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => setValidando(r)}
                  className="shrink-0 px-3 py-1.5 bg-cafe-900 text-white text-xs font-medium rounded-lg hover:bg-cafe-800 transition-colors"
                >
                  Validar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
