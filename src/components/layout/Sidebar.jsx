import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { icon: "📊", label: "Dashboard", id: "dashboard" },
    { icon: "📋", label: "Todos los casos", id: "cases" },
    { icon: "👥", label: "Usuarios", id: "users" },
    { icon: "🙋", label: "Voluntarios", id: "volunteers" },
    { icon: "⚙️", label: "Configuración", id: "settings" },
  ],
  [ROLES.CITIZEN]: [
    { icon: "🏠", label: "Inicio", id: "dashboard" },
    { icon: "📝", label: "Mis reportes", id: "my-cases" },
    { icon: "➕", label: "Nuevo reporte", id: "new-case" },
    { icon: "🔎", label: "Buscar casos", id: "search" },
  ],
  [ROLES.VOLUNTEER]: [
    { icon: "🏠", label: "Inicio", id: "dashboard" },
    { icon: "📌", label: "Casos asignados", id: "assigned" },
    { icon: "✅", label: "Casos resueltos", id: "resolved" },
    { icon: "🔎", label: "Buscar casos", id: "search" },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const items = user ? (NAV_ITEMS[user.role] ?? []) : [];

  return (
    <>
      {/* Overlay — mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-950 text-white z-50 flex flex-col transition-transform duration-300
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-5 border-b border-blue-900 gap-2">
          <span className="text-xl">🔍</span>
          <span className="font-bold text-white text-lg tracking-tight">
            Ayni<span className="text-amber-400">Search</span>
          </span>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-blue-300 hover:text-white"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-100 hover:bg-blue-900 hover:text-white transition-colors text-sm font-medium text-left"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom hint */}
        <div className="p-4 border-t border-blue-900">
          <p className="text-xs text-blue-400 text-center">
            Juntos los encontramos 🤝
          </p>
        </div>
      </aside>
    </>
  );
}
