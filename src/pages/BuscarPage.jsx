import { useState } from "react";
import { reportesService } from "../services/reportes.service";
import { useApiList } from "../hooks/useApiList";
import ReporteCard from "../components/ui/ReporteCard";
import Spinner from "../components/ui/Spinner";
import { SearchIcon, InboxIcon } from "../components/ui/Icons";

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data, loading, error } = useApiList(
    () => reportesService.list({ limit: 50 }),
    []
  );

  const results = submitted && query.trim()
    ? data.filter((r) =>
        r.titulo?.toLowerCase().includes(query.toLowerCase()) ||
        r.nombre_desaparecido?.toLowerCase().includes(query.toLowerCase()) ||
        r.ultima_ubicacion?.toLowerCase().includes(query.toLowerCase()) ||
        r.descripcion?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleSearch() {
    if (query.trim()) setSubmitted(true);
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-cafe-100 rounded-xl flex items-center justify-center">
          <SearchIcon className="w-5 h-5 text-cafe-700" />
        </div>
        <h1 className="text-xl font-bold text-cafe-900">Buscar reportes</h1>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscar por nombre, ubicación, descripción..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-cafe-200 bg-white text-cafe-900 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-800 transition"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-5 py-3 bg-cafe-900 text-white text-sm font-medium rounded-xl hover:bg-cafe-800 transition-colors"
        >
          Buscar
        </button>
      </div>

      {loading && <div className="flex justify-center py-10"><Spinner /></div>}

      {submitted && !loading && results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-cafe-100">
          <InboxIcon className="w-10 h-10 text-cafe-200 mx-auto" />
          <p className="text-cafe-500 mt-2 text-sm">No se encontraron resultados para "{query}".</p>
        </div>
      )}

      {submitted && results.length > 0 && (
        <>
          <p className="text-xs text-cafe-500">{results.length} resultados para "{query}"</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map((r) => <ReporteCard key={r.id} reporte={r} />)}
          </div>
        </>
      )}

      {!submitted && (
        <div className="text-center py-16 text-cafe-400 text-sm">
          Ingresa un término para buscar reportes.
        </div>
      )}
    </div>
  );
}
