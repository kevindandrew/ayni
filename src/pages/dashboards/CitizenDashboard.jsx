import StatsCard from "../../components/ui/StatsCard";
import CaseCard from "../../components/ui/CaseCard";
import { STATS, MOCK_CASES } from "../../constants/mockData";
import { useAuth } from "../../context/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const stats = STATS.citizen;
  // Show first 2 cases as "my reports" for demo
  const myCases = MOCK_CASES.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Hola, {user.name.split(" ")[0]} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Aquí puedes ver y gestionar tus reportes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard label="Mis reportes" value={stats.myReports} icon="📝" color="blue" />
        <StatsCard label="Activos" value={stats.activeReports} icon="🔴" color="amber" />
        <StatsCard label="Resueltos" value={stats.resolvedReports} icon="✅" color="emerald" />
      </div>

      {/* Quick action */}
      <button className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors text-left group">
        <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
          ➕
        </div>
        <div>
          <p className="font-semibold">Crear nuevo reporte</p>
          <p className="text-sm text-blue-200">
            Reporta una persona o mascota desaparecida
          </p>
        </div>
      </button>

      {/* My reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Mis reportes recientes</h3>
          <button className="text-sm text-blue-600 hover:underline">Ver todos</button>
        </div>
        <div className="space-y-3">
          {myCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
        <p className="font-semibold mb-1">💡 ¿Cómo funciona?</p>
        <ul className="space-y-1 text-xs list-disc list-inside text-blue-600">
          <li>Crea un reporte con los datos de la persona o mascota.</li>
          <li>Un voluntario será asignado para ayudarte.</li>
          <li>Recibirás actualizaciones del estado de tu caso.</li>
        </ul>
      </div>
    </div>
  );
}
