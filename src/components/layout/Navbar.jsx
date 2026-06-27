import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../constants/roles";
import Badge from "../ui/Badge";

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center px-4 gap-3 sticky top-0 z-30 shadow-sm">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Abrir menú"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-auto">
        <span className="text-xl">🔍</span>
        <span className="font-bold text-blue-900 text-lg tracking-tight">
          Ayni<span className="text-amber-500">Search</span>
        </span>
      </div>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-gray-800">{user.name}</span>
            <Badge type={user.role} />
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.avatar}
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
          >
            Salir
          </button>
        </div>
      )}
    </header>
  );
}
