import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AppLayout from "./components/layout/AppLayout";
import ReportesPage from "./pages/ReportesPage";
import PendientesPage from "./pages/PendientesPage";
import UsuariosPage from "./pages/UsuariosPage";
import EntidadesPage from "./pages/EntidadesPage";
import RecompensasPage from "./pages/RecompensasPage";
import CanjesPage from "./pages/CanjesPage";
import VerificacionesPage from "./pages/VerificacionesPage";
import MisReportesPage from "./pages/MisReportesPage";
import NuevoReportePage from "./pages/NuevoReportePage";
import BuscarPage from "./pages/BuscarPage";
import PuntosPage from "./pages/PuntosPage";
import PublicacionesPage from "./pages/PublicacionesPage";
import NuevaPublicacionPage from "./pages/NuevaPublicacionPage";
import MiEntidadPage from "./pages/MiEntidadPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard"              element={<DashboardPage />} />
            <Route path="/reportes"               element={<ReportesPage />} />
            <Route path="/reportes/pendientes"    element={<PendientesPage />} />
            <Route path="/reportes/nuevo"         element={<NuevoReportePage />} />
            <Route path="/usuarios"               element={<UsuariosPage />} />
            <Route path="/entidades"              element={<EntidadesPage />} />
            <Route path="/recompensas"            element={<RecompensasPage />} />
            <Route path="/canjes"                 element={<CanjesPage />} />
            <Route path="/verificaciones"         element={<VerificacionesPage />} />
            <Route path="/mis-reportes"           element={<MisReportesPage />} />
            <Route path="/buscar"                 element={<BuscarPage />} />
            <Route path="/puntos"                 element={<PuntosPage />} />
            <Route path="/publicaciones"          element={<PublicacionesPage />} />
            <Route path="/publicaciones/nueva"    element={<NuevaPublicacionPage />} />
            <Route path="/entidad"                element={<MiEntidadPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
