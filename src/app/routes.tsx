import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Dashboard from "@/pages/dashboard";
import Cases from "@/pages/cases";
import CreateCase from "@/pages/cases/create";
import CaseDetail from "@/pages/cases/[id]";
import NewVisa from "@/pages/cases/new-visa";
import Documents from "@/pages/documents";
import Messages from "@/pages/messages";
import Payments from "@/pages/payments";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import NotFound from "@/pages/not-found";
import Clients from "@/pages/clients";
import ClientDetail from "@/pages/clients/[id]";
import Settings from "@/pages/settings";
import { GeneralSettings } from "@/pages/settings/general";
import { SecuritySettings } from "@/pages/settings/security";
import { MembersSettings } from "@/pages/settings/members";
import Applications from "@/pages/applications";
import NewApplication from "@/pages/applications/new-visa";

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
        path="/applications"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout>
              <Applications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications/new-visa"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout>
              <NewApplication />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Staff-only Routes (Admin, Attorney, Paralegal) */}
      <Route
        path="/cases"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <Cases />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/create"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <CreateCase />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <CaseDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin-only Routes */}
      <Route
        path="/cases/new-visa"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <NewVisa />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <Clients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <ClientDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Documents />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
            <DashboardLayout>
              <Messages />
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
