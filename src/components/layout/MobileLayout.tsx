import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Key, Power, Home, Bell, Settings } from "lucide-react";

interface MobileLayoutProps {
  title?: string;
  children: React.ReactNode;
  showBack?: boolean;
}

export default function MobileLayout({
  title = "Time Sheet Record",
  children,
}: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Do you want to log out of Field Timesheet Portal?")) {
      localStorage.removeItem("ak_mobile_token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      {/* Mobile Frame Container (fixed viewport width simulating a smartphone) */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200">
        
        {/* Top Header Bar (matches Screen 2 & 3: Navy Blue #0f3f6e) */}
        <header className="bg-[#0f3f6e] text-white px-3 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/")}
              className="p-1 hover:bg-white/10 rounded transition-colors text-white"
              title="Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-sm font-bold tracking-wide truncate max-w-[150px]">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Company / Org Dropdown Selector */}
            <div className="flex items-center bg-[#17528e] px-2 py-1 rounded text-white font-semibold cursor-pointer border border-blue-400/30">
              <span>VSL MI</span>
              <span className="ml-1 text-[10px]">▼</span>
            </div>

            {/* Change Password / Key Icon */}
            <button
              onClick={() => alert("Credentials & Key Security: Logged in as Supervisor")}
              className="p-1 text-slate-200 hover:text-white"
              title="Key"
            >
              <Key size={18} />
            </button>

            {/* Logout / Power Icon */}
            <button
              onClick={handleLogout}
              className="p-1 text-slate-200 hover:text-red-300"
              title="Sign Out"
            >
              <Power size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Fixed Bottom Navigation (matches Screen 2 & 3: Home, Notifications, Settings) */}
        <nav className="fixed bottom-0 w-full max-w-md bg-[#0f3f6e] text-white border-t border-blue-900/50 flex items-center justify-around py-2.5 z-40 shadow-lg">
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center py-1 px-4 transition-colors ${
              location.pathname === "/" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            <Home size={22} />
          </button>

          <button
            onClick={() => navigate("/approvals")}
            className={`flex flex-col items-center justify-center py-1 px-4 relative transition-colors ${
              location.pathname === "/approvals" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            <Bell size={22} />
            <span className="absolute top-0 right-2 w-2 h-2 bg-amber-400 rounded-full" />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className={`flex flex-col items-center justify-center py-1 px-4 transition-colors ${
              location.pathname === "/settings" ? "text-amber-400" : "text-slate-300 hover:text-white"
            }`}
          >
            <Settings size={22} />
          </button>
        </nav>
      </div>
    </div>
  );
}
