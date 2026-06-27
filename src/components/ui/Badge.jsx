const variants = {
  active:
    "bg-amber-100 text-amber-800 border border-amber-300",
  found:
    "bg-emerald-100 text-emerald-800 border border-emerald-300",
  person: "bg-blue-100 text-blue-800 border border-blue-300",
  pet: "bg-purple-100 text-purple-800 border border-purple-300",
  admin: "bg-red-100 text-red-800 border border-red-300",
  citizen: "bg-sky-100 text-sky-800 border border-sky-300",
  volunteer: "bg-teal-100 text-teal-800 border border-teal-300",
};

const labels = {
  active: "Activo",
  found: "Encontrado",
  person: "Persona",
  pet: "Mascota",
  admin: "Administrador",
  citizen: "Ciudadano",
  volunteer: "Voluntario",
};

export default function Badge({ type }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[type] ?? "bg-gray-100 text-gray-800"}`}
    >
      {labels[type] ?? type}
    </span>
  );
}
