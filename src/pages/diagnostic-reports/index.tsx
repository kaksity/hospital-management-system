"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Printer,
  Send,
  Download,
  Edit,
  Plus,
  Scan,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Mail,
  MessageCircle,
  Calendar as CalendarIcon,
  X,
  Eye,
  ListFilter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateOnly } from "@/utils/dateFormatter";
import { pdfService } from "@/services/pdfService";
import { EmailPreviewModal } from "@/components/diagnostic-reports/EmailPreviewModal";
import { toast } from "sonner";

type PatientType = "regular" | "private" | "hmo";
type ApprovalStatus = "approved" | "draft" | "pending_review";
type DispatchStatus = "pending" | "sent_to_hospital" | "sent_to_patient";
type PaymentStatus = "paid" | "partial";

interface DiagnosticReport {
  id: string;
  reportNo: string;
  patientName: string;
  patientType: PatientType;
  date: string;
  request: string; // Service type
  consultant: string;
  approvalStatus: ApprovalStatus;
  dispatchStatus: DispatchStatus;
  createdBy: string;
  paymentStatus: PaymentStatus;
  amount: number;
  balance: number;
  gender: string;
}

const mockReports: DiagnosticReport[] = [
  {
    id: "REP-001",
    reportNo: "RAD-2024-5401",
    patientName: "John Adebayo",
    patientType: "hmo",
    date: "2024-11-20",
    request: "MRI Brain (Contrast)",
    consultant: "Dr. Ope Adeyemi",
    approvalStatus: "approved",
    dispatchStatus: "sent_to_hospital",
    createdBy: "Sarah Johnson",
    paymentStatus: "paid",
    amount: 150000,
    balance: 0,
    gender: "Male",
  },
  {
    id: "REP-002",
    reportNo: "RAD-2024-5402",
    patientName: "Maria Garcia",
    patientType: "private",
    date: "2024-11-20",
    request: "CT Chest",
    consultant: "Dr. Michael Chen",
    approvalStatus: "draft",
    dispatchStatus: "pending",
    createdBy: "Sarah Johnson",
    paymentStatus: "partial",
    amount: 85000,
    balance: 35000,
    gender: "Female",
  },
  {
    id: "REP-003",
    reportNo: "RAD-2024-5403",
    patientName: "James Wilson",
    patientType: "regular",
    date: "2024-11-19",
    request: "Ultrasound Pelvis",
    consultant: "Dr. Sarah Johnson",
    approvalStatus: "approved",
    dispatchStatus: "pending",
    createdBy: "Michael Chen",
    paymentStatus: "paid",
    amount: 45000,
    balance: 0,
    gender: "Male",
  },
  {
    id: "REP-004",
    reportNo: "RAD-2024-5404",
    patientName: "Lisa Wang",
    patientType: "hmo",
    date: "2024-11-18",
    request: "Gastroscopy",
    consultant: "Dr. Michael Chen",
    approvalStatus: "pending_review",
    dispatchStatus: "pending",
    createdBy: "Admin User",
    paymentStatus: "paid",
    amount: 120000,
    balance: 0,
    gender: "Female",
  },
];

const consultants = ["Dr. Ope Adeyemi", "Dr. Michael Chen", "Dr. Sarah Johnson"];
const examTypes = ["MRI", "CT Scan", "Ultrasound", "Gastroscopy", "X-Ray"];
const dispatchStatuses = ["pending", "sent_to_hospital", "sent_to_patient"];

export default function DiagnosticReports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedReports, setCollapsedReports] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter States
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [selectedConsultant, setSelectedConsultant] = useState<string>("all");
  const [selectedDispatchStatus, setSelectedDispatchStatus] = useState<string>("all");
  const [consultantSearch, setConsultantSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [pdfBase64, setPdfBase64] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = async (report: any) => {
    try {
      toast.info("Generating PDF for " + report.reportNo);
      setIsGenerating(true);

      // Since we don't have the full report content in the table, 
      // we generate a clean professional version using simple PDF for now 
      // or a mock HTML template.
      const mockFullContent = `<p><strong>${report.request} REPORT</strong></p><p>Patient: ${report.patientName}</p><p>Status: ${report.approvalStatus}</p><p>Technique: Standard protocol was followed for ${report.request}.</p><p>Findings: Clinical findings are consistent with ${report.request} results.</p>`;

      const base64 = await pdfService.generateSimplePDF(mockFullContent, {
        ...report,
        physicianName: report.consultant
      });

      const blob = await fetch(`data:application/pdf;base64,${base64}`).then(r => r.blob());
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error: any) {
      toast.error("Failed to generate PDF", { description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async (report: any) => {
    try {
      setIsGenerating(true);
      toast.info("Preparing dispatch...");

      const mockFullContent = `<h3><strong>${report.request}</strong></h3><p>Dear ${report.patientName}, your diagnostic report is ready for your review. Please find the attached PDF document for full details.</p>`;

      const base64 = await pdfService.generateSimplePDF(mockFullContent, {
        ...report,
        physicianName: report.consultant
      });

      setSelectedReport({
        ...report,
        reportContent: mockFullContent,
        physician: report.consultant,
        email: report.email || "patient@example.com" // Placeholder email
      });
      setPdfBase64(base64);
      setIsPreviewModalOpen(true);
    } catch (error: any) {
      toast.error("Failed to prepare email", { description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredReports = useMemo(() => {
    return mockReports.filter(report => {
      const matchesSearch =
        report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.consultant.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExam = selectedExamType === "all" || report.request.includes(selectedExamType);
      const matchesConsultant = selectedConsultant === "all" || report.consultant === selectedConsultant;
      const matchesDispatch = selectedDispatchStatus === "all" || report.dispatchStatus === selectedDispatchStatus;

      // Date filtering
      const reportDate = new Date(report.date);
      const matchesStartDate = !startDate || reportDate >= startDate;
      const matchesEndDate = !endDate || reportDate <= endDate;

      return matchesSearch && matchesExam && matchesConsultant && matchesDispatch && matchesStartDate && matchesEndDate;
    });
  }, [searchQuery, selectedExamType, selectedConsultant, selectedDispatchStatus, startDate, endDate]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const getPatientTypeBadge = (type: PatientType) => {
    const variants = {
      regular: "bg-blue-100 text-blue-800",
      private: "bg-purple-100 text-purple-800",
      hmo: "bg-green-100 text-green-800",
    };
    return variants[type];
  };

  const getApprovalStatusBadge = (status: ApprovalStatus) => {
    const variants = {
      approved: "bg-green-100 text-green-800 border-none",
      draft: "bg-slate-100 text-slate-700 border-none",
      pending_review: "bg-amber-100 text-amber-800 border-none",
    };
    const labels = {
      approved: "Approved",
      draft: "Draft",
      pending_review: "Pending Review",
    };
    return (
      <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-bold border", variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getDispatchStatusBadge = (status: DispatchStatus) => {
    const variants = {
      pending: "bg-slate-100 text-slate-800",
      sent_to_hospital: "bg-blue-100 text-blue-800",
      sent_to_patient: "bg-indigo-100 text-indigo-800",
    };
    const labels = {
      pending: "Pending",
      sent_to_hospital: "To Hospital",
      sent_to_patient: "To Patient",
    };
    return (
      <Badge className={cn("text-[10px] px-2 py-0.5 font-bold border-none", variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variants = {
      paid: "bg-emerald-100 text-emerald-800",
      partial: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge className={cn("text-[10px] capitalize px-2 py-0.5 font-bold border-none", variants[status])}>
        {status === "paid" ? "Paid" : "Partial"}
      </Badge>
    );
  };

  const filteredConsultantsList = consultants.filter(c =>
    c.toLowerCase().includes(consultantSearch.toLowerCase())
  );

  const totalReports = mockReports.length;
  const approvedReports = mockReports.filter(r => r.approvalStatus === 'approved').length;
  const pendingReviewReports = mockReports.filter(r => r.approvalStatus === 'pending_review').length;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section with White Background */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Diagnostic Reports</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {totalReports}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Manage and track patient diagnostic reports and dispatch status.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Summary Cards */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50/70 border border-[#8bd5af]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Approved</span>
                <div className="h-5 px-1.5 min-w-[20px] bg-emerald-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold leading-none">
                  {approvedReports}
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-50/70 border border-[#f0d695]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
                <div className="h-5 px-1.5 min-w-[20px] bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold leading-none">
                  {pendingReviewReports}
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              <Button onClick={() => navigate("/diagnostic-reports/create")} size="sm" className="gap-2 h-9 font-bold shadow-sm px-4">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </div>
          </div>

          {/* Search + Filters Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reports by patient or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-0 border border-input rounded-lg overflow-hidden bg-white h-10">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-semibold text-[13px] gap-2 rounded-none border-none", !startDate && "text-slate-700")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <div className="w-px h-4 bg-slate-200 shrink-0" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-semibold text-[13px] gap-2 rounded-none border-none", !endDate && "text-slate-700")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <>
                    <div className="w-px h-4 bg-slate-200 shrink-0" />
                    <Button variant="ghost" size="icon" className="h-full w-10 text-slate-400 hover:text-slate-600 rounded-none font-bold" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 px-3 text-sm font-medium bg-white border gap-2 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-700 border-r border-slate-200 pr-2 mr-1">
                      <ListFilter className="h-4 w-4" />
                      <span className="text-sm font-semibold">Filter by</span>
                    </div>
                    {(selectedExamType !== "all" || selectedConsultant !== "all" || selectedDispatchStatus !== "all") && (
                      <Badge variant="secondary" className="mr-1 h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-bold">
                        {[selectedExamType, selectedConsultant, selectedDispatchStatus].filter(v => v !== "all").length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] p-2">
                  <div className="space-y-4 p-2">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Exam Type</p>
                      <div className="flex flex-wrap gap-1">
                        {["all", ...examTypes].map((type) => (
                          <Badge
                            key={type}
                            variant={selectedExamType === type ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer text-[10px] capitalize",
                              selectedExamType === type ? "bg-primary text-white border-primary" : "hover:bg-slate-50 border-slate-200"
                            )}
                            onClick={() => setSelectedExamType(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultant</p>
                      <div className="relative mb-2">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Search consultant..."
                          className="h-8 pl-8 text-[11px] font-medium"
                          value={consultantSearch}
                          onChange={(e) => setConsultantSearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-[120px] overflow-y-auto px-1 space-y-1 custom-scrollbar">
                        {["all", ...filteredConsultantsList].map((c) => (
                          <div
                            key={c}
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-semibold capitalize",
                              selectedConsultant === c && "bg-primary/5 text-primary"
                            )}
                            onClick={() => setSelectedConsultant(c)}
                          >
                            {c}
                            {selectedConsultant === c && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dispatch Status</p>
                      <div className="flex flex-col gap-1">
                        {["all", ...dispatchStatuses].map((status) => (
                          <div
                            key={status}
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-semibold capitalize",
                              selectedDispatchStatus === status && "bg-primary/5 text-primary"
                            )}
                            onClick={() => setSelectedDispatchStatus(status)}
                          >
                            {status.replace(/_/g, " ")}
                            {selectedDispatchStatus === status && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <Button
                      variant="ghost"
                      className="w-full h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedExamType("all");
                        setSelectedConsultant("all");
                        setSelectedDispatchStatus("all");
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                    >
                      <X className="h-3 w-3 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[48px] text-[11px] font-bold uppercase tracking-wider text-slate-600"></TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Report No.</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Patient Name</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Date</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Request</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Consultant</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Approval</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Created By</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report) => {
                const isCollapsed = collapsedReports[report.id] ?? true;
                const isPartial = report.paymentStatus === "partial";

                return (
                  <React.Fragment key={report.id}>
                    <TableRow
                      className={cn(
                        "cursor-pointer transition-colors h-16",
                        !isCollapsed ? "bg-slate-50/70" : "hover:bg-slate-50/30"
                      )}
                      onClick={() => setCollapsedReports(prev => ({ ...prev, [report.id]: !isCollapsed }))}
                    >
                      <TableCell className="pl-6">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:bg-transparent">
                          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <code className="text-[11px] font-semibold font-mono text-slate-700 bg-slate-100 border border-slate-200/50 px-2 py-1 rounded">
                          {report.reportNo}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={getPatientAvatarPath(report.id, report.gender)} alt={report.patientName} />
                            <AvatarFallback className={cn("text-[12px] font-semibold text-white", getAvatarBg(report.patientName))}>
                              {getAvatarInitials(report.patientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-sm text-slate-800 truncate">{report.patientName}</span>
                            <Badge className={cn("w-fit px-1.5 py-0 h-4 text-[10px] font-semibold capitalize border-none", getPatientTypeBadge(report.patientType))}>
                              {report.patientType}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[13px] font-semibold text-slate-700">{formatDateOnly(report.date)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold text-slate-700 tracking-tight">{report.request}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[13px] text-slate-700 font-semibold truncate max-w-[150px]" title={report.consultant}>
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Stethoscope className="h-3 w-3 text-slate-500" />
                          </div>
                          {report.consultant}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getApprovalStatusBadge(report.approvalStatus)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold">{report.createdBy}</span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()} className="pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[190px]">
                            <DropdownMenuItem onClick={() => navigate(`/diagnostic-reports/${report.id}`)} className="gap-2 font-medium text-sm">
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              View Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/diagnostic-reports/${report.id}/edit`)} className="gap-2 font-medium text-sm">
                              <Edit className="h-3.5 w-3.5 text-slate-500" />
                              Edit Report
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handlePrint(report)}
                              className="gap-2 font-medium text-sm"
                              disabled={isPartial || isGenerating}
                            >
                              <Printer className="h-3.5 w-3.5 text-slate-500" />
                              Print Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSendEmail(report)}
                              className="gap-2 font-medium text-sm"
                              disabled={isGenerating}
                            >
                              <Mail className="h-3.5 w-3.5 text-slate-500" />
                              Send via Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-medium text-sm" disabled={isPartial}>
                              <Send className="h-3.5 w-3.5 text-slate-500" />
                              Dispatch
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 font-medium text-sm text-slate-600" disabled={isPartial}>
                              <Download className="h-3.5 w-3.5" />
                              Export PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {!isCollapsed && (
                      <TableRow className="hover:bg-transparent border-none">
                        <TableCell colSpan={9} className="p-0 bg-white">
                          <div className="bg-slate-50/40 border-b border-border py-6 px-16 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="grid grid-cols-5 gap-12">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Dispatch Status</span>
                                <div>{getDispatchStatusBadge(report.dispatchStatus)}</div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Total Amount</span>
                                <span className="text-sm font-semibold text-slate-800 tabular-nums">₦{report.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Balance Due</span>
                                <span className={cn("text-sm font-semibold tabular-nums text-slate-400", report.balance > 0 && "text-red-500 font-extrabold")}>
                                  ₦{report.balance.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Payment Status</span>
                                <div>{getPaymentStatusBadge(report.paymentStatus)}</div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Processed By</span>
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center border border-white shadow-sm shrink-0">
                                    <span className="text-[10px] font-bold text-slate-600">{report.createdBy.charAt(0)}</span>
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 truncate">{report.createdBy}</span>
                                </div>
                              </div>
                            </div>
                            {isPartial && (
                              <div className="mt-6 flex items-center gap-2.5 bg-amber-50 border border-amber-100/50 px-3 py-2 rounded-lg inline-flex">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
                                  Dispatch & Print options hidden due to pending payment
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>

          {filteredReports.length > itemsPerPage && (
            <div className="flex items-center border-t border-slate-100 justify-between px-6 py-4 bg-white">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hidden lg:flex bg-white shadow-none border-slate-200"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white shadow-none border-slate-200"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-[13px] font-bold text-slate-700 px-3">
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white shadow-none border-slate-200"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hidden lg:flex bg-white shadow-none border-slate-200"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Showing <span className="text-slate-700">{startIndex + 1}</span> - <span className="text-slate-700">{Math.min(startIndex + itemsPerPage, filteredReports.length)}</span> of <span className="text-slate-700">{filteredReports.length}</span> Reports
              </div>
            </div>
          )}

          {filteredReports.length === 0 && (
            <div className="p-24 text-center bg-white flex flex-col items-center justify-center transition-all animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                <FileText className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No reports found</h3>
              <p className="text-slate-500 mt-2 max-w-sm text-sm font-medium leading-relaxed">
                We couldn't find any diagnostic reports matching your search criteria. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                className="mt-8 font-bold border-slate-200 shadow-sm px-8 hover:bg-slate-50"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedExamType("all");
                  setSelectedConsultant("all");
                  setSelectedDispatchStatus("all");
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
              >
                Reset Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
      <EmailPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        reportData={selectedReport}
        pdfBase64={pdfBase64}
      />
    </div>
  );
}