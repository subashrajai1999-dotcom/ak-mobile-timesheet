import MobileLayout from "../components/layout/MobileLayout";
import { getAuth, clearAuth } from "../services/api";
import { Database, Smartphone, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = getAuth();

  const handleLogout = () => {
    if (window.confirm("Do you want to sign out of AK Field Portal?")) {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };
  const handleClearCache = () => {
    if (window.confirm("Reset local offline timesheet drafts?")) {
      localStorage.removeItem("ak_timesheets_data");
      alert("Local storage cache reset to default!");
      window.location.reload();
    }
  };

  return (
    <MobileLayout title="Settings">
      <div className="p-4 space-y-4">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 text-xs">
          <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] border-b border-gray-100 pb-2">
            Field Configuration
          </h4>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} className="text-gray-400" />
              <span>Offline Draft Mode</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Database size={16} className="text-gray-400" />
              <span>Standard Shift Regular Hours</span>
            </div>
            <span className="font-mono font-bold text-gray-800">8.0 hrs</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Shield size={16} className="text-gray-400" />
              <span>Supervisor Permission Level</span>
            </div>
            <span className="text-blue-700 font-semibold">{user?.role || "Supervisor"}</span>
          </div>
        </div>

        {/* Cache Management & Sign Out */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
          <button
            onClick={handleClearCache}
            className="w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 transition-colors"
          >
            Reset Local Storage Cache
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-center py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg border border-red-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out of AK Field Portal</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
