import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";
import {
  ChartIcon, ClipboardIcon, UsersIcon, ShieldIcon,
  HomeIcon, NewspaperIcon, PlusIcon, UserIcon,
  SearchIcon, PencilIcon, BuildingIcon,
} from "../ui/Icons";

const ITEMS = {
  [ROLES.ADMIN]: [
    { Icon: ChartIcon,    label: "Inicio",    cta: false },
    { Icon: ClipboardIcon,label: "Reportes",  cta: false },
    { Icon: UsersIcon,    label: "Usuarios",  cta: false },
    { Icon: ShieldIcon,   label: "Perfil",    cta: false },
  ],
  [ROLES.ENTIDAD]: [
    { Icon: HomeIcon,      label: "Inicio",       cta: false },
    { Icon: NewspaperIcon, label: "Publicaciones", cta: false },
    { Icon: PlusIcon,      label: "Nuevo",         cta: true  },
    { Icon: BuildingIcon,  label: "Mi entidad",    cta: false },
  ],
  [ROLES.USUARIO]: [
    { Icon: HomeIcon,     label: "Inicio",     cta: false },
    { Icon: SearchIcon,   label: "Buscar",     cta: false },
    { Icon: PlusIcon,     label: "Reportar",   cta: true  },
    { Icon: PencilIcon,   label: "Mis casos",  cta: false },
    { Icon: UserIcon,     label: "Perfil",     cta: false },
  ],
};

export default function BottomNav() {
  const { user } = useAuth();
  const items = user ? (ITEMS[user.rol] ?? []) : [];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-cafe-100">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map(({ Icon, label, cta }) =>
          cta ? (
            <button key={label} className="flex flex-col items-center flex-1 py-1">
              <div className="w-11 h-11 bg-cafe-900 rounded-full flex items-center justify-center shadow-lg -mt-5 border-4 border-white">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </button>
          ) : (
            <button
              key={label}
              className="flex flex-col items-center gap-1 flex-1 py-2 text-cafe-400 hover:text-cafe-900 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium leading-none">{label}</span>
            </button>
          )
        )}
      </div>
    </nav>
  );
}
