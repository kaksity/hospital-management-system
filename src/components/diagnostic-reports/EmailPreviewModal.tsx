"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, X, Mail, User, ShieldCheck } from "lucide-react";
import { emailService, ReportEmailData } from "@/services/emailService";
import { toast } from "sonner";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: any;
  pdfBase64: string;
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  reportData,
  pdfBase64,
}: EmailPreviewModalProps) {
  const [recipientEmail, setRecipientEmail] = useState(reportData?.email || "");
  const [isSending, setIsSending] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState("");

  useEffect(() => {
    if (isOpen && reportData) {
      const summaryText = reportData.reportContent.replace(/<[^>]*>/g, '').substring(0, 300);
      const html = emailService.generateHtmlContent({
        to: [recipientEmail],
        patientName: reportData.patientName,
        reportNumber: reportData.reportNo,
        reportDate: reportData.reportDate,
        physicianName: reportData.physician,
        reportContent: reportData.reportContent,
      }, summaryText);
      setEmailPreviewHtml(html);
    }
  }, [isOpen, reportData, recipientEmail]);

  const handleSend = async () => {
    if (!recipientEmail) {
      toast.error("Please provide a recipient email");
      return;
    }

    try {
      setIsSending(true);
      const data: ReportEmailData = {
        to: [recipientEmail],
        patientName: reportData.patientName,
        reportNumber: reportData.reportNo,
        reportDate: reportData.reportDate,
        physicianName: reportData.physician,
        reportContent: reportData.reportContent,
        attachments: [
          {
            name: `Diagnostic_Report_${reportData.reportNo}.pdf`,
            content: pdfBase64,
          },
        ],
      };

      const result = await emailService.sendReport(data);
      if (result.success) {
        toast.success("Email sent successfully", {
          description: `The report has been dispatched to ${recipientEmail}`,
        });
        onClose();
      }
    } catch (error: any) {
      toast.error("Failed to send email", {
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800">Email Report Preview</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                Review the report notification before sending it to the patient.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Email Settings */}
          <div className="w-full lg:w-80 p-6 space-y-6 border-r bg-white">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sender</Label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">Medical Portal Admin</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="pl-10 h-11 font-medium focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-800">Patient Details</span>
                </div>
                <div className="text-sm space-y-1 font-medium">
                  <div className="text-slate-600">Name: <span className="text-slate-900">{reportData?.patientName}</span></div>
                  <div className="text-slate-600">Case ID: <span className="text-slate-900">{reportData?.requestNo}</span></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Attachments</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-red-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-red-700">PDF</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">
                    Diagnostic_Report_{reportData?.reportNo}.pdf
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body Preview */}
          <div className="flex-1 bg-slate-100 p-6 flex flex-col">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Message Body Preview</Label>
            <ScrollArea className="flex-1 rounded-xl border border-slate-200 bg-white shadow-inner overflow-hidden">
              <div
                className="p-4 transform origin-top scale-[0.85] lg:scale-100"
                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
              />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t flex items-center justify-between sm:justify-between">
          <Button variant="ghost" onClick={onClose} disabled={isSending} className="font-bold text-slate-500 hover:text-slate-700">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="transition-all hover:scale-105 active:scale-95"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending Dispatches...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Final Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
