import StatsCard from "../../components/ui/StatsCard";
import CaseCard from "../../components/ui/CaseCard";
import { STATS, MOCK_CASES } from "../../constants/mockData";
import { useAuth } from "../../context/AuthContext";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const stats = STATS.volunteer;
  const assignedCases = MOCK_CASES.filter((c) => c.assignedTo === user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Panel del Voluntario
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Gracias por tu ayuda, {user.name.split(" ")[0]} 🙏
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard label="Asignados" value={stats.assigned} icon="📌" color="blue" />
        <StatsCard label="Resueltos" value={stats.resolved} icon="✅" color="emerald" />
        <StatsCard label="Pendientes" value={stats.pending} icon="⏳" color="amber" />
      </div>

      {/* Motivation banner */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-2xl p-5 text-white flex items-center gap-4">
        <span className="text-4xl">🏅</span>
        <div>
          <p className="font-bold">¡Excelente trabajo!</p>
          <p className="text-blue-200 text-sm">
            Has ayudado a resolver {stats.resolved} casos. La comunidad te lo agradece.
          </p>
        </div>
      </div>

      {/* Assigned cases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            Casos asignados a ti
          </h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
            {assignedCases.filter((c) => c.status === "active").length} activos
          </span>
        </div>

        {assignedCases.length > 0 ? (
          <div className="space-y-3">
            {assignedCases.map((c) => (
              <CaseCard key={c.id} caseItem={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-4xl">📭</span>
            <p className="text-gray-500 mt-2 text-sm">No tienes casos asignados aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
