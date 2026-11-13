import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  Home,
  Bell,
  Settings,
  ChevronLeft,
  AlertTriangle,
  X,
  Clock,
  User,
  Shield,
  ChevronRight,
} from "lucide-react";
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
  const [showDrawer, setShowDrawer] = useState(false);

  const isHome = location.pathname === "/";

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setShowDrawer(false);
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AK";

  const navMenuItems = [
    {
      label: "Home Dashboard",
      path: "/",
      icon: <Home size={18} />,
      badge: null,
    },
    {
      label: "Time & Attendance",
      path: "/timesheet/new",
      icon: <Clock size={18} />,
      badge: "Log",
    },
    {
      label: "Self Service Profile",
      path: "/self-service",
      icon: <User size={18} />,
      badge: null,
    },
    {
      label: "Approvals & Alerts",
      path: "/approvals",
      icon: <Bell size={18} />,
      badge: "New",
    },
    {
      label: "Settings",
      path: "/settings",
      icon: <Settings size={18} />,
      badge: null,
    },
  ];

  const handleNavClick = (path: string) => {
    setShowDrawer(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      {/* Mobile Frame */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200">

        {/* Top Header Bar */}
        <header className="bg-[#0f3f6e] text-white px-3.5 pt-[max(env(safe-area-inset-top,0px),24px)] pb-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
          {/* Left section: Hamburger Menu or Back Button */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => (isHome ? setShowDrawer(true) : navigate(-1))}
              className="w-11 h-11 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors flex-shrink-0 cursor-pointer touch-manipulation"
              title={isHome ? "Open Menu" : "Back"}
              aria-label={isHome ? "Open Menu" : "Back"}
            >
              {isHome ? <Menu size={24} strokeWidth={2.4} /> : <ChevronLeft size={26} strokeWidth={2.4} />}
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
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {/* Role Badge */}
            <div
              className="bg-[#17528e] border border-blue-400/30 px-2.5 py-1 rounded-md text-white font-bold text-[10px] tracking-wide"
              title={`Role: ${roleFull}`}
            >
              {roleShort}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 hover:bg-red-500 active:bg-red-600 text-red-200 hover:text-white border border-red-400/30 transition-all cursor-pointer touch-manipulation"
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
            className={`flex flex-col items-center gap-0.5 py-1 px-4 transition-colors cursor-pointer ${
              location.pathname === "/" ? "text-amber-400 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            <Home size={20} />
            <span className="text-[9px]">Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/approvals")}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 relative transition-colors cursor-pointer ${
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
            className={`flex flex-col items-center gap-0.5 py-1 px-4 transition-colors cursor-pointer ${
              location.pathname === "/settings" ? "text-amber-400 font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span className="text-[9px]">Settings</span>
          </button>
        </nav>
      </div>

      {/* Slide-out Mobile Navigation Drawer (Sidebar Menu) */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setShowDrawer(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80%] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right">
            {/* Drawer Header */}
            <div className="bg-gradient-to-br from-[#1a5b99] via-[#0f4376] to-[#0a2f55] text-white pt-[max(env(safe-area-inset-top,0px),24px)] px-5 pb-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm">
                    AK
                  </div>
                  <div>
                    <h2 className="text-xs font-bold leading-tight">AK Field Portal</h2>
                    <p className="text-[9px] text-blue-200">Time & Attendance</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="w-9 h-9 rounded-xl hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-blue-100 hover:text-white cursor-pointer touch-manipulation"
                  title="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Profile Card inside Drawer */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-11 h-11 rounded-full bg-blue-800 border-2 border-white/50 flex items-center justify-center text-white font-black text-sm shadow-inner flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.name || "Field User"}
                  </p>
                  <span className="inline-block bg-blue-900/60 text-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-400/20 mt-0.5">
                    {roleFull}
                  </span>
                  {user?.email && (
                    <p className="text-[10px] text-blue-300/80 truncate font-mono mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Main Menu
              </p>

              {navMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-900 font-bold"
                        : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-blue-700" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className="text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer with Sign Out */}
            <div className="p-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  setShowLogoutModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>

              <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400">
                <span>AK Project Technologies</span>
                <span className="font-mono">v1.0.5</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Logout Confirmation Modal */}
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
                className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
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
