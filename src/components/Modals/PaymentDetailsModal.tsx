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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: any;
  client?: any;
  isClientView?: boolean;
  onRecordPayment?: (client: any) => void;
}

export function PaymentDetailsModal({
  open,
  onOpenChange,
  payment,
  client,
  isClientView = false,
  onRecordPayment
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
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-amber-100 text-amber-800",
      pending: "bg-yellow-100 text-yellow-800",
      requested: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  // Admin view summary
  if (!isClientView && client) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-lg">Transaction: {client.id}</div>
                  <Badge className={cn("font-bold capitalize text-[10px]", getStatusBadge(client.status))}>
                    {client.status}
                  </Badge>
                </div>
                <div className="font-semibold text-[11px] uppercase text-slate-500 tracking-widest">
                  Issued on {formatDate(client.date)} • {client.invoiceNo || "N/A"}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 pt-2 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
            {/* Payment Summary Cards */}
            <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 divide-x border-slate-100">
                <div className="p-4">
                  <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total amount</p>
                  <p className="text-xl font-semibold text-slate-900 tabular-nums">{formatCurrency(client.totalCost || client.totalFee)}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Collected</p>
                  <p className="text-xl font-semibold text-emerald-700 tabular-nums">{formatCurrency(client.amountPaid || client.paid)}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Balance Due</p>
                  <p className="text-xl font-semibold text-rose-700 tabular-nums">
                    {formatCurrency(client.balance)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Services Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Services & Line Items
              </h4>
              <div className="border border-input/50 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-[10px] uppercase font-semibold text-slate-500 tracking-wider border-b">
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
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(service.price)}</td>
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
                      <td className="px-4 py-2 text-right font-semibold">{formatCurrency(client.totalCost || client.totalFee)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Patient Details Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Patient Information
              </h4>
              <div className="p-4 rounded-xl border border-input/50 bg-background flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-slate-100">
                  <AvatarImage src={getPatientAvatarPath(client.patientId || client.clientId, client.gender)} alt={client.name || client.patientName} />
                  <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(client.name || client.patientName))}>
                    {getAvatarInitials(client.name || client.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-3 gap-6 flex-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Full Name</span>
                    <p className="text-sm font-semibold text-slate-800">{client.name || client.patientName}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Patient ID</span>
                    <div>
                      <code className="text-[11px] font-semibold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200/50">{client.patientId || client.clientId}</code>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Account Type</span>
                    <p className="text-sm font-semibold text-slate-700">{client.case || client.patientType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Timeline / History placeholder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Transaction Ledger
                </h4>
              </div>

              <div className="border border-input/50 rounded-xl divide-y bg-background">
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
                          <p className="text-[10px] text-slate-500 font-medium">
                            {payment.status === 'paid' ? "Completed" : "Scheduled"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(payment.amount)}</p>
                        <p className="text-[10px] text-slate-500">{formatDate(payment.date || payment.dueDate)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-muted/10">
                    <p className="text-[13px] text-slate-500 font-medium italic">No detailed ledger entries for this transaction.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 pt-4 border-t flex justify-end gap-3 bg-muted/30">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {client.balance > 0 && (
              <Button onClick={() => onRecordPayment?.(client)}>
                <CreditCard className="h-3.5 w-3.5" /> Record New Payment
              </Button>
            )}
            <Button variant="secondary">
              <Download className="h-3.5 w-3.5" /> Download PDF
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