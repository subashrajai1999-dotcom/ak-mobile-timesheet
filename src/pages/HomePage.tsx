import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/layout/MobileLayout";
import { DEFAULT_SUPERVISOR, getLocalTimesheets } from "../services/api";
import { TimesheetEntry } from "../types/timesheet.types";
import { User, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setTimesheets(getLocalTimesheets().slice(0, 3));
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
    );
  }, []);

  return (
    <MobileLayout title="Field Portal">
      {/* 1. Geometric Blue Polygon Profile Banner (Screen 1) */}
      <div className="relative bg-gradient-to-br from-[#1a5b99] via-[#0f4376] to-[#0a2f55] text-white pt-6 pb-6 px-4 text-center overflow-hidden shadow-inner">
        {/* Geometric polygon pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Circular Profile Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-white/90 shadow-xl overflow-hidden bg-slate-200 mb-2.5">
            <img
              src={DEFAULT_SUPERVISOR.photoUrl}
              alt={DEFAULT_SUPERVISOR.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Designation */}
          <h2 className="text-base font-bold tracking-wide uppercase drop-shadow-sm">
            {DEFAULT_SUPERVISOR.name}
          </h2>
          <p className="text-xs text-blue-200 font-medium mt-0.5">
            {DEFAULT_SUPERVISOR.designation}
          </p>

          {/* Joining Date badge */}
          <div className="inline-flex items-center gap-1 text-[11px] text-blue-100/90 mt-1.5 bg-blue-900/40 px-2.5 py-0.5 rounded-full border border-blue-400/20">
            <span>📅 {DEFAULT_SUPERVISOR.joiningDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Two Touch Tiles (Screen 1: Self Service | Time And Attendance) */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Tile 1: Self Service */}
          <button
            onClick={() => navigate("/self-service")}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 mb-2.5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <User size={30} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-bold text-gray-900 leading-tight">
              Self Service
            </span>
            <span className="text-[10px] text-gray-400 mt-1">Profile & Shift</span>
          </button>

          {/* Tile 2: Time And Attendance */}
          <button
            onClick={() => navigate("/timesheet/new")}
            className="bg-white border-2 border-blue-500/40 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all group bg-gradient-to-b from-blue-50/40 to-white"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <Clock size={30} strokeWidth={2.2} />
            </div>
            <span className="text-xs font-bold text-blue-900 leading-tight">
              Time And Attendance
            </span>
            <span className="text-[10px] text-blue-600 font-semibold mt-1">Daily Log & OT</span>
          </button>
        </div>

        {/* 3. Recent Logged Timesheets */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Recent Time Sheet Records
            </h3>
            <button
              onClick={() => navigate("/timesheet/new")}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              + New Entry
            </button>
          </div>

          <div className="space-y-2.5">
            {timesheets.map((ts) => (
              <div
                key={ts.id}
                onClick={() => navigate("/timesheet/new")}
                className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 font-mono">
                      {ts.date}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                      {ts.projectCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[200px]">
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
        </div>

        {/* Timestamp Footer Bar (matches Screen 1: 6:14 pm) */}
        <div className="pt-2 text-right">
          <span className="text-[11px] font-medium text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full">
            Last Synced: {currentTime || "6:14 pm"}
          </span>
        </div>
      </div>
    </MobileLayout>
  );
}
