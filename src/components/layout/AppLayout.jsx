import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Spinner from "../ui/Spinner";

export default function AppLayout() {
  const { user, ready } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (!ready) {
    return (
      <div className="min-h-screen bg-cafe-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="h-screen bg-cafe-100 flex flex-col overflow-hidden">
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        onSearch={setSearch}
        searchValue={search}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet context={{ search }} />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
