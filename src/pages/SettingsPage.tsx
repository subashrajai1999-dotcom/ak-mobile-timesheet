import MobileLayout from "../components/layout/MobileLayout";
import { DEFAULT_SUPERVISOR } from "../services/api";
import { RefreshCw, Database, Smartphone, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
  const handleClearCache = () => {
    if (window.confirm("Reset local offline timesheet drafts?")) {
      localStorage.removeItem("ak_timesheets_data");
      alert("Local storage cache reset to default!");
      window.location.reload();
    }
  };

  return (
    <MobileLayout title="Settings & Sync">
      <div className="p-4 space-y-4">
        {/* Sync Status Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Central Server</p>
              <h3 className="text-xs font-bold mt-0.5">https://ravi-bkj6.onrender.com</h3>
              <p className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1">
                ● Live & Connected
              </p>
            </div>
            <button
              onClick={() => alert("Syncing local records with Render database...")}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

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
            <span className="text-blue-700 font-semibold">{DEFAULT_SUPERVISOR.designation}</span>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-2.5">
          <button
            onClick={handleClearCache}
            className="w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 transition-colors"
          >
            Reset Local Storage Cache
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
