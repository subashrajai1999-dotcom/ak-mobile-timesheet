import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/layout/MobileLayout";
import { getAuth, fetchMyTimesheets, getLocalTimesheets } from "../services/api";
import { TimesheetEntry } from "../types/timesheet.types";
import { User, Clock, ChevronRight, CheckCircle2, AlertCircle, Building2 } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const user = getAuth();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Try fetching from real API, fall back to localStorage
    fetchMyTimesheets()
      .then((data) => setTimesheets(data.slice(0, 3)))
      .catch(() => setTimesheets(getLocalTimesheets().slice(0, 3)));

    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
      );
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  // Derive initials for avatar fallback
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AK";

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
    <MobileLayout title="Field Portal">
      {/* Profile Banner */}
      <div className="relative bg-gradient-to-br from-[#1a5b99] via-[#0f4376] to-[#0a2f55] text-white pt-7 pb-7 px-4 text-center overflow-hidden">
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-white/80 shadow-xl bg-[#17528e] flex items-center justify-center mb-3">
            <span className="text-2xl font-black text-white tracking-tight">{initials}</span>
          </div>

          {/* Name */}
          <h2 className="text-base font-bold tracking-wide uppercase drop-shadow-sm">
            {user?.name || "AK User"}
          </h2>

          {/* Role Badge */}
          <p className="text-xs text-blue-200 font-semibold mt-0.5">{roleLabel}</p>

          {/* Company + Email Row */}
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1 text-[11px] text-blue-100/90 bg-blue-900/40 px-2.5 py-0.5 rounded-full border border-blue-400/20">
              <Building2 size={11} />
              <span>AK Project Technologies LLC</span>
            </div>
          </div>
          {user?.email && (
            <p className="text-[10px] text-blue-300 mt-1 font-mono">{user.email}</p>
          )}
        </div>
      </div>

      {/* Main Tiles */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Tile 1: Self Service */}
          <button
            onClick={() => navigate("/self-service")}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-2.5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <User size={28} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-bold text-gray-900 leading-tight">Self Service</span>
            <span className="text-[10px] text-gray-400 mt-1">Profile & Info</span>
          </button>

          {/* Tile 2: Time & Attendance */}
          <button
            onClick={() => navigate("/timesheet/new")}
            className="bg-gradient-to-b from-blue-50/60 to-white border-2 border-blue-500/40 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Clock size={28} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-bold text-blue-900 leading-tight">
              Time & Attendance
            </span>
            <span className="text-[10px] text-blue-600 font-semibold mt-1">Daily Log & OT</span>
          </button>
        </div>

        {/* Recent Timesheets */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Recent Records
            </h3>
            <button
              onClick={() => navigate("/timesheet/new")}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              + New Entry
            </button>
          </div>

          {timesheets.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              No records yet. Tap <strong>"New Entry"</strong> to start.
            </p>
          ) : (
            <div className="space-y-2.5">
              {timesheets.map((ts) => (
                <div
                  key={ts.id}
                  onClick={() => navigate("/timesheet/new")}
                  className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 font-mono">{ts.date}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                        {ts.projectCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[180px]">
                      {ts.remarks || "Regular site duty"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-xs font-bold text-gray-800 font-mono">
                        {ts.totalHours} hrs
                      </span>
                      <div className="text-[10px]">
                        {ts.approvalStatus === "Approved" ? (
                          <span className="text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                            <CheckCircle2 size={10} /> Approved
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold inline-flex items-center gap-0.5">
                            <AlertCircle size={10} /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Clock Footer */}
        <div className="pt-1 text-right">
          <span className="text-[11px] font-medium text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full">
            🕐 {currentTime}
          </span>
        </div>
      </div>
    </MobileLayout>
  );
}
