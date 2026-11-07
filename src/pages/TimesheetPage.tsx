import { useState, useMemo, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/layout/MobileLayout";
import { DEFAULT_SUPERVISOR, MOCK_PROJECTS, saveLocalTimesheet } from "../services/api";
import { AttendanceStatus } from "../types/timesheet.types";
import { User, Calendar, Clock, MessageSquare, CheckCircle, ShieldCheck } from "lucide-react";

export default function TimesheetPage() {
  const navigate = useNavigate();

  // Form State matching Screen 2 & Screen 3
  const [employee] = useState(`${DEFAULT_SUPERVISOR.empId}-${DEFAULT_SUPERVISOR.name}`);
  const [date, setDate] = useState("2026-10-28");
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("Present");
  const [projectCode, setProjectCode] = useState("UBR505");
  const [regularHrs, setRegularHrs] = useState<number>(8);
  const [normalOt, setNormalOt] = useState<number>(0);
  const [holidayOt, setHolidayOt] = useState<number>(0);
  const [remarks, setRemarks] = useState("Water test");
  const [approvalStatus] = useState("Pending Approval");
  const [nextApprover] = useState("Site Engineer (Dharmendran)");

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Auto-calculated fields:
  // Total OT = Normal OT + Holiday OT
  const totalOt = useMemo(() => {
    return (Number(normalOt) || 0) + (Number(holidayOt) || 0);
  }, [normalOt, holidayOt]);

  // Total Hours = Regular Hrs + Total OT
  const totalHours = useMemo(() => {
    return (Number(regularHrs) || 0) + totalOt;
  }, [regularHrs, totalOt]);

  // Handle Attendance status change rules
  const handleStatusChange = (status: AttendanceStatus) => {
    setAttendanceStatus(status);
    if (status === "Absent" || status === "On Leave") {
      setRegularHrs(0);
      setNormalOt(0);
      setHolidayOt(0);
    } else if (status === "Half Day") {
      setRegularHrs(4);
    } else if (status === "Present") {
      setRegularHrs(8);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const selectedProj = MOCK_PROJECTS.find((p) => p.code === projectCode);

    saveLocalTimesheet({
      empId: DEFAULT_SUPERVISOR.empId,
      employeeName: DEFAULT_SUPERVISOR.name,
      date,
      attendanceStatus,
      projectCode,
      projectName: selectedProj?.name || "TAK CONST",
      regularHrs,
      normalOt,
      holidayOt,
      totalOt,
      totalHours,
      remarks,
      approvalStatus: "Pending Approval",
      nextApprover,
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate("/");
      }, 1200);
    }, 400);
  };

  return (
    <MobileLayout title="Time Sheet Record">
      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="bg-emerald-600 text-white p-3 text-center text-xs font-bold animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle size={16} />
          <span>Timesheet recorded and routed to Site Engineer!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-4 space-y-4">
        
        {/* Field 1: Employee Name */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <User size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Employee Name
            </label>
            <div className="relative">
              <select
                value={employee}
                disabled
                className="w-full bg-white border-b-2 border-slate-300 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 appearance-none pr-6 cursor-not-allowed"
              >
                <option value={employee}>{employee}</option>
              </select>
              <span className="absolute right-1 top-2 text-[10px] text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        {/* Field 2: Date */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border-b-2 border-slate-300 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Field 3: Attendance Status */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Attendance Status
            </label>
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

        {/* Field 4: TS Project */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <span className="text-sm font-bold">🏗️</span>
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              TS Project
            </label>
            <div className="relative">
              <select
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="w-full bg-white border-b-2 border-slate-300 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 appearance-none pr-6"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.code}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-1 top-2 text-[10px] text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        {/* Field 5: Regular Hrs */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Regular Hrs
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={regularHrs}
              onChange={(e) => setRegularHrs(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Field 6: Normal OT */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Normal OT
            </label>
            <input
              type="number"
              min="0"
              max="16"
              step="0.5"
              value={normalOt}
              onChange={(e) => setNormalOt(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Field 7: Holiday OT */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Holiday OT
            </label>
            <input
              type="number"
              min="0"
              max="16"
              step="0.5"
              value={holidayOt}
              onChange={(e) => setHolidayOt(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Field 8: Total OT (Calculated) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Total OT
            </label>
            <input
              type="number"
              readOnly
              value={totalOt}
              className="w-full bg-slate-50 border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-emerald-800 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        {/* Field 9 & 10: Total Hours (Calculated) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Total Hours
            </label>
            <input
              type="number"
              readOnly
              value={totalHours}
              className="w-full bg-slate-50 border-b-2 border-emerald-500 py-1.5 text-xs font-bold text-blue-900 font-mono cursor-not-allowed"
            />
          </div>
        </div>

        {/* Field 11: Remarks (matches Screen 3: Water test) */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <MessageSquare size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Remarks
            </label>
            <input
              type="text"
              placeholder="e.g. Water test or slab inspection"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-white border-b-2 border-blue-500 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Field 12: Approval Status */}
        <div className="flex items-start gap-3">
          <div className="w-8 pt-6 flex justify-center text-emerald-600">
            <CheckCircle size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Approval Status
            </label>
            <div className="border-b border-slate-200 py-1.5 text-xs font-bold text-amber-600">
              {approvalStatus}
            </div>
          </div>
        </div>

        {/* Field 13: Next Approver */}
        <div className="flex items-start gap-3 pb-6">
          <div className="w-8 pt-6 flex justify-center text-slate-700">
            <User size={20} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Next Approver
            </label>
            <div className="border-b border-slate-200 py-1.5 text-xs font-semibold text-slate-700">
              {nextApprover}
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons (matches Screen 2 & 3: SAVE | CANCEL in Navy Banner) */}
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-2 gap-0 bg-[#0f3f6e] rounded overflow-hidden shadow-lg border border-blue-900">
            <button
              type="submit"
              disabled={isSaving}
              className="py-3 text-center text-xs font-bold text-white hover:bg-blue-800 active:bg-blue-900 transition-colors border-r border-blue-800 tracking-wider uppercase"
            >
              {isSaving ? "SAVING..." : "SAVE"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="py-3 text-center text-xs font-bold text-slate-200 hover:text-white hover:bg-blue-800 active:bg-blue-900 transition-colors tracking-wider uppercase"
            >
              CANCEL
            </button>
          </div>
        </div>

      </form>
    </MobileLayout>
  );
}
