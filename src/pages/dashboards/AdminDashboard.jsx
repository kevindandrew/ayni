import StatsCard from "../../components/ui/StatsCard";
import CaseCard from "../../components/ui/CaseCard";
import { STATS, MOCK_CASES } from "../../constants/mockData";

export default function AdminDashboard() {
  const stats = STATS.admin;
  const recentCases = MOCK_CASES.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
        <p className="text-gray-500 text-sm mt-1">Resumen general de la plataforma</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard label="Casos totales" value={stats.totalCases} icon="📋" color="blue" />
        <StatsCard label="Casos activos" value={stats.activeCases} icon="🔴" color="amber" />
        <StatsCard label="Encontrados" value={stats.foundCases} icon="✅" color="emerald" />
        <StatsCard label="Personas" value={stats.persons} icon="👤" color="blue" />
        <StatsCard label="Mascotas" value={stats.pets} icon="🐾" color="purple" />
        <StatsCard label="Voluntarios" value={stats.volunteers} icon="🙋" color="emerald" />
      </div>

      {/* Alert banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-semibold text-amber-800 text-sm">5 casos sin voluntario asignado</p>
          <p className="text-amber-700 text-xs mt-0.5">
            Revisa la lista de casos y asigna voluntarios disponibles.
          </p>
        </div>
        <button className="ml-auto text-xs text-amber-700 font-medium hover:underline flex-shrink-0">
          Ver →
        </button>
      </div>

      {/* Recent cases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Casos recientes</h3>
          <button className="text-sm text-blue-600 hover:underline">Ver todos</button>
        </div>
        <div className="space-y-3">
          {recentCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
