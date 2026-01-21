/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modals/PaymentDetailsModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, Download, Send, CreditCard, FileText, AlertTriangle, Receipt, User } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormatter";
import { cn } from "@/lib/utils";

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: any;
  client?: any;
  isClientView?: boolean;
}

export function PaymentDetailsModal({
  open,
  onOpenChange,
  payment,
  client,
  isClientView = false
}: PaymentDetailsModalProps) {
  const data = isClientView ? payment : client;
  if (!data) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
      case 'requested':
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
      case 'unpaid':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      pending: "bg-yellow-100 text-yellow-800",
      requested: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      unpaid: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  // Admin view summary
  if (!isClientView && client) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Transaction: {client.id}</DialogTitle>
                <DialogDescription className="font-mono text-xs mt-1">
                  Issued on {formatDate(client.date)} • {client.invoiceNo || "N/A"}
                </DialogDescription>
              </div>
              <Badge className={cn("ml-auto font-bold capitalize text-[10px]", getStatusBadge(client.status))}>
                {client.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Total amount</p>
                <p className="text-xl font-semibold">{formatCurrency(client.totalCost || client.totalFee)}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Collected</p>
                <p className="text-xl font-semibold">{formatCurrency(client.amountPaid || client.paid)}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Balance Due</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(client.balance)}
                </p>
              </div>
            </div>

            {/* Services Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                <Receipt className="h-3 w-3" />
                Services & Line Items
              </h4>
              <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b">
                    <tr>
                      <th className="px-4 py-2">Service Description</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(client.services || []).length > 0 ? (
                      client.services.map((service: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">{service.name}</td>
                          <td className="px-4 py-3 text-right font-mono font-semibold">{formatCurrency(service.price)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground italic text-xs">
                          No service details available
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-muted/30 font-bold border-t">
                    <tr>
                      <td className="px-4 py-2">Total Payable</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(client.totalCost || client.totalFee)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Patient Details Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                <User className="h-3 w-3" />
                Patient Information
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-border/50 bg-background">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Full Name</span>
                  <p className="text-sm font-semibold">{client.name || client.patientName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Patient ID</span>
                  <p className="text-sm font-mono">{client.patientId || client.clientId}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Service Type</span>
                  <p className="text-sm font-medium">{client.case || client.patientType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Registration</span>
                  <p className="text-sm font-medium">{formatDate(client.date)}</p>
                </div>
              </div>
            </div>

            {/* Payment Timeline / History placeholder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Transaction Ledger
                </h4>
              </div>

              <div className="border border-border/50 rounded-xl divide-y bg-background">
                {client.paymentPlan ? (
                  client.paymentPlan.map((payment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full",
                          payment.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                        )}>
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{payment.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {payment.status === 'paid' ? "Completed" : "Scheduled"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(payment.amount)}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(payment.date || payment.dueDate)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-muted/10">
                    <p className="text-xs text-muted-foreground font-medium italic">No detailed ledger entries for this transaction.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 border-t flex justify-end gap-3 bg-muted/30">
            <Button variant="ghost" className="text-xs" onClick={() => onOpenChange(false)}>
              Close Detail View
            </Button>
            <Button variant="outline" className="text-xs gap-2">
              <Receipt className="h-3.5 w-3.5" /> View Receipt
            </Button>
            <Button className="text-xs gap-2">
              <Download className="h-3.5 w-3.5" /> Save PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Client view with single payment
  const showPayNowButton = payment.status === 'requested' || payment.status === 'overdue';
  const isOverdue = payment.status === 'overdue';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isOverdue && <AlertTriangle className="h-5 w-5 text-red-600" />}
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overdue Warning */}
          {isOverdue && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 min-w-4 text-red-600" />
                  <p className="text-sm font-medium text-red-800">
                    This payment is overdue. Please pay immediately to avoid service interruptions.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card>
            <CardContent className="p-4 space-y-3">
              {payment.invoiceNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Invoice Number</span>
                  <span className="font-medium text-[15px]">{payment.invoiceNumber}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Description</span>
                <span className="font-medium text-right text-[15px]">{payment.description}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold text-[15px]">{formatCurrency(payment.amount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusBadge(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {payment.status === 'paid' ? 'Paid Date' : 'Due Date'}
                </span>
                <span className="font-medium text-[15px]">
                  {formatDate(payment.status === 'paid' ? payment.date : payment.dueDate)}
                </span>
              </div>

              {payment.method && payment.method !== 'Pending' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-[15px]">{payment.method}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
            {showPayNowButton && (
              <Button className={isOverdue ? 'bg-red-600 hover:bg-red-700' : ''}>
                <CreditCard className="h-4 w-4" />
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}