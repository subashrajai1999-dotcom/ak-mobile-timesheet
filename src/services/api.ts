import axios from "axios";
import { TimesheetEntry, EmployeeProfile, ProjectSite } from "../types/timesheet.types";

const API_BASE_URL = "https://ravi-bkj6.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ak_mobile_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock / Initial Data matching the user's provided screens
export const DEFAULT_SUPERVISOR: EmployeeProfile = {
  id: "emp-1782",
  empId: "1782",
  name: "Annamalai ANNADURAI",
  designation: "Supervisor",
  company: "VSL MI",
  joiningDate: "19/08/2026",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=250&q=80",
};

export const MOCK_PROJECTS: ProjectSite[] = [
  { id: "p1", code: "UBR505", name: "TAK CONST G+5P+35+R", location: "Al Barsha South, Dubai" },
  { id: "p2", code: "AK-26-057", name: "TERRA HEIGHT EAST C...", location: "Business Bay, Dubai" },
  { id: "p3", code: "AK-25-904", name: "HKCEG- SOLA PROJECT", location: "Al Jaddaf, Dubai" },
];

export const INITIAL_TIMESHEETS: TimesheetEntry[] = [
  {
    id: "ts-1",
    empId: "1782",
    employeeName: "Annamalai ANNADURAI",
    date: "2026-10-28",
    attendanceStatus: "Present",
    projectCode: "UBR505",
    projectName: "TAK CONST G+5P+35+R",
    regularHrs: 8,
    normalOt: 0,
    holidayOt: 0,
    totalOt: 0,
    totalHours: 8,
    remarks: "Water test",
    approvalStatus: "Pending Approval",
    nextApprover: "Site Engineer (Dharmendran)",
    createdAt: "2026-10-28T16:00:00Z",
  },
  {
    id: "ts-2",
    empId: "1782",
    employeeName: "Annamalai ANNADURAI",
    date: "2026-10-27",
    attendanceStatus: "Present",
    projectCode: "UBR505",
    projectName: "TAK CONST G+5P+35+R",
    regularHrs: 8,
    normalOt: 2,
    holidayOt: 0,
    totalOt: 2,
    totalHours: 10,
    remarks: "Tendon stressing check on Level 4",
    approvalStatus: "Approved",
    nextApprover: "Project Manager (Ravi Kumar)",
    createdAt: "2026-10-27T18:00:00Z",
  },
];

// Offline & Persistent Local Storage Helpers
const STORAGE_KEY = "ak_timesheets_data";

export function getLocalTimesheets(): TimesheetEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TIMESHEETS));
      return INITIAL_TIMESHEETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TIMESHEETS;
  }
}

export function saveLocalTimesheet(entry: Omit<TimesheetEntry, "id">): TimesheetEntry {
  const current = getLocalTimesheets();
  const created: TimesheetEntry = {
    ...entry,
    id: `ts-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return created;
}
