"use client";

import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Mail,
  Building,
  Stethoscope,
  CreditCard,
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
import { Separator } from "@/components/ui/separator";
import { formatDateOnly, formatDateTime } from "@/utils/dateFormatter";

// Mock Report Data
const mockReport = {
  id: "RAD-2024-5401",
  requestNo: "REQ-90210",
  requestDate: "2024-11-15",
  reportDate: "2024-11-16",
  reportNo: "RAD-2024-5401",
  patientName: "John Adebayo",
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

  const handleEditReport = () => {
    navigate(`/diagnostic-reports/${id}/edit`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (fileName: string) => {
    alert(`Would download: ${fileName}`);
  };

  const handleViewImage = (imageName: string) => {
    alert(`Would open image viewer for: ${imageName}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/diagnostic-reports")}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Diagnostic Report: {reportData.reportNo}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                {reportData.status.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created: {formatDateOnly(reportData.reportDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="h-4 w-4" />
            Send to Patient
          </Button>
          <Button className="gap-2" onClick={handleEditReport}>
            <Edit className="h-4 w-4" />
            Edit Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Content Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Report Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: reportData.reportContent }}
              />
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.images.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden bg-slate-50">
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <FileImage className="h-12 w-12 text-blue-400" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {image.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {image.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleViewImage(image.name)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleDownload(image.name)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Attachments */}
        <div className="space-y-6">
          {/* Patient Summary Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Patient Name</span>
                  <span className="text-sm font-semibold text-slate-800">{reportData.patientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Age / Gender</span>
                  <span className="text-sm font-semibold text-slate-800">{reportData.age} years, {reportData.gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Email</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {reportData.email}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Patient Type</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {reportData.patientType.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Details Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Exam Type</span>
                  <span className="text-sm font-semibold text-slate-800">{reportData.examType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Exam Name</span>
                  <span className="text-sm font-semibold text-slate-800">{reportData.examName}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Hospital</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {reportData.hospital}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Referring Physician</span>
                  <span className="text-sm font-semibold text-slate-800">{reportData.physician}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Attachments ({reportData.attachments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {reportData.attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        {file.type === "pdf" ? (
                          <FileText className="h-5 w-5 text-red-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {file.size} • {formatDateTime(file.uploaded)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(file.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Cost</span>
                  <span className="text-lg font-bold text-slate-800">₦{reportData.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Amount Paid</span>
                  <span className="text-lg font-bold text-green-600">₦{reportData.amountPaid.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <span className="text-sm font-bold text-slate-700">Balance</span>
                  <span className="text-lg font-extrabold text-slate-800">
                    ₦{reportData.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}