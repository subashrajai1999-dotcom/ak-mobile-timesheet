export type AttendanceStatus = "Present" | "Absent" | "Half Day" | "On Leave";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  token: string;
}

export interface EmployeeProfile {
  id: string;
  empId: string;
  name: string;
  designation: string;
  department?: string;
  company: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  joiningDate?: string;
}

export interface ProjectSite {
  id: string;
  code: string;
  name: string;
  location: string;
}

export interface TimesheetEntry {
  id: string;
  empId: string;
  employeeName: string;
  date: string;
  attendanceStatus: AttendanceStatus;
  projectCode: string;
  projectName: string;
  regularHrs: number;
  normalOt: number;
  holidayOt: number;
  totalOt: number;
  totalHours: number;
  remarks: string;
  approvalStatus: "Draft" | "Pending Approval" | "Approved" | "Rejected";
  nextApprover: string;
  createdAt?: string;
}
