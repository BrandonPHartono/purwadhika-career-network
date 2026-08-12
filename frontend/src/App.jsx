// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import MainLayout from "./components/layout/MainLayout";

// Auth pages
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// Alumni pages
import DashboardPage from "./pages/alumni/Dashboard";
import JobsPage from "./pages/alumni/Jobs";
import JobDetailPage from "./pages/alumni/JobDetail";
import ApplicationsPage from "./pages/alumni/Applications";
import InterviewPage from "./pages/alumni/Interview";
import EventsPage from "./pages/alumni/Events";
import EventDetailPage from "./pages/alumni/EventDetail";
import ProfilePage from "./pages/alumni/Profile";
import NotificationsPage from "./pages/alumni/Notifications";

// Partner pages
import PartnerDashboardPage from "./pages/partner/Dashboard";
import PostJobPage from "./pages/partner/PostJob";
import CandidatesPage from "./pages/partner/Candidates";
import PipelinePage from "./pages/partner/Pipeline";
import SchedulePage from "./pages/partner/Schedule";
import MessagesPage from "./pages/partner/Messages";
import PartnerEventsPage from "./pages/partner/Events";

// Admin pages
import AdminDashboardPage from "./pages/admin/Dashboard";
import ManageAlumniPage from "./pages/admin/ManageAlumni";
import ManagePartnersPage from "./pages/admin/ManagePartners";
import BroadcastPage from "./pages/admin/Broadcast";
import AnalyticsPage from "./pages/admin/Analytics";
import AgreementsPage from "./pages/admin/Agreements";
import AdminEventsPage from "./pages/admin/Events";

// ── Protected Route Component ──────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ── App Component ──────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes — tanpa sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes — dengan sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect "/" ke "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* ── Alumni Routes ── */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI"]}>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs/:id"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI"]}>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI"]}>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="interviews"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI"]}>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="events"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI", "PARTNER"]}>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="events/:id"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI", "PARTNER"]}>
                <EventDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["ALUMNI"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Partner Routes ── */}
          <Route
            path="partner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <PartnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner/post-job"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner/candidates/:jobId"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner/pipeline/:jobId"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <PipelinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner/schedule"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <SchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner/messages"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="partner/events"
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <PartnerEventsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Admin Routes ── */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/alumni"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ManageAlumniPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/partners"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ManagePartnersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/broadcast"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <BroadcastPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/agreements"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AgreementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/events"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
