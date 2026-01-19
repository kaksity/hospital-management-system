/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modals/RecordPaymentModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard, Landmark, Receipt, Wallet, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  onRecordPayment: (paymentData: any) => void;
}

export function RecordPaymentModal({ open, onOpenChange, client, onRecordPayment }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");

  const handleRecord = () => {
    const paymentData = {
      amount: parseFloat(amount),
      date: paymentDate,
      method: paymentMethod,
      reference,
      clientId: client.id
    };
    onRecordPayment(paymentData);
    onOpenChange(false);
    // Reset form
    setAmount("");
    setPaymentMethod("");
    setReference("");
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment - {client?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Client Info */}
          <div className="rounded-lg bg-muted p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Case:</span>
                <p className="font-medium">{client?.case}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Balance:</span>
                <p className="font-medium">{formatCurrency(client?.balance)}</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseFloat(value);
                  // Prevent entering amount higher than balance
                  if (numValue > client?.balance) {
                    setAmount(client?.balance.toString());
                  } else {
                    setAmount(value);
                  }
                }}
                className="pl-8"
                placeholder="0.00"
                max={client?.balance}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Maximum amount: {formatCurrency(client?.balance)}</span>
              <span>Remaining: {formatCurrency(client?.balance - (parseFloat(amount) || 0))}</span>
            </div>
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !paymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={paymentDate}
                  onSelect={setPaymentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    Bank Transfer
                  </div>
                </SelectItem>
                <SelectItem value="credit_card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                  </div>
                </SelectItem>
                <SelectItem value="check">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Check
                  </div>
                </SelectItem>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="wire">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Wire Transfer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRecord} 
              disabled={!amount || !paymentMethod || parseFloat(amount) <= 0 || parseFloat(amount) > client?.balance}
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}