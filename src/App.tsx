import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TimesheetPage from "./pages/TimesheetPage";
import SelfServicePage from "./pages/SelfServicePage";
import ApprovalsPage from "./pages/ApprovalsPage";
import SettingsPage from "./pages/SettingsPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import SessionExitModal from "./components/security/SessionExitModal";

export default function App() {
  return (
    <Router>
      <SessionExitModal />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/timesheet/new"
          element={
            <PrivateRoute>
              <TimesheetPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/self-service"
          element={
            <PrivateRoute>
              <SelfServicePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/approvals"
          element={
            <PrivateRoute>
              <ApprovalsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
