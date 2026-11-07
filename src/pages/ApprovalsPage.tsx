import { useState } from "react";
import MobileLayout from "../components/layout/MobileLayout";
import { getLocalTimesheets } from "../services/api";
import { TimesheetEntry } from "../types/timesheet.types";
import { CheckCircle2, XCircle, Clock, Calendar, Check } from "lucide-react";

export default function ApprovalsPage() {
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(getLocalTimesheets());
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const pendingList = timesheets.filter((t) => t.approvalStatus === "Pending Approval");
  const approvedList = timesheets.filter((t) => t.approvalStatus === "Approved");

  const handleApprove = (id: string) => {
    setTimesheets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalStatus: "Approved" } : t))
    );
  };

  const handleReject = (id: string) => {
    setTimesheets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalStatus: "Rejected" } : t))
    );
  };

  return (
    <MobileLayout title="Approvals & Alerts">
      <div className="p-4 space-y-4">
        {/* Tab switch */}
        <div className="grid grid-cols-2 bg-gray-200 p-1 rounded-lg text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-1.5 rounded-md transition-colors ${
              activeTab === "pending"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`py-1.5 rounded-md transition-colors ${
              activeTab === "approved"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Approved ({approvedList.length})
          </button>
        </div>

        {/* Content list */}
        {activeTab === "pending" ? (
          pendingList.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-xs">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-gray-700">All Timesheets Approved</p>
              <p className="text-[11px] mt-1">No pending records awaiting sign-off.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingList.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.employeeName}</h4>
                      <p className="text-[10px] text-gray-400">ID: #{item.empId}</p>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      {item.projectCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-400 text-[10px] block">Date</span>
                      <span className="font-mono font-bold text-gray-800">{item.date}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-400 text-[10px] block">Regular</span>
                      <span className="font-mono font-bold text-gray-800">{item.regularHrs}h</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="text-blue-600 text-[10px] block">Total OT</span>
                      <span className="font-mono font-bold text-blue-800">{item.totalOt}h</span>
                    </div>
                  </div>

                  {item.remarks && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-700 italic border border-slate-100">
                      "{item.remarks}"
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-2.5">
            {approvedList.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{item.employeeName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      Approved
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {item.date} • {item.projectCode} • {item.totalHours} hrs total
                  </p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
