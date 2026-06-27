import { useState, useEffect } from "react";
import { reportesService } from "../services/reportes.service";

export function useReportes({ tipo = null, estado_resolucion = null, page = 1 } = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { page, limit: 20 };
    if (tipo) params.tipo = tipo;
    if (estado_resolucion) params.estado_resolucion = estado_resolucion;

    reportesService
      .list(params)
      .then((res) => {
        if (cancelled) return;
        // La API devuelve { success, data: { items, total } | [...], message }
        const payload = res.data?.data ?? res.data;
        if (Array.isArray(payload)) {
          setData(payload);
          setTotal(payload.length);
        } else {
          setData(payload?.items ?? []);
          setTotal(payload?.total ?? 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.detail || "Error al cargar reportes.");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tipo, estado_resolucion, page]);

  return { data, total, loading, error };
}
