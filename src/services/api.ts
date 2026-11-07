import axios from "axios";
import { TimesheetEntry, AuthUser } from "../types/timesheet.types";

export const API_BASE_URL = "https://ravi-bkj6.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Auto-attach token from storage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ak_mobile_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth helpers ──────────────────────────────────────────────────────────────

const AUTH_KEY = "ak_mobile_user";
const TOKEN_KEY = "ak_mobile_token";

export function saveAuth(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, user.token);
}

export function getAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

// ─── API: Login ────────────────────────────────────────────────────────────────

export async function loginApi(email: string, password: string): Promise<AuthUser> {
  const res = await api.post("/auth/login", { email, password });
  // Backend returns { token, user: { id, name, email, role, phone } }
  const data = res.data;
  const user: AuthUser = {
    id: data.user?.id || data.id || "",
    name: data.user?.name || data.name || "",
    email: data.user?.email || data.email || email,
    role: data.user?.role || data.role || "SUPERVISOR",
    phone: data.user?.phone || data.phone || "",
    token: data.token,
  };
  return user;
}

// ─── API: Projects ─────────────────────────────────────────────────────────────

export async function fetchProjects() {
  try {
    const res = await api.get("/projects");
    return (res.data?.projects || res.data || []).map((p: any) => ({
      id: p.id,
      code: p.akJobNo || p.code || p.id,
      name: p.name,
      location: p.location || "",
    }));
  } catch {
    return FALLBACK_PROJECTS;
  }
}

// ─── Fallback / Offline Data ──────────────────────────────────────────────────

export const FALLBACK_PROJECTS = [
  { id: "p1", code: "AK-26-001", name: "Site Project A", location: "Dubai" },
  { id: "p2", code: "AK-26-002", name: "Site Project B", location: "Abu Dhabi" },
];

// ─── API: Save Timesheet to PostgreSQL ────────────────────────────────────────

export async function saveMobileTimesheetApi(payload: {
  date: string;
  attendanceStatus: string;
  projectCode: string;
  regularHrs: number;
  normalOt: number;
  holidayOt: number;
  remarks: string;
}): Promise<TimesheetEntry> {
  const res = await api.post("/attendance/mobile-timesheet", payload);
  const a = res.data.attendance;
  return {
    id:               a.id,
    empId:            "",
    employeeName:     getAuth()?.name || "",
    date:             a.date,
    attendanceStatus: a.attendanceStatus as any,
    projectCode:      a.projectCode || payload.projectCode,
    projectName:      a.projectName || "",
    regularHrs:       a.regularHrs,
    normalOt:         a.normalOt,
    holidayOt:        a.holidayOt,
    totalOt:          a.totalOt,
    totalHours:       a.totalHours,
    remarks:          a.remarks || "",
    approvalStatus:   "Pending Approval",
    nextApprover:     "Site Engineer",
    createdAt:        a.createdAt,
  };
}

// ─── API: Fetch My Timesheets from PostgreSQL ─────────────────────────────────

export async function fetchMyTimesheets(month?: string): Promise<TimesheetEntry[]> {
  try {
    const url = month
      ? `/attendance/my-timesheets?month=${month}`
      : "/attendance/my-timesheets";
    const res = await api.get(url);
    const user = getAuth();
    return (res.data.timesheets || []).map((a: any) => ({
      id:               a.id,
      empId:            user?.id || "",
      employeeName:     user?.name || "",
      date:             a.date,
      attendanceStatus: a.attendanceStatus,
      projectCode:      a.projectCode || "",
      projectName:      a.projectName || "",
      regularHrs:       a.regularHrs,
      normalOt:         a.normalOt,
      holidayOt:        a.holidayOt,
      totalOt:          a.totalOt,
      totalHours:       a.totalHours,
      remarks:          a.remarks || "",
      approvalStatus:   a.approvalStatus || "Pending Approval",
      nextApprover:     "Site Engineer",
      createdAt:        a.createdAt,
    }));
  } catch {
    return getLocalTimesheets();
  }
}

// ─── Offline Timesheet Storage (localStorage fallback) ────────────────────────

const STORAGE_KEY = "ak_timesheets_data";

export function getLocalTimesheets(): TimesheetEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
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
