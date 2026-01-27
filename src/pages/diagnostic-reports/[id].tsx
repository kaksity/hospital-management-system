"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { emailService } from "@/services/emailService";
import { pdfService } from "@/services/pdfService";
import { EmailPreviewModal } from "@/components/diagnostic-reports/EmailPreviewModal";
import {
  FileText,
  Download,
  Printer,
  Eye,
  Edit,
  Send,
  Paperclip,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateOnly, formatDateTime } from "@/utils/dateFormatter";
import { cn } from "@/lib/utils";

// Mock Report Data
const mockReport = {
  id: "RAD-2024-5401",
  requestNo: "REQ-90210",
  requestDate: "2024-11-15",
  reportDate: "2024-11-16",
  reportNo: "RAD-2024-5401",
  patientId: "CP778899Q",
  patientName: "Michael Adebayo",
  patientType: "hmo",
  gender: "Male",
  age: 45,
  email: "john.adebayo@email.com",
  hospital: "Evercare Hospital",
  physician: "Dr. Ope Adeyemi",
  dispatchStatus: "sent_to_hospital",
  dispatchedDate: "2024-11-21 14:30",
  dispatchedBy: "Sarah Johnson",
  totalCost: 150000,
  amountPaid: 150000,
  balance: 0,
  status: "approved",
  examType: "MRI",
  examName: "MRI Brain (Contrast)",
  reportContent: `
    <p><strong>MRI BRAIN WITH AND WITHOUT CONTRAST</strong></p>
    <p><br></p>
    <p><strong>CLINICAL INDICATION:</strong> Headache and dizziness.</p>
    <p><br></p>
    <p><strong>TECHNIQUE:</strong> Multiplanar, multisequence MRI of the brain was performed on a 3 Tesla scanner. Pre- and post-contrast sequences were obtained including T1, T2, FLAIR, DWI, and ADC.</p>
    <p><br></p>
    <p><strong>COMPARISON:</strong> None.</p>
    <p><br></p>
    <p><strong>FINDINGS:</strong></p>
    <ul>
      <li>The brain parenchyma demonstrates normal signal intensity. There is normal gray-white matter differentiation.</li>
      <li>No evidence of acute infarct, hemorrhage, or mass lesion is identified.</li>
      <li>The ventricular system and subarachnoid spaces are within normal limits. No midline shift.</li>
      <li>The basal ganglia, thalamus, brainstem, and cerebellum appear unremarkable.</li>
      <li>No abnormal enhancement is noted following administration of gadolinium-based contrast.</li>
      <li>The visualized portions of the skull base and calvarium are intact.</li>
      <li>The major intracranial vessels show normal flow voids.</li>
    </ul>
    <p><br></p>
    <p><strong>IMPRESSION:</strong></p>
    <p><strong>1. Normal MRI of the brain.</strong></p>
    <p><br></p>
    <p><strong>RECOMMENDATION:</strong> None.</p>
  `,
  attachments: [
    { id: 1, name: "MRI_Brain_Images.zip", type: "archive", size: "45.2 MB", uploaded: "2024-11-16 10:30" },
    { id: 2, name: "Lab_Results.pdf", type: "pdf", size: "2.1 MB", uploaded: "2024-11-16 10:32" },
    { id: 3, name: "Patient_Consent_Form.pdf", type: "pdf", size: "1.5 MB", uploaded: "2024-11-16 10:35" },
  ],
  images: [
    { id: 1, name: "Axial_T2_FLAIR.jpg", description: "Axial T2 FLAIR sequence" },
    { id: 2, name: "Sagittal_T1.jpg", description: "Sagittal T1 post-contrast" },
    { id: 3, name: "Coronal_T2.jpg", description: "Coronal T2 weighted" },
  ],
};

export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportData = mockReport;
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [pdfBase64, setPdfBase64] = useState("");

  const handleSendReport = async () => {
    try {
      setIsSendingEmail(true);

      // Generate PDF first to attach to the preview
      const base64 = await pdfService.generateFromElement('report-pdf-content', {
        filename: `Report_${reportData.reportNo}.pdf`
      });
      setPdfBase64(base64);
      setIsPreviewModalOpen(true);
    } catch (error: any) {
      console.error('PDF Gen Error:', error);
      toast.error("Failed to prepare report for sending", {
        description: error.message
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrint = async () => {
    try {
      toast.info("Preparing PDF for printing...");
      const base64 = await pdfService.generateFromElement('report-pdf-content', {
        filename: `Report_${reportData.reportNo}.pdf`
      });

      // Option 1: Trigger browser print
      const blob = await fetch(`data:application/pdf;base64,${base64}`).then(r => r.blob());
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        // Fallback: Download
        const link = document.createElement('a');
        link.href = url;
        link.download = `Report_${reportData.reportNo}.pdf`;
        link.click();
      }
    } catch (error: any) {
      toast.error("Failed to generate print version", {
        description: error.message
      });
    }
  };

  const handleEditReport = () => {
    navigate(`/diagnostic-reports/${id}/edit`);
  };


  const handleDownload = (fileName: string) => {
    // simulate download
  };

  const handleViewImage = (imageName: string) => {
    // simulate view
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight text-slate-800">
                Diagnostic Report: {reportData.reportNo}
              </h1>
              <Badge className={cn(
                "capitalize",
                reportData.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              )}>
                {reportData.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Request ID: {reportData.requestNo}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-muted-foreground">
                Created on {formatDateOnly(reportData.reportDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-9 bg-white border-slate-200" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 bg-white border-slate-200"
            onClick={handleSendReport}
            disabled={isSendingEmail || reportData.status !== 'approved'}
          >
            {isSendingEmail ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {isSendingEmail ? 'Sending...' : 'Send Report'}
          </Button>
          <Button size="sm" className="gap-2 h-9 font-semibold" onClick={handleEditReport}>
            <Edit className="h-3.5 w-3.5" />
            Edit Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Side: Report Content & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Content */}
          <Card id="report-pdf-content" className="border overflow-hidden bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-sm font-semibold tracking-normal text-[#476788]">
                Report Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div
                className="prose prose-slate max-w-none text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: reportData.reportContent }}
              />
            </CardContent>
          </Card>

          {/* Images Grid */}
          <Card className="border overflow-hidden bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-sm font-semibold tracking-normal text-[#476788] flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Clinical Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportData.images.map((image) => (
                  <div key={image.id} className="group border rounded-lg overflow-hidden bg-slate-50 hover:border-primary/50 transition-all">
                    <div className="h-40 bg-slate-200 flex items-center justify-center relative">
                      <FileImage className="h-10 w-10 text-slate-400" />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary" className="h-8 gap-1.5" onClick={() => handleViewImage(image.name)}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">
                        {image.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {image.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Summary Panels */}
        <div className="space-y-6">
          {/* Patient & Request Summary */}
          <Card className="border overflow-hidden bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-sm font-semibold tracking-normal text-[#476788]">
                Patient & Request Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500">Patient Name</span>
                  <span className="text-[13px] font-semibold text-slate-800">{reportData.patientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Gender / Age</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] bg-slate-50 font-bold">
                      {reportData.gender}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-slate-50 font-bold">
                      {reportData.age} Yrs
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Email Address</span>
                  <span className="text-[13px] font-semibold text-slate-600 truncate max-w-[160px]">
                    {reportData.email}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500">Exam Type</span>
                  <span className="text-[13px] font-semibold text-slate-800">{reportData.examType}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500">Exam Name</span>
                  <span className="text-[13px] font-semibold text-slate-800 text-right">{reportData.examName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500">Clinic / Hospital</span>
                  <span className="text-[13px] font-semibold text-slate-800 text-right">{reportData.hospital}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500">Referring Physician</span>
                  <span className="text-[13px] font-semibold text-slate-800">{reportData.physician}</span>
                </div>
              </div>

              <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Dispatch Status</span>
                  <Badge className="text-[10px] bg-blue-50 text-blue-700 border-blue-100 font-bold">
                    {reportData.dispatchStatus.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-2 p-3 bg-slate-50/80 rounded-lg space-y-1.5 border border-slate-100">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-medium">Dispatched on:</span>
                    <span className="font-bold text-slate-700">{formatDateTime(reportData.dispatchedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-medium">Dispatched by:</span>
                    <span className="font-bold text-slate-700">{reportData.dispatchedBy}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Total Exam Cost</span>
                  <span className="text-[13px] font-bold text-slate-800">₦{reportData.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500">Amount Paid</span>
                  <span className="text-[13px] font-bold text-green-600">₦{reportData.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Balance</span>
                  <span className="text-sm font-extrabold text-slate-800 tracking-tight">₦{reportData.balance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border overflow-hidden bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-sm font-semibold tracking-normal text-[#476788] flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({reportData.attachments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {reportData.attachments.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800 truncate max-w-[120px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">
                        {file.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-400 hover:text-primary"
                    onClick={() => handleDownload(file.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <EmailPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        reportData={reportData}
        pdfBase64={pdfBase64}
      />
    </div>
  );
}