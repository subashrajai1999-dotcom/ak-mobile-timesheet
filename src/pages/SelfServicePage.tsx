import MobileLayout from "../components/layout/MobileLayout";
import { getAuth } from "../services/api";
import { Mail, Phone, Shield, User } from "lucide-react";

export default function SelfServicePage() {
  const user = getAuth();

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

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "AK";

  return (
    <MobileLayout title="Self Service">
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#0f4376] to-[#1a5b99] rounded-2xl p-5 text-white text-center shadow-lg">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mb-3">
            <span className="text-2xl font-black">{initials}</span>
          </div>
          <h2 className="text-base font-bold">{user?.name || "—"}</h2>
          <p className="text-blue-200 text-xs font-semibold mt-0.5">{roleLabel}</p>
          <p className="text-blue-300 text-[11px] mt-1 font-mono">{user?.email || "—"}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider border-b pb-2">
            Contact Details
          </h3>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <User size={15} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Full Name</p>
              <p className="text-xs font-bold text-gray-800">{user?.name || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Mail size={15} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Email</p>
              <p className="text-xs font-bold text-gray-800 font-mono">{user?.email || "—"}</p>
            </div>
          </div>

          {user?.phone && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Phone size={15} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium">Phone</p>
                <p className="text-xs font-bold text-gray-800">{user.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Shield size={15} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Role</p>
              <p className="text-xs font-bold text-gray-800">{roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider border-b pb-2 mb-3">
            Organisation
          </h3>
          <p className="text-xs font-bold text-gray-800">AK Project Technologies LLC</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Dubai, UAE</p>
        </div>
      </div>
    </MobileLayout>
  );
}
