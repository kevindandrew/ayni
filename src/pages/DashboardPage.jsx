import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import AdminDashboard from "./dashboards/AdminDashboard";
import CitizenDashboard from "./dashboards/CitizenDashboard";
import VolunteerDashboard from "./dashboards/VolunteerDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {user.role === ROLES.ADMIN && <AdminDashboard />}
      {user.role === ROLES.CITIZEN && <CitizenDashboard />}
      {user.role === ROLES.VOLUNTEER && <VolunteerDashboard />}
    </div>
  );
}
