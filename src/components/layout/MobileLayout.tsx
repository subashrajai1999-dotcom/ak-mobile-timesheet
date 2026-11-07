import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, Home, Bell, Settings } from "lucide-react";
import { getAuth, clearAuth } from "../../services/api";

interface MobileLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function MobileLayout({
  title = "AK Field Portal",
  children,
}: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuth();

  const handleLogout = () => {
    if (window.confirm("Sign out of AK Field Portal?")) {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  // Derive short role label
  const roleLabel =
    user?.role === "SUPERVISOR"
      ? "Supervisor"
      : user?.role === "SITE_ENGINEER"
      ? "Site Engineer"
      : user?.role === "PROJECT_MANAGER"
      ? "Project Manager"
      : user?.role === "ADMIN"
      ? "Admin"
      : user?.role || "User";

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200">

        {/* Top Header Bar */}
        <header className="bg-[#0f3f6e] text-white px-3 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/")}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Home"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-wide leading-none">{title}</h1>
              <p className="text-[10px] text-blue-200 font-medium leading-tight mt-0.5">
                AK Project Technologies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Role Badge */}
            <div className="flex items-center bg-[#17528e] px-2 py-1 rounded text-white font-semibold border border-blue-400/30 max-w-[90px]">
              <span className="truncate text-[10px]">{roleLabel}</span>
            </div>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="p-1 text-slate-200 hover:text-red-300 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-[#0f3f6e] text-white border-t border-blue-900/50 flex items-center justify-around py-2.5 z-40 shadow-lg">
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center gap-1 py-1 px-4 transition-colors ${
              location.pathname === "/" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            <Home size={22} />
            <span className="text-[9px] font-semibold">Home</span>
          </button>

          <button
            onClick={() => navigate("/approvals")}
            className={`flex flex-col items-center gap-1 py-1 px-4 relative transition-colors ${
              location.pathname === "/approvals" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            <Bell size={22} />
            <span className="text-[9px] font-semibold">Alerts</span>
            <span className="absolute top-0 right-3 w-2 h-2 bg-amber-400 rounded-full" />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className={`flex flex-col items-center gap-1 py-1 px-4 transition-colors ${
              location.pathname === "/settings" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            <Settings size={22} />
            <span className="text-[9px] font-semibold">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
