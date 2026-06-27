import Badge from "./Badge";

export default function CaseCard({ caseItem }) {
  const { name, type, location, date, status, description, age, breed } =
    caseItem;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start hover:shadow-md transition-shadow">
      {/* Avatar placeholder */}
      <div
        className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${type === "person" ? "bg-blue-50" : "bg-purple-50"}`}
      >
        {type === "person" ? "👤" : "🐾"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
          <Badge type={type} />
          <Badge type={status} />
        </div>

        <p className="text-xs text-gray-400 mt-0.5">
          {type === "person" ? `${age} años · ` : `${breed} · `}
          {location}
        </p>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

        <p className="text-xs text-gray-400 mt-2">
          Reportado: {new Date(date).toLocaleDateString("es-PE")}
        </p>
      </div>
    </div>
  );
}
