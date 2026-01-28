/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Mail, User, ShieldCheck } from "lucide-react";
import { emailService } from "@/services/emailService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SendInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
  onSendInvoice: (invoiceData: any) => void;
  initialSelectedServices?: any[];
}

export function SendInvoiceModal({
  open,
  onOpenChange,
  patient,
  onSendInvoice,
  initialSelectedServices = [],
}: SendInvoiceModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState("");
  const invoiceNumber = useMemo(() => `INV-${Math.floor(Math.random() * 90000) + 10000}`, []);
  const invoiceDate = useMemo(() => format(new Date(), "PPP"), []);

  useEffect(() => {
    if (open && patient?.email) {
      setRecipientEmail(patient.email);
    }
  }, [open, patient?.email]);

  const calculateTotal = () => {
    return initialSelectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  useEffect(() => {
    if (open && patient) {
      const html = emailService.generateInvoiceHtmlContent({
        to: [recipientEmail],
        patientName: patient.name || "Valued Patient",
        invoiceNumber: invoiceNumber,
        invoiceDate: invoiceDate,
        totalAmount: calculateTotal(),
        services: initialSelectedServices.map(s => ({ name: s.name, price: s.price })),
      });
      setEmailPreviewHtml(html);
    }
  }, [open, patient, recipientEmail, initialSelectedServices, invoiceNumber, invoiceDate]);

  const handleSend = async () => {
    if (!recipientEmail) {
      toast.error("Please provide a recipient email");
      return;
    }

    try {
      setIsSending(true);
      await onSendInvoice({
        patientId: patient.id,
        patientName: patient.name,
        services: initialSelectedServices,
        total: calculateTotal(),
        invoiceNumber,
        invoiceDate,
        recipientEmail,
      });
    } catch (error: any) {
      toast.error("Failed to send invoice", {
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl !gap-0">
        <DialogHeader className="px-6 py-5 bg-slate-50 border-b relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col text-left">
              <div className="text-[17px] font-semibold text-slate-800 leading-[22px]">Email Invoice Preview</div>
              <div className="text-[13px] text-slate-500 font-medium">
                Review the invoice notification before sending it to the patient.
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Email Settings */}
          <div className="w-full lg:w-80 p-6 space-y-6 border-r bg-white flex flex-col">
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Sender</Label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-slate-700">billing@broadplacesradiology.com</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Recipient Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="pl-9 h-11"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Patient Details</span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                    <AvatarFallback className={cn("text-xs font-bold text-white", getAvatarBg(patient.name || ""))}>
                      {getAvatarInitials(patient.name || "??")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-slate-800 truncate">{patient.name}</div>
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-tight">
                      <span className="font-semibold text-slate-500 font-mono">{patient.id === 'NEW' ? 'New Patient' : patient.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attachments</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-dashed flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-red-100 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-red-700">PDF</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                    Invoice_{invoiceNumber}.pdf
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-auto border-t">
              <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Total Payable</span>
                <span className="text-sm font-black text-primary">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Email Body Preview */}
          <div className="flex-1 bg-slate-100 p-6 flex flex-col">
            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Email Content Preview</Label>
            <ScrollArea className="flex-1 rounded-xl border bg-white overflow-hidden shadow-inner">
              <div
                className="p-4 transform origin-top scale-[0.85] lg:scale-100"
                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
              />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || initialSelectedServices.length === 0}
            className="min-w-[160px] gap-2"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending Invoice...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}