import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import AdminDashboard from "./dashboards/AdminDashboard";
import UsuarioDashboard from "./dashboards/UsuarioDashboard";
import EntidadDashboard from "./dashboards/EntidadDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      {user.rol === ROLES.ADMIN    && <AdminDashboard />}
      {user.rol === ROLES.USUARIO  && <UsuarioDashboard />}
      {user.rol === ROLES.ENTIDAD  && <EntidadDashboard />}
    </>
  );
}
