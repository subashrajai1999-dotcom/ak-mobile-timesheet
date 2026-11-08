import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, Home, Bell, Settings, ChevronLeft, AlertTriangle } from "lucide-react";
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isHome = location.pathname === "/";

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    clearAuth();
    navigate("/login", { replace: true });
  };

  // Short role acronym & full label
  const roleShort =
    user?.role === "SUPERVISOR"
      ? "SUP"
      : user?.role === "SITE_ENGINEER"
      ? "SE"
      : user?.role === "PROJECT_MANAGER"
      ? "PM"
      : user?.role === "ADMIN"
      ? "ADMIN"
      : "USER";

  const roleFull =
    user?.role === "SUPERVISOR"
      ? "Supervisor"
      : user?.role === "SITE_ENGINEER"
      ? "Site Engineer"
      : user?.role === "PROJECT_MANAGER"
      ? "Project Manager"
      : user?.role === "ADMIN"
      ? "Admin"
      : user?.role || "Staff";

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200">

        {/* Top Header Bar - Optimized for mobile width without overlapping */}
        <header className="bg-[#0f3f6e] text-white px-3 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
          {/* Left section: Navigation + Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => (isHome ? navigate("/") : navigate(-1))}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              title={isHome ? "Menu" : "Back"}
            >
              {isHome ? <Menu size={22} /> : <ChevronLeft size={24} />}
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold tracking-wide leading-tight truncate">
                {title}
              </h1>
              <p className="text-[10px] text-blue-200 font-medium leading-none truncate mt-0.5">
                AK Project Technologies
              </p>
            </div>
          </div>

          {/* Right section: Role badge + Big Logout Button */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {/* Role Badge - Compact with full title tooltip */}
            <div
              className="bg-[#17528e] border border-blue-400/30 px-2 py-1 rounded text-white font-bold text-[10px] tracking-wide"
              title={`Role: ${roleFull}`}
            >
              {roleShort}
            </div>

            {/* Logout Button - Generous 38x38px touch target with high contrast */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500 active:bg-red-600 text-red-200 hover:text-white border border-red-400/30 transition-all cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={18} strokeWidth={2.3} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-[#0f3f6e] text-white border-t border-blue-900/50 flex items-center justify-around py-2 z-40 shadow-lg">
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 transition-colors ${
              location.pathname === "/" ? "text-amber-400 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            <Home size={20} />
            <span className="text-[9px]">Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/approvals")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 relative transition-colors ${
              location.pathname === "/approvals" ? "text-amber-400 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            <Bell size={20} />
            <span className="text-[9px]">Alerts</span>
            <span className="absolute top-0 right-3 w-2 h-2 bg-amber-400 rounded-full" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 transition-colors ${
              location.pathname === "/settings" ? "text-amber-400 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span className="text-[9px]">Settings</span>
          </button>
        </nav>
      </div>

      {/* In-App Logout Confirmation Modal (replaces browser confirm dialog) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-gray-100 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Sign Out</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Are you sure you want to sign out of AK Field Portal?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
