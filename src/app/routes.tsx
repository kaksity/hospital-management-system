import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Dashboard from "@/pages/dashboard";
import TaskManager from "@/pages/task-manager";
import CreateTask from "@/pages/task-manager/create";
import EditTask from "@/pages/task-manager/edit";
import DiagnosticReports from "@/pages/diagnostic-reports";
import CreateDiagnosticReport from "@/pages/diagnostic-reports/create";
import ReportDetail from "@/pages/diagnostic-reports/[id]";
import Communication from "@/pages/communication";
import Payments from "@/pages/payments";
import RecordPayment from "@/pages/payments/record";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import NotFound from "@/pages/not-found";
import Patients from "@/pages/patients";
import CreatePatient from "@/pages/patients/create";
import ImportPatients from "@/pages/patients/import";
import PatientDetail from "@/pages/patients/[id]";
import Settings from "@/pages/settings";
import { GeneralSettings } from "@/pages/settings/general";
import { AccountSettings } from "@/pages/settings/account";
import { SecuritySettings } from "@/pages/settings/security";
import { MembersSettings } from "@/pages/settings/members";
import { CommunicationsSettings } from "@/pages/settings/communications";
import { NotificationsSettings } from "@/pages/settings/notifications";
import { PaymentsSettings } from "@/pages/settings/payments";
import { DataSettings } from "@/pages/settings/data";
import Appointments from "@/pages/appointments";
import Invoices from "@/pages/invoices";
import CreateInvoice from "@/pages/invoices/create";
import Insights from "@/pages/insights";
import Hospitals from "@/pages/hospitals";
import Doctors from "@/pages/doctors";
import RadiologyServices from "@/pages/services";
import ReportTemplates from "@/pages/templates";
import CreateTemplate from "@/pages/templates/create";
import EditTemplate from "@/pages/templates/edit";
import EditDiagnosticReport from "@/pages/diagnostic-reports/edit";
import AmbulanceRequests from "@/pages/ambulance";

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
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service', 'doctor', 'accounts', 'mortuary']}>
            <DashboardLayout>
              <TaskManager />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-manager/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service', 'doctor', 'accounts', 'mortuary']}>
            <DashboardLayout>
              <CreateTask />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-manager/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service', 'doctor', 'accounts', 'mortuary']}>
            <DashboardLayout>
              <EditTask />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service', 'doctor', 'accounts', 'mortuary']}>
            <DashboardLayout>
              <Patients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service']}>
            <DashboardLayout>
              <CreatePatient />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/import"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service']}>
            <DashboardLayout>
              <ImportPatients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'customer_service', 'doctor', 'accounts', 'mortuary']}>
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
        path="/diagnostic-reports/:id/edit"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditDiagnosticReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute allowedRoles={['admin', 'customer_service', 'doctor']}>
            <DashboardLayout>
              <Communication />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={['admin', 'accounts']}>
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/record/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <RecordPayment />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute allowedRoles={['admin', 'accounts']}>
            <DashboardLayout>
              <Invoices />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'accounts']}>
            <DashboardLayout>
              <CreateInvoice />
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
          <ProtectedRoute allowedRoles={['admin', 'lab', 'doctor']}>
            <DashboardLayout>
              <ReportTemplates />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'doctor']}>
            <DashboardLayout>
              <CreateTemplate />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'doctor']}>
            <DashboardLayout>
              <EditTemplate />
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
        <Route path="account" element={<AccountSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="communications" element={<CommunicationsSettings />} />
        <Route path="notifications" element={<NotificationsSettings />} />
        <Route path="payments" element={<PaymentsSettings />} />
        <Route path="data" element={<DataSettings />} />

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

      <Route
        path="/ambulance"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'customer_service']}>
            <DashboardLayout>
              <AmbulanceRequests />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
