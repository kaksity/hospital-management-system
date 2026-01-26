/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payments/ClientPaymentsView.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  CreditCard,
  TrendingUp,
  FileText,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  TriangleAlert,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PaymentDetailsModal } from "../Modals/PaymentDetailsModal";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormatter";

// Helper functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'overdue':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    requested: "bg-yellow-100 text-yellow-800"
  };
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

export function ClientPaymentsView() {
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Client-focused data
  const clientPayments = [
    {
      id: "PAY-001",
      description: "O-1A Visa Application - Initial Retainer",
      amount: 5000,
      date: "2025-01-05",
      status: "paid",
      type: "retainer",
      method: "Credit Card",
      invoiceNumber: "INV-2025-001"
    },
    {
      id: "PAY-002",
      description: "O-1A Visa - Document Review Phase",
      amount: 3000,
      date: "2025-01-20",
      status: "paid",
      type: "service",
      method: "Bank Transfer",
      invoiceNumber: "INV-2025-002"
    },
    {
      id: "PAY-003",
      description: "O-1A Visa - Filing Preparation",
      amount: 2000,
      date: "2025-02-01",
      status: "paid",
      type: "service",
      method: "Credit Card",
      invoiceNumber: "INV-2025-003"
    },
    {
      id: "PAY-004",
      description: "O-1A Visa - USCIS Filing Fee",
      amount: 5000,
      dueDate: "2025-03-15",
      status: "requested",
      type: "filing",
      method: "Pending",
      invoiceNumber: "INV-2025-004"
    },
    {
      id: "PAY-005",
      description: "O-1A Visa - Premium Processing Fee",
      amount: 2500,
      dueDate: "2025-01-10",
      status: "overdue",
      type: "processing",
      method: "Pending",
      invoiceNumber: "INV-2025-005"
    }
  ];

  const paymentRequests = clientPayments.filter(payment => payment.status === "requested");
  const paymentHistory = clientPayments.filter(payment => payment.status === "paid");
  const overduePayments = clientPayments.filter(payment => payment.status === "overdue");

  const handleViewPaymentDetails = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentDetailsModal(true);
  };

  const handlePayNow = (payment: any) => {
    // Handle payment processing
    console.log('Processing payment:', payment);
  };

  const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = paymentRequests.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Payments & Billing</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  History
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">View your payment history and manage outstanding balances.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 h-9 font-bold bg-white">
                <Download className="h-4 w-4" />
                Export Statements
              </Button>
            </div>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total amount Paid", value: totalPaid, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending Payments", value: pendingAmount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Active Requests", value: paymentRequests.length, icon: Bell, color: "text-blue-600", bg: "bg-blue-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
                    <h3 className="text-lg font-bold text-slate-800 tabular-nums leading-none pt-1">
                      {i < 2 ? formatCurrency(stat.value as number) : stat.value}
                    </h3>
                  </div>
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-8">

        {/* Payment Request Notifications */}
        {paymentRequests.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50 shadow-none rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 border border-blue-200 shadow-sm">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-900 italic">Action Required</h3>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">
                      You have {paymentRequests.length} new payment request{paymentRequests.length > 1 ? 's' : ''} to review.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-9 font-bold bg-white text-blue-600 border-blue-200 hover:bg-blue-50">
                  Review & Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Requests Section */}
        {paymentRequests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment Requests</h2>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid gap-4">
              {paymentRequests.map((payment) => (
                <Card key={payment.id} className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <DollarSign className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{payment.description}</h3>
                          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due {formatDate(payment.dueDate!)}</span>
                            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {payment.invoiceNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-4 bg-slate-50/50 md:bg-transparent border-t md:border-t-0 flex items-center justify-between md:justify-end gap-6">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-slate-900">{formatCurrency(payment.amount)}</span>
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-none text-[10px] font-bold mt-1">Requested</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-9 font-bold px-4 gap-2"
                            onClick={() => handlePayNow(payment)}
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 font-bold px-4 bg-white"
                            onClick={() => handleViewPaymentDetails(payment)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {overduePayments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-red-600" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">Overdue Payments</h2>
              <div className="h-px flex-1 bg-red-100" />
            </div>
            <div className="grid gap-4">
              {overduePayments.map((payment) => (
                <Card key={payment.id} className="border-red-100 border-l-4 border-l-red-600 shadow-sm rounded-xl overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{payment.description}</h3>
                          <div className="flex items-center gap-4 text-[11px] font-bold text-red-400 uppercase tracking-tighter mt-0.5">
                            <span>Due {formatDate(payment.dueDate!)}</span>
                            <span>{payment.invoiceNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-4 bg-red-50/10 md:bg-transparent flex items-center justify-between md:justify-end gap-6">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-red-600 underline underline-offset-4 decoration-red-200">{formatCurrency(payment.amount)}</span>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-none text-[10px] font-bold mt-1">Overdue</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-9 font-bold px-4 bg-red-600 hover:bg-red-700 shadow-sm"
                            onClick={() => handlePayNow(payment)}
                          >
                            Pay Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 font-bold px-4 bg-white border-red-100 text-red-800"
                            onClick={() => handleViewPaymentDetails(payment)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payment History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment History</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{payment.description}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-0.5">
                        <span>{formatDate(payment.date)}</span>
                        <span className="opacity-40">•</span>
                        <span>{payment.method}</span>
                        <span className="opacity-40">•</span>
                        <span>{payment.invoiceNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0">
                    <span className="font-black text-slate-900 tabular-nums">{formatCurrency(payment.amount)}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">Paid</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                        onClick={() => handleViewPaymentDetails(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Details Modal */}
        <PaymentDetailsModal
          open={showPaymentDetailsModal}
          onOpenChange={setShowPaymentDetailsModal}
          payment={selectedPayment}
          isClientView={true}
        />
      </div>
    </div>
  );
}