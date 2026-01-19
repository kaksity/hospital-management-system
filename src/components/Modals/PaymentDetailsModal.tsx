/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modals/PaymentDetailsModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, Download, Send, CreditCard, FileText, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormatter";

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
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'requested':
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
      requested: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  // Admin view with client payment plan
  if (!isClientView && client) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details - {client.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Fee</p>
                  <p className="text-lg font-semibold">{formatCurrency(client.totalFee)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(client.paid)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <p className={`text-lg font-semibold ${
                    client.balance > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(client.balance)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Payment History</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                <div className="divide-y">
                  {client.paymentPlan.map((payment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          payment.status === 'paid' ? 'bg-green-100' : 
                          payment.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <p className="font-medium">{payment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.status === 'paid' 
                              ? `Paid on ${formatDate(payment.date)}`
                              : `Due ${formatDate(payment.dueDate)}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        <Badge className={getStatusBadge(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {client.balance > 0 && (
                <Button>
                  <FileText className="h-4 w-4" />
                  Send Invoice
                </Button>
              )}
            </div>
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