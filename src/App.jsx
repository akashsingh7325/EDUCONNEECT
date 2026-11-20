import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { applyTheme, loadSavedTheme } from "./theme";

import StudentLayout from "./layouts/studentslayouts";

import Home from "./pages/home";
import Masters from "./pages/masters";
import Edubot from "./pages/edubot";
import Com from "./pages/community";
import Lib from "./pages/libarey";
import Profile from "./pages/profile";
import Downloads from "./pages/downloads";
import Dpps from "./pages/dpps";
import Login from "./pages/login";
import Settings from "./pages/settings";
import OnlineCourses from "./pages/onlinecourses";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/layouts/AdminLayout";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import DashboardOverview from "./admin/pages/DashboardOverview";
import UserManagement from "./admin/pages/UserManagement";
import AdmissionManagement from "./admin/pages/AdmissionManagement";
import AuditLogs from "./admin/pages/AuditLogs";
import CourseManagement from "./admin/pages/CourseManagement";
import DPPManagement from "./admin/pages/DPPManagement";
import MaterialManagement from "./admin/pages/MaterialManagement";
import LibraryManagement from "./admin/pages/LibraryManagement";
import PaymentManagement from "./admin/pages/PaymentManagement";
import Analytics from "./admin/pages/Analytics";
import AdminRoles from "./admin/pages/AdminRoles";
import AdminSettings from "./admin/pages/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherDashboard from "./pages/TeacherDashboard";

function SessionExpiryRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const redirect = () => navigate("/", { replace: true });
    window.addEventListener("educonnect-session-expired", redirect);
    return () => window.removeEventListener("educonnect-session-expired", redirect);
  }, [navigate]);
  return null;
}

function App() {
  useEffect(() => {
    applyTheme(loadSavedTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const refreshSystemTheme = () => {
      if (loadSavedTheme() === "System") applyTheme("System");
    };
    const refreshSavedTheme = () => applyTheme(loadSavedTheme());

    media.addEventListener("change", refreshSystemTheme);
    window.addEventListener("educonnect-settings-updated", refreshSavedTheme);
    return () => {
      media.removeEventListener("change", refreshSystemTheme);
      window.removeEventListener("educonnect-settings-updated", refreshSavedTheme);
    };
  }, []);

  return (
    <BrowserRouter>
      <SessionExpiryRedirect />
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="admissions" element={<AdmissionManagement />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="dpps" element={<DPPManagement />} />
            <Route path="materials" element={<MaterialManagement />} />
            <Route path="library" element={<LibraryManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} loginPath="/" />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["STUDENT", "TEACHER"]} loginPath="/" allowGuest />}>
          <Route element={<StudentLayout />}>

          <Route path="/home" element={<Home />} />
          <Route path="/masters" element={<Masters />} />
          <Route path="/edubot" element={<Edubot />} />
          <Route path="/community" element={<Com />} />
          <Route path="/libarey" element={<Lib />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/dpps" element={<Dpps />} />
          <Route path="/settings" element={<Settings />} />
      <Route path="/courses" element={<OnlineCourses />} />
      <Route path="/online-courses" element={<OnlineCourses />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;