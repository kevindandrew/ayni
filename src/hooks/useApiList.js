import { useState, useEffect, useRef } from "react";

export function useApiList(fetchFn, deps = []) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError("");
    fetchFn()
      .then((res) => {
        if (!mountedRef.current) return;
        const envelope = res.data?.data ?? res.data;
        if (Array.isArray(envelope)) {
          setData(envelope);
          setTotal(envelope.length);
        } else if (envelope?.items) {
          setData(envelope.items);
          setTotal(envelope.total ?? envelope.items.length);
        } else {
          setData([]);
          setTotal(0);
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        const msg = err.response?.data?.detail;
        setError(typeof msg === "string" ? msg : "Error al cargar datos");
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
    return () => { mountedRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, total, loading, error, setData };
}
