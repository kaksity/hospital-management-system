/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/contexts/AuthContext";
import { AdminPaymentsView } from "@/components/payments/AdminPaymentsView";
import { ClientPaymentsView } from "@/components/payments/ClientPaymentsView";

export default function Payments() {
  const { user } = useAuth();

  // Show admin view for admin, client view for everyone else (since only admin and client have access)
  if (user?.role === 'admin') {
    return <AdminPaymentsView />;
  }

  return <ClientPaymentsView />;
}