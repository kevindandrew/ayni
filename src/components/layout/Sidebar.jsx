import { useAuth } from "../../context/AuthContext";
import { ROLES, ROLE_LABELS } from "../../constants/roles";
import {
  SearchIcon, XIcon, ChartIcon, ClipboardIcon, ClockIcon, UsersIcon,
  BuildingIcon, GiftIcon, CoinIcon, IdCardIcon, HomeIcon, NewspaperIcon,
  PlusIcon, PencilIcon, ShieldIcon,
} from "../ui/Icons";

const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { Icon: ChartIcon,     label: "Dashboard" },
    { Icon: ClipboardIcon, label: "Todos los reportes" },
    { Icon: ClockIcon,     label: "Pendientes de validar" },
    { Icon: UsersIcon,     label: "Usuarios" },
    { Icon: BuildingIcon,  label: "Entidades" },
    { Icon: GiftIcon,      label: "Recompensas" },
    { Icon: CoinIcon,      label: "Canjes" },
    { Icon: IdCardIcon,    label: "Verificaciones" },
  ],
  [ROLES.ENTIDAD]: [
    { Icon: HomeIcon,      label: "Inicio" },
    { Icon: NewspaperIcon, label: "Mis publicaciones" },
    { Icon: PlusIcon,      label: "Nueva publicación" },
    { Icon: ClipboardIcon, label: "Reportes" },
    { Icon: BuildingIcon,  label: "Mi entidad" },
  ],
  [ROLES.USUARIO]: [
    { Icon: HomeIcon,      label: "Inicio" },
    { Icon: PencilIcon,    label: "Mis reportes" },
    { Icon: PlusIcon,      label: "Nuevo reporte" },
    { Icon: SearchIcon,    label: "Buscar" },
    { Icon: CoinIcon,      label: "Mis puntos" },
    { Icon: GiftIcon,      label: "Recompensas" },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const items = user ? (NAV_ITEMS[user.rol] ?? []) : [];
  const initials = user
    ? `${user.nombre?.[0] ?? ""}${user.apellido?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <>
      {/* Overlay solo en móvil */}
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
        {/* ── Header: solo en móvil ── */}
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

        {/* ── User pill: solo en móvil ── */}
        {user && (
          <div className="lg:hidden mx-3 mt-3 p-3 bg-cafe-900 rounded-xl flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gold-500 text-cafe-900 flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-cafe-400 text-xs truncate">
                {ROLE_LABELS[user.rol] ?? user.rol}
              </p>
            </div>
          </div>
        )}

        {/* ── User badge: solo en desktop (compacto, sin repetir el navbar) ── */}
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

        {/* ── Navegación ── */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {items.map(({ Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-cafe-300 hover:bg-cafe-900 hover:text-white transition-colors text-sm font-medium text-left"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="px-4 py-3 border-t border-cafe-800 shrink-0">
          <p className="text-xs text-cafe-500 text-center">Juntos los encontramos</p>
        </div>
      </aside>
    </>
  );
}
