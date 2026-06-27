import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ROLE_LABELS } from "../../constants/roles";
import {
  SearchIcon, XIcon, ChartIcon, ClipboardIcon, ClockIcon, UsersIcon,
  BuildingIcon, GiftIcon, CoinIcon, IdCardIcon, HomeIcon, NewspaperIcon,
  PlusIcon, PencilIcon, ShieldIcon,
} from "../ui/Icons";

const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { Icon: ChartIcon,     label: "Dashboard",             to: "/dashboard" },
    { Icon: ClipboardIcon, label: "Todos los reportes",    to: "/reportes" },
    { Icon: ClockIcon,     label: "Pendientes de validar", to: "/reportes/pendientes" },
    { Icon: UsersIcon,     label: "Usuarios",              to: "/usuarios" },
    { Icon: BuildingIcon,  label: "Entidades",             to: "/entidades" },
    { Icon: GiftIcon,      label: "Recompensas",           to: "/recompensas" },
    { Icon: CoinIcon,      label: "Canjes",                to: "/canjes" },
    { Icon: IdCardIcon,    label: "Verificaciones",        to: "/verificaciones" },
  ],
  [ROLES.ENTIDAD]: [
    { Icon: HomeIcon,      label: "Inicio",            to: "/dashboard" },
    { Icon: NewspaperIcon, label: "Mis publicaciones", to: "/publicaciones" },
    { Icon: PlusIcon,      label: "Nueva publicación", to: "/publicaciones/nueva" },
    { Icon: ClipboardIcon, label: "Reportes",          to: "/reportes" },
    { Icon: BuildingIcon,  label: "Mi entidad",        to: "/entidad" },
  ],
  [ROLES.USUARIO]: [
    { Icon: HomeIcon,    label: "Inicio",       to: "/dashboard" },
    { Icon: PencilIcon,  label: "Mis reportes", to: "/mis-reportes" },
    { Icon: PlusIcon,    label: "Nuevo reporte",to: "/reportes/nuevo" },
    { Icon: SearchIcon,  label: "Buscar",       to: "/buscar" },
    { Icon: CoinIcon,    label: "Mis puntos",   to: "/puntos" },
    { Icon: GiftIcon,    label: "Recompensas",  to: "/recompensas" },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const items = user ? (NAV_ITEMS[user.rol] ?? []) : [];
  const initials = user
    ? `${user.nombre?.[0] ?? ""}${user.apellido?.[0] ?? ""}`.toUpperCase()
    : "";

  function handleNavClick() {
    if (window.innerWidth < 1024) onClose?.();
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-cafe-950 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:static lg:inset-auto lg:z-auto lg:translate-x-0 lg:shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header – solo móvil */}
        <div className="lg:hidden h-16 flex items-center px-5 border-b border-cafe-800 gap-2 shrink-0">
          <div className="w-7 h-7 bg-cafe-800 rounded-lg flex items-center justify-center">
            <SearchIcon className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Ayni<span className="text-gold-400">Search</span>
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-cafe-400 hover:text-white p-1 rounded-lg hover:bg-cafe-800 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* User pill – solo móvil */}
        {user && (
          <div className="lg:hidden mx-3 mt-3 p-3 bg-cafe-900 rounded-xl flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gold-500 text-cafe-900 flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.nombre} {user.apellido}</p>
              <p className="text-cafe-400 text-xs truncate">{ROLE_LABELS[user.rol] ?? user.rol}</p>
            </div>
          </div>
        )}

        {/* User badge – solo desktop */}
        {user && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-4 border-b border-cafe-800 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-cafe-900 flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate leading-tight">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-cafe-500 text-xs truncate leading-tight">
                {ROLE_LABELS[user.rol] ?? user.rol}
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {items.map(({ Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  isActive
                    ? "bg-cafe-800 text-white"
                    : "text-cafe-300 hover:bg-cafe-900 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-cafe-800 shrink-0">
          <p className="text-xs text-cafe-500 text-center">Juntos los encontramos</p>
        </div>
      </aside>
    </>
  );
}
