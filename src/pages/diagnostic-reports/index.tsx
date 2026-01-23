"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateOnly, formatDateTime } from "@/utils/dateFormatter";

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

  // Filter States
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [selectedConsultant, setSelectedConsultant] = useState<string>("all");
  const [selectedDispatchStatus, setSelectedDispatchStatus] = useState<string>("all");
  const [consultantSearch, setConsultantSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
      approved: "bg-green-100 text-green-800",
      draft: "bg-slate-100 text-slate-800",
      pending_review: "bg-yellow-100 text-yellow-800",
    };
    const labels = {
      approved: "Approved",
      draft: "Draft",
      pending_review: "Pending Review",
    };
    return (
      <Badge className={cn("capitalize", variants[status])}>
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
      sent_to_hospital: "Sent to Hospital",
      sent_to_patient: "Sent to Patient",
    };
    return (
      <Badge className={cn("text-[10px]", variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge className={cn("text-[10px] capitalize", variants[status])}>
        {status === "paid" ? "Paid" : "Partial Payment"}
      </Badge>
    );
  };

  const filteredConsultantsList = consultants.filter(c =>
    c.toLowerCase().includes(consultantSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Diagnostic Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all patient diagnostic reports and their dispatch status</p>
        </div>
        <Button onClick={() => navigate("/diagnostic-reports/create")}>
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, report no, or keywords..."
            className="pl-9 h-10 border-muted-foreground/20 bg-background focus-visible:ring-primary/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-0 border border-muted-foreground/20 rounded-md overflow-hidden bg-background h-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-normal gap-2 rounded-none border-none", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="h-4 w-4" />
                  {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>

            <div className="w-px h-4 bg-muted-foreground/20 shrink-0" />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-normal gap-2 rounded-none border-none", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="h-4 w-4" />
                  {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>

            {(startDate || endDate) && (
              <>
                <div className="w-px h-4 bg-muted-foreground/20 shrink-0" />
                <Button variant="ghost" size="icon" className="h-full w-10 text-muted-foreground hover:text-foreground rounded-none" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Combined Filter Dropdown (Consistency with Task Manager) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-3 text-sm font-medium bg-background border-muted-foreground/20 gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">Filters</span>
                {(selectedExamType !== "all" || selectedConsultant !== "all" || selectedDispatchStatus !== "all") && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-bold">
                    {[selectedExamType, selectedConsultant, selectedDispatchStatus].filter(v => v !== "all").length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] p-2">
              <div className="space-y-4 p-2">
                {/* Exam Type */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Exam Type</p>
                  <div className="flex flex-wrap gap-1">
                    {["all", ...examTypes].map((type) => (
                      <Badge
                        key={type}
                        variant={selectedExamType === type ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer text-[10px] capitalize",
                          selectedExamType === type ? "bg-secondary" : "hover:bg-slate-50"
                        )}
                        onClick={() => setSelectedExamType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Consultant */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultant</p>
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      placeholder="Search consultant..."
                      className="h-8 pl-8 text-[8px]"
                      value={consultantSearch}
                      onChange={(e) => setConsultantSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[120px] overflow-y-auto px-1 space-y-1 custom-scrollbar">
                    {["all", ...filteredConsultantsList].map((c) => (
                      <div
                        key={c}
                        className={cn(
                          "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-medium capitalize",
                          selectedConsultant === c && "bg-primary/5 text-primary font-bold"
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

                {/* Dispatch Status */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dispatch Status</p>
                  <div className="flex flex-col gap-1">
                    {["all", ...dispatchStatuses].map((status) => (
                      <div
                        key={status}
                        className={cn(
                          "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-medium capitalize",
                          selectedDispatchStatus === status && "bg-primary/5 text-primary font-bold"
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

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Report No.</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Consultant</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => {
            const isCollapsed = collapsedReports[report.id] !== false; // Default to collapsed
            const isPartial = report.paymentStatus === "partial";

            return (
              <>
                <TableRow
                  key={report.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    !isCollapsed ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                  )}
                  onClick={() => setCollapsedReports(prev => ({ ...prev, [report.id]: !prev[report.id] }))}
                >
                  <TableCell className="px-6">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                      {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] font-bold font-mono text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full w-fit">
                      {report.reportNo}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-8 w-8 border border-muted shadow-sm">
                        <AvatarImage src={getPatientAvatarPath(report.id, report.gender)} alt={report.patientName} />
                        <AvatarFallback className={cn("text-xs font-semibold text-white", getAvatarBg(report.patientName))}>
                          {getAvatarInitials(report.patientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{report.patientName}</span>
                        <Badge className={cn("capitalize", getPatientTypeBadge(report.patientType))}>
                          {report.patientType}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{formatDateOnly(report.date)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{report.request}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold truncate max-w-[150px]" title={report.consultant}>
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        <Stethoscope className="h-3 w-3 text-primary" />
                      </div>
                      {report.consultant}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getApprovalStatusBadge(report.approvalStatus)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{report.createdBy}</span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem onClick={() => navigate(`/diagnostic-reports/${report.id}`)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/diagnostic-reports/${report.id}/edit`)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                          Edit Report
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isPartial}>
                          <Printer className="h-4 w-4 text-muted-foreground" />
                          Print Report
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Send Report
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isPartial}>
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          Dispatch
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={isPartial}>
                          <Download className="h-4 w-4" />
                          Export as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {!isCollapsed && (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <div>
                        <div className="px-16 py-4 pb-2 grid grid-cols-5 gap-12 bg-white/40">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500">Dispatch Status</span>
                            <span>{getDispatchStatusBadge(report.dispatchStatus)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500">Total Amount</span>
                            <span className="text-sm font-extrabold text-slate-800">₦{report.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500">Balance Due</span>
                            <span className={cn("text-sm font-extrabold", report.balance > 0 ? "text-red-600" : "text-slate-400")}>
                              ₦{report.balance.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500">Payment Status</span>
                            <span>{getPaymentStatusBadge(report.paymentStatus)}</span>
                          </div>
                          <div className="flex flex-col">
                            <div>
                              <p className="text-xs font-semibold text-slate-500">Created By</p>
                              <div className="flex gap-2 items-center">
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                  <span className="text-xs font-bold text-primary">{report.createdBy.charAt(0)}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-700">{report.createdBy}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isPartial && (
                          <div className="flex items-start gap-2 bg-orange-50/50 p-3 rounded-lg mb-2">
                            <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-orange-800 leading-relaxed font-semibold">
                              This report is held as a draft due to partial payment. Complete payment to enable dispatch and approval options.
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>

      {filteredReports.length === 0 && (
        <div className="p-20 text-center bg-white flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 ring-8 ring-slate-50/50">
            <FileText className="h-10 w-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No reports found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            We couldn't find any diagnostic reports matching your search criteria. Try using different keywords or filters.
          </p>
          <Button variant="outline" className="mt-8 font-bold border-slate-200" onClick={() => {
            setSearchQuery("");
            setSelectedExamType("all");
            setSelectedConsultant("all");
            setSelectedDispatchStatus("all");
            setStartDate(undefined);
            setEndDate(undefined);
          }}>
            Clear Search & Filters
          </Button>
        </div>
      )}
    </div>
  );
}