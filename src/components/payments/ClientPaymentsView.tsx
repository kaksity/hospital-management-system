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
  TriangleAlert
} from "lucide-react";
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">View your payment history and outstanding balances</p>
        </div>
        {/* <Button>
          <Download className="h-4 w-4" />
          Export Statements
        </Button> */}
      </div>

      {/* Payment Request Notifications */}
      {paymentRequests.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">New Payment Request</h3>
                  <p className="text-sm text-blue-700">
                    You have {paymentRequests.length} new payment request{paymentRequests.length > 1 ? 's' : ''} to review
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <CardDescription>Total Paid</CardDescription>
            </div>
            <CardTitle className="text-2xl">
              {formatCurrency(paymentHistory.reduce((sum, payment) => sum + payment.amount, 0))}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <CardDescription>Pending Payments</CardDescription>
            </div>
            <CardTitle className="text-2xl">
              {formatCurrency(paymentRequests.reduce((sum, payment) => sum + payment.amount, 0))}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <CardDescription>Payment Requests</CardDescription>
            </div>
            <CardTitle className="text-2xl">
              {paymentRequests.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Payment Requests Section */}
      {paymentRequests.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Payment Requests</h2>
          <div className="grid gap-4">
            {paymentRequests.map((payment) => (
              <Card key={payment.id} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{payment.description}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Due: {formatDate(payment.dueDate!)}</span>
                        <span>Invoice: {payment.invoiceNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg">{formatCurrency(payment.amount)}</span>
                      <Badge className={getStatusBadge(payment.status)}>
                        Payment Requested
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="secondary"
                          onClick={() => handlePayNow(payment)}
                        >
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPaymentDetails(payment)}
                        >
                          <FileText className="h-4 w-4" />
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
        <div className="space-y-3">
          <div className="flex gap-1 items-center">
            <TriangleAlert className="w-4 h-4 text-red-600" />
            <h2 className="text-lg font-semibold text-red-600">Overdue Payments</h2>
          </div>
          <div className="grid gap-4">
            {overduePayments.map((payment) => (
              <Card key={payment.id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-red-900">{payment.description}</h3>
                      <div className="flex items-center gap-4 text-sm text-red-700">
                        <span>Due date: {formatDate(payment.dueDate!)}</span>
                        <span>Invoice: {payment.invoiceNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg text-red-600">{formatCurrency(payment.amount)}</span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Overdue
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handlePayNow(payment)}
                        >
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPaymentDetails(payment)}
                        >
                          <FileText className="h-4 w-4" />
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
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Payment History</h2>
        <div className="grid gap-4">
          {paymentHistory.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{payment.description}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Paid: {formatDate(payment.date)}</span>
                      <span>Method: {payment.method}</span>
                      <span>Invoice: {payment.invoiceNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                    <Badge className={getStatusBadge(payment.status)}>
                      Paid
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPaymentDetails(payment)}
                    >
                      <FileText className="h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
  );
}