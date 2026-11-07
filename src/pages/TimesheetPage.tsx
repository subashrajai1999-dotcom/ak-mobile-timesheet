import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/layout/MobileLayout";
import { getAuth, fetchProjects, saveLocalTimesheet, FALLBACK_PROJECTS } from "../services/api";
import { AttendanceStatus, ProjectSite } from "../types/timesheet.types";
import { User, Calendar, Clock, MessageSquare, CheckCircle, ShieldCheck } from "lucide-react";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export default function TimesheetPage() {
  const navigate = useNavigate();
  const user = getAuth();

  const [projects, setProjects] = useState<ProjectSite[]>(FALLBACK_PROJECTS);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Form state
  const [date, setDate] = useState(todayString());
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("Present");
  const [projectCode, setProjectCode] = useState("");
  const [regularHrs, setRegularHrs] = useState<number>(8);
  const [normalOt, setNormalOt] = useState<number>(0);
  const [holidayOt, setHolidayOt] = useState<number>(0);
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load projects from AK backend
  useEffect(() => {
    fetchProjects().then((data) => {
      if (data.length > 0) {
        setProjects(data);
        setProjectCode(data[0].code);
      } else {
        setProjectCode(FALLBACK_PROJECTS[0].code);
      }
      setLoadingProjects(false);
    });
  }, []);

  // Auto-calculations
  const totalOt = useMemo(() => (Number(normalOt) || 0) + (Number(holidayOt) || 0), [normalOt, holidayOt]);
  const totalHours = useMemo(() => (Number(regularHrs) || 0) + totalOt, [regularHrs, totalOt]);

  const handleStatusChange = (status: AttendanceStatus) => {
    setAttendanceStatus(status);
    if (status === "Absent" || status === "On Leave") {
      setRegularHrs(0);
      setNormalOt(0);
      setHolidayOt(0);
    } else if (status === "Half Day") {
      setRegularHrs(4);
    } else {
      setRegularHrs(8);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const selectedProj = projects.find((p) => p.code === projectCode);

    saveLocalTimesheet({
      empId: user?.id || "unknown",
      employeeName: user?.name || "Unknown",
      date,
      attendanceStatus,
      projectCode,
      projectName: selectedProj?.name || projectCode,
      regularHrs,
      normalOt,
      holidayOt,
      totalOt,
      totalHours,
      remarks,
      approvalStatus: "Pending Approval",
      nextApprover: "Site Engineer",
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    }, 400);
  };

  const employeeLabel = user ? `${user.name}` : "—";

  return (
    <MobileLayout title="Time Sheet Record">
      {/* Success Banner */}
      {showSuccess && (
        <div className="bg-emerald-600 text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle size={16} />
          <span>Timesheet saved! Sent for approval.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-4 space-y-4">

        {/* Employee Name (read-only, from login) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500">
            <User size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Employee Name</label>
            <div className="border-b-2 border-slate-200 py-1.5 text-xs font-bold text-slate-800 bg-slate-50 px-1 rounded-t">
              {employeeLabel}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border-b-2 border-slate-300 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Attendance Status */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Attendance Status</label>
            <div className="relative">
              <select
                value={attendanceStatus}
                onChange={(e) => handleStatusChange(e.target.value as AttendanceStatus)}
                className="w-full bg-white border-b-2 border-slate-300 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 appearance-none pr-6"
              >
                <option value="Present">Present</option>
                <option value="Half Day">Half Day (4 hrs)</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
              <span className="absolute right-1 top-2 text-[10px] text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        {/* Project */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500">
            <span className="text-sm">🏗️</span>
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">TS Project</label>
            <div className="relative">
              {loadingProjects ? (
                <div className="text-xs text-slate-400 py-1.5 border-b-2 border-slate-200">Loading projects…</div>
              ) : (
                <select
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  className="w-full bg-white border-b-2 border-slate-300 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 appearance-none pr-6"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.code}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              )}
              <span className="absolute right-1 top-2 text-[10px] text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        {/* Regular Hrs */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500"><Clock size={20} /></div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Regular Hrs</label>
            <input
              type="number" min="0" max="24" step="0.5"
              value={regularHrs}
              onChange={(e) => setRegularHrs(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Normal OT */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500"><Clock size={20} /></div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Normal OT</label>
            <input
              type="number" min="0" max="16" step="0.5"
              value={normalOt}
              onChange={(e) => setNormalOt(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Holiday OT */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500"><Clock size={20} /></div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Holiday OT</label>
            <input
              type="number" min="0" max="16" step="0.5"
              value={holidayOt}
              onChange={(e) => setHolidayOt(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Total OT (calculated) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500"><Clock size={20} /></div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Total OT</label>
            <input
              type="number" readOnly value={totalOt}
              className="w-full bg-slate-50 border-b-2 border-emerald-400 py-1.5 text-xs font-bold text-emerald-800 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        {/* Total Hours (calculated) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500"><Clock size={20} /></div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Total Hours</label>
            <input
              type="number" readOnly value={totalHours}
              className="w-full bg-slate-50 border-b-2 border-blue-500 py-1.5 text-xs font-bold text-blue-900 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-500"><MessageSquare size={20} /></div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Remarks</label>
            <input
              type="text"
              placeholder="e.g. Water test, slab inspection…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-white border-b-2 border-blue-400 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Approval Status (auto) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-emerald-600">
            <CheckCircle size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Approval Status</label>
            <div className="border-b border-slate-200 py-1.5 text-xs font-bold text-amber-600">
              Pending Approval
            </div>
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="pt-4 pb-4">
          <div className="grid grid-cols-2 gap-0 bg-[#0f3f6e] rounded overflow-hidden shadow-lg">
            <button
              type="submit"
              disabled={isSaving || loadingProjects}
              className="py-3.5 text-center text-xs font-bold text-white hover:bg-blue-800 active:bg-blue-900 transition-colors border-r border-blue-800 tracking-wider uppercase disabled:opacity-60"
            >
              {isSaving ? "SAVING…" : "SAVE"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="py-3.5 text-center text-xs font-bold text-slate-200 hover:text-white hover:bg-blue-800 active:bg-blue-900 transition-colors tracking-wider uppercase"
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </MobileLayout>
  );
}
