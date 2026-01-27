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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { cn } from "@/lib/utils";
import { formatDateOnly } from "@/utils/dateFormatter";

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
    if (reportData?.email) {
      setRecipientEmail(reportData.email);
    }
  }, [reportData?.email]);

  useEffect(() => {
    if (isOpen && reportData) {
      // Use space-replacement for tags to avoid words sticking together
      const summaryText = (reportData.reportContent || "")
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

      // Formate the date correctly, checking multiple potential fields
      const rawDate = reportData.reportDate || reportData.requestDate || reportData.report_date || reportData.date;
      const formattedDate = rawDate ? formatDateOnly(rawDate) : "N/A";

      const html = emailService.generateHtmlContent({
        to: [recipientEmail],
        patientName: reportData.patientName || "Valued Patient",
        reportNumber: reportData.reportNo || reportData.id || "N/A",
        reportDate: formattedDate,
        physicianName: reportData.physician || reportData.doctor || "Attending Physician",
        examName: reportData.examName || reportData.modality || "Medical Procedure",
        reportContent: reportData.reportContent || "",
      }, summaryText);
      setEmailPreviewHtml(html);
    }
  }, [isOpen, reportData, recipientEmail]);

  const effectivePatientId = reportData?.patientId || reportData?.id || "N/A";

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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl !gap-0">
        <DialogHeader className="px-6 py-5 bg-slate-50 border-b relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <div className="text-[17px] font-semibold text-slate-800 leading-[22px]">Email Report Preview</div>
              <div className="text-[13px] text-slate-500 font-medium">
                Review the report notification before sending it to the patient.
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Email Settings */}
          <div className="w-full lg:w-80 p-6 space-y-6 border-r bg-white">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Sender</Label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">reports@broadplacesradiology.com</span>
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
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Patient Identification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={getPatientAvatarPath(effectivePatientId, reportData?.gender)} alt={reportData?.patientName} />
                    <AvatarFallback className={cn("text-xs font-bold text-white", getAvatarBg(reportData?.patientName || ""))}>
                      {getAvatarInitials(reportData?.patientName || "??")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-slate-800 truncate">{reportData?.patientName}</div>
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-tight">
                      <span className="font-semibold text-slate-500 font-mono">{effectivePatientId}</span>
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
                    Diagnostic_Report_{reportData?.reportNo}.pdf
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body Preview */}
          <div className="flex-1 bg-slate-100 p-6 flex flex-col">
            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Message Body Preview</Label>
            <ScrollArea className="flex-1 rounded-xl border bg-white overflow-hidden">
              <div
                className="p-4 transform origin-top scale-[0.85] lg:scale-100"
                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
              />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
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
