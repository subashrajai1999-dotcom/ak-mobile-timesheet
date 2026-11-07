import MobileLayout from "../components/layout/MobileLayout";
import { DEFAULT_SUPERVISOR } from "../services/api";
import { User, Phone, Mail, Award, Calendar, FileText } from "lucide-react";

export default function SelfServicePage() {
  return (
    <MobileLayout title="Self Service">
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full border-4 border-blue-100 mx-auto overflow-hidden shadow mb-3">
            <img
              src={DEFAULT_SUPERVISOR.photoUrl}
              alt={DEFAULT_SUPERVISOR.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-base font-bold text-gray-900">{DEFAULT_SUPERVISOR.name}</h2>
          <p className="text-xs text-blue-700 font-semibold mt-0.5">{DEFAULT_SUPERVISOR.designation}</p>
          <span className="inline-block mt-2 text-[11px] font-mono bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            Employee ID: #{DEFAULT_SUPERVISOR.empId}
          </span>
        </div>

        {/* Contact & Personal Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] border-b border-gray-100 pb-2">
            Work & Contact Details
          </h3>

          <div className="flex items-center gap-3">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-[10px]">Email Address</p>
              <p className="font-medium text-gray-900">annamalai@akpt.ae</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-[10px]">Phone Number</p>
              <p className="font-medium text-gray-900">+971 50 123 4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-[10px]">Company / Business Unit</p>
              <p className="font-medium text-gray-900">VSL Middle East (VSL MI)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-[10px]">Date of Joining</p>
              <p className="font-medium text-gray-900">{DEFAULT_SUPERVISOR.joiningDate}</p>
            </div>
          </div>
        </div>

        {/* Leave & Entitlement Balances */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-3">
            Leave Balances (2026)
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg">
              <span className="text-lg font-bold text-blue-700">18</span>
              <p className="text-[10px] text-gray-600 mt-0.5">Annual</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
              <span className="text-lg font-bold text-emerald-700">7</span>
              <p className="text-[10px] text-gray-600 mt-0.5">Medical</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 p-2.5 rounded-lg">
              <span className="text-lg font-bold text-purple-700">4</span>
              <p className="text-[10px] text-gray-600 mt-0.5">Casual</p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
