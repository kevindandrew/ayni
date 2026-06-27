import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";
import {
  ChartIcon, ClipboardIcon, UsersIcon,
  HomeIcon, NewspaperIcon, PlusIcon, UserIcon,
  SearchIcon, PencilIcon, BuildingIcon, CoinIcon,
} from "../ui/Icons";

const ITEMS = {
  [ROLES.ADMIN]: [
    { Icon: ChartIcon,     label: "Inicio",    to: "/dashboard",            cta: false },
    { Icon: ClipboardIcon, label: "Reportes",  to: "/reportes",             cta: false },
    { Icon: PlusIcon,      label: "Pendientes",to: "/reportes/pendientes",  cta: true  },
    { Icon: UsersIcon,     label: "Usuarios",  to: "/usuarios",             cta: false },
  ],
  [ROLES.ENTIDAD]: [
    { Icon: HomeIcon,      label: "Inicio",        to: "/dashboard",          cta: false },
    { Icon: NewspaperIcon, label: "Publicaciones",  to: "/publicaciones",      cta: false },
    { Icon: PlusIcon,      label: "Nuevo",          to: "/publicaciones/nueva",cta: true  },
    { Icon: BuildingIcon,  label: "Mi entidad",     to: "/entidad",            cta: false },
  ],
  [ROLES.USUARIO]: [
    { Icon: HomeIcon,    label: "Inicio",     to: "/dashboard",       cta: false },
    { Icon: SearchIcon,  label: "Buscar",     to: "/buscar",          cta: false },
    { Icon: PlusIcon,    label: "Reportar",   to: "/reportes/nuevo",  cta: true  },
    { Icon: PencilIcon,  label: "Mis casos",  to: "/mis-reportes",    cta: false },
    { Icon: CoinIcon,    label: "Puntos",     to: "/puntos",          cta: false },
  ],
};

export default function BottomNav() {
  const { user } = useAuth();
  const items = user ? (ITEMS[user.rol] ?? []) : [];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-cafe-100">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map(({ Icon, label, to, cta }) =>
          cta ? (
            <NavLink key={to} to={to} className="flex flex-col items-center flex-1 py-1">
              <div className="w-11 h-11 bg-cafe-900 rounded-full flex items-center justify-center shadow-lg -mt-5 border-4 border-white">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${
                  isActive ? "text-cafe-900" : "text-cafe-400 hover:text-cafe-700"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium leading-none">{label}</span>
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}
