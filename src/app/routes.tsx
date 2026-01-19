import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Dashboard from "@/pages/dashboard";
import TaskManager from "@/pages/task-manager";
import CreateTask from "@/pages/task-manager/create";
import TaskDetail from "@/pages/task-manager/[id]";
import NewVisa from "@/pages/task-manager/new-visa";
import DiagnosticReports from "@/pages/diagnostic-reports";
import HelpDesk from "@/pages/help-desk";
import Payments from "@/pages/payments";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import NotFound from "@/pages/not-found";
import Patients from "@/pages/patients";
import PatientDetail from "@/pages/patients/[id]";
import Settings from "@/pages/settings";
import { GeneralSettings } from "@/pages/settings/general";
import { SecuritySettings } from "@/pages/settings/security";
import { MembersSettings } from "@/pages/settings/members";
import Appointments from "@/pages/appointments";
import NewAppointment from "@/pages/appointments/new-visa";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Client Only Routes */}
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout>
              <Appointments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/new-visa"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout>
              <NewAppointment />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Staff-only Routes (Admin, Attorney, Paralegal) */}
      <Route
        path="/task-manager"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <TaskManager />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-manager/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <CreateTask />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-manager/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <TaskDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin-only Routes */}
      <Route
        path="/task-manager/new-visa"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <NewVisa />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Patients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <PatientDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/diagnostic-reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DiagnosticReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help-desk"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <HelpDesk />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={['admin', 'client']}>
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route path="general" element={<GeneralSettings />} />
        <Route path="security" element={<SecuritySettings />} />

        {/* Members settings only for admin */}
        <Route
          path="members"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MembersSettings />
            </ProtectedRoute>
          }
        />
        <Route index element={<Navigate to="/settings/general" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
