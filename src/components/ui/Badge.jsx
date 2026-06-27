const cfg = {
  // tipos de reporte
  persona_desaparecida: { cls: "bg-blue-100 text-blue-800", label: "Persona" },
  animal_desaparecido:  { cls: "bg-purple-100 text-purple-800", label: "Animal" },
  accidente:            { cls: "bg-red-100 text-red-800", label: "Accidente" },
  vulnerabilidad:       { cls: "bg-orange-100 text-orange-800", label: "Vulnerabilidad" },
  // estados resolución
  activo:      { cls: "bg-amber-100 text-amber-800", label: "Activo" },
  encontrado:  { cls: "bg-emerald-100 text-emerald-800", label: "Encontrado" },
  atendido:    { cls: "bg-sky-100 text-sky-800", label: "Atendido" },
  cerrado:     { cls: "bg-gray-100 text-gray-600", label: "Cerrado" },
  // estados validación
  pendiente:  { cls: "bg-amber-100 text-amber-800", label: "Pendiente" },
  aceptado:   { cls: "bg-emerald-100 text-emerald-800", label: "Validado" },
  rechazado:  { cls: "bg-red-100 text-red-800", label: "Rechazado" },
  // roles
  administrador: { cls: "bg-red-100 text-red-800", label: "Admin" },
  entidad:       { cls: "bg-teal-100 text-teal-800", label: "Entidad" },
  usuario:       { cls: "bg-sky-100 text-sky-800", label: "Ciudadano" },
};

export default function Badge({ type, className = "" }) {
  const { cls, label } = cfg[type] ?? { cls: "bg-gray-100 text-gray-700", label: type };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls} ${className}`}>
      {label}
    </span>
  );
}
