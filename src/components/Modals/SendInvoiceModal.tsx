/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modals/SendInvoiceModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SendInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
  onSendInvoice: (amount: number, dueDate: Date) => void;
}

export function SendInvoiceModal({ open, onOpenChange, client, onSendInvoice }: SendInvoiceModalProps) {
  const [amount, setAmount] = useState(client?.balance || 0);
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const handleSend = () => {
    onSendInvoice(amount, dueDate);
    onOpenChange(false);
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Invoice to {client?.name}</DialogTitle>
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
                <p className="font-medium">${client?.balance}</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Invoice Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-8"
                max={client?.balance}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Maximum amount: ${client?.balance}</span>
              <span>Remaining balance: ${(client?.balance - amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} className="gap-2">
              <Send className="h-4 w-4" />
              Send Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}