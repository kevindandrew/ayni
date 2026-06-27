import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../constants/roles";
import { SearchIcon, MenuIcon, LogoutIcon } from "../ui/Icons";

export default function Navbar({ onMenuToggle, onSearch, searchValue = "" }) {
  const { user, logout } = useAuth();
  const initials = user
    ? `${user.nombre?.[0] ?? ""}${user.apellido?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <header className="bg-cafe-900 h-16 flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-cafe-300 hover:text-white hover:bg-cafe-800 transition-colors shrink-0"
        aria-label="Menú"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 bg-cafe-800 rounded-lg flex items-center justify-center">
          <SearchIcon className="w-4 h-4 text-gold-400" />
        </div>
        <span className="font-bold text-white text-base tracking-tight hidden sm:block">
          Ayni<span className="text-gold-400">Search</span>
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-2 max-w-lg">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Buscar personas, animales..."
            className="w-full bg-cafe-800 text-white placeholder-cafe-400 text-sm pl-9 pr-3 py-2 rounded-xl border border-cafe-700 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-white text-xs font-medium">{user.nombre}</span>
            <span className="text-cafe-300 text-xs">{ROLE_LABELS[user.rol] ?? user.rol}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gold-500 text-cafe-900 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="text-cafe-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-cafe-800"
          >
            <LogoutIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
