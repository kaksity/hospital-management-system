import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Dashboard from "@/pages/dashboard";
import TaskManager from "@/pages/task-manager";
import CreateTask from "@/pages/task-manager/create";
import TaskDetail from "@/pages/task-manager/[id]";
import DiagnosticReports from "@/pages/diagnostic-reports";
import CreateDiagnosticReport from "@/pages/diagnostic-reports/create";
import ReportDetail from "@/pages/diagnostic-reports/[id]";
import Communication from "@/pages/communication";
import Payments from "@/pages/payments";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import NotFound from "@/pages/not-found";
import Patients from "@/pages/patients";
import CreatePatient from "@/pages/patients/create";
import ImportPatients from "@/pages/patients/import";
import PatientDetail from "@/pages/patients/[id]";
import Settings from "@/pages/settings";
import { GeneralSettings } from "@/pages/settings/general";
import { SecuritySettings } from "@/pages/settings/security";
import { MembersSettings } from "@/pages/settings/members";
import Appointments from "@/pages/appointments";
import Invoices from "@/pages/invoices";
import Insights from "@/pages/insights";
import Hospitals from "@/pages/hospitals";
import Doctors from "@/pages/doctors";
import RadiologyServices from "@/pages/services";
import ReportTemplates from "@/pages/templates";

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

      {/* Universal Shared Routes */}
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Appointments />
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

      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['admin', 'staff', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <Patients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <CreatePatient />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/import"
        element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout>
              <ImportPatients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'staff', 'attorney', 'paralegal']}>
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
        path="/diagnostic-reports/create"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateDiagnosticReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/diagnostic-reports/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <Communication />
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
        path="/invoices"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <Invoices />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/insights"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Insights />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospitals"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Hospitals />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Doctors />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/services"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <RadiologyServices />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/templates"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <ReportTemplates />
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
