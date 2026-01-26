/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { isAfter, subDays, startOfWeek, endOfWeek } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  FileDown,
  Upload,
  ReceiptText,
  Calendar,
  MessageSquare,
  Archive,
  RotateCcw,
  Users,
  UserPlus,
  Activity,
  CalendarCheck,
  ArrowUpRight,
  ListFilter
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EditPatientModal } from "@/components/Modals/EditPatientModal";
import { SendInvoiceModal } from "@/components/Modals/SendInvoiceModal";
import { ScheduleAppointmentModal } from "@/components/Modals/ScheduleAppointmentModal";
import { SendMessageModal } from "@/components/Modals/SendMessageModal";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { patients as initialPatients } from "@/data/patients";


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function Patients() {
  const navigate = useNavigate();
  const [patients] = useState(initialPatients);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);



  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      patient.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
      patient.id.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    const matchesTime = () => {
      if (timeFilter === "all") return true;
      const activityDate = new Date(patient.lastActivity);
      const now = new Date();

      if (timeFilter === "this-week") {
        return activityDate >= startOfWeek(now) && activityDate <= endOfWeek(now);
      }
      if (timeFilter === "last-7-days") {
        return isAfter(activityDate, subDays(now, 7));
      }
      if (timeFilter === "last-30-days") {
        return isAfter(activityDate, subDays(now, 30));
      }
      return true;
    };

    return matchesSearch && matchesStatus && matchesTime();
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      archived: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getPatientStatusColor = (status: string) => {
    const colors = {
      active: "#10b981",
      archived: "#ef4444",
      inactive: "#94a3b8"
    };
    return colors[status as keyof typeof colors] || "#94a3b8";
  };

  const handleAddPatient = () => {
    navigate("/patients/create");
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleSendInvoice = (patient: any) => {
    navigate(`/invoices/create?patientId=${patient.id}`);
  };

  const handleScheduleAppointment = (patient: any) => {
    setSelectedPatient(patient);
    setIsScheduleModalOpen(true);
  };

  const handleSendMessage = (patient: any) => {
    setSelectedPatient(patient);
    setIsMessageModalOpen(true);
  };

  const handleRowClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const totalPatients = patients.length;
  const activePatientsCount = patients.filter(p => p.status === 'active').length;
  const newPatientsCount = 24;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section with White Background */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {totalPatients}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Manage the list of patients in the network.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Summary Cards with Gray Badges */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50/70 border border-[#8bd5af]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">New Patients</span>
                <div className="h-5 px-1.5 min-w-[20px] bg-emerald-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold leading-none">
                  {newPatientsCount}
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-violet-50/70 border border-[#c4b8f5]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d30cd]">Active Patients</span>
                <div className="h-5 px-1.5 min-w-[20px] bg-[#934eff] text-white rounded-full flex items-center justify-center text-[10px] font-bold leading-none">
                  {activePatientsCount}
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9 font-semibold text-slate-600 bg-white">
                      <Download className="h-3.5 w-3.5" />
                      Import/Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem className="gap-2" onClick={() => console.log("Exporting CSV...")}>
                      <FileDown className="h-4 w-4 text-muted-foreground" />
                      Export to CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => console.log("Exporting PDF...")}>
                      <FileDown className="h-4 w-4 text-muted-foreground" />
                      Export to PDF
                    </DropdownMenuItem>
                    <div className="h-px bg-muted my-1" />
                    <DropdownMenuItem className="gap-2" onClick={() => navigate("/patients/import")}>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      Import from CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleAddPatient} size="sm" className="gap-2 h-9 font-bold shadow-sm px-4">
                  <Plus className="h-4 w-4" />
                  Add New Patient
                </Button>
              </div>
            </div>
          </div>

          {/* Search + Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search patients by name, ID or email..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-auto h-10 px-3 text-sm font-medium bg-white border gap-2 shadow-none rounded-lg">
                  <div className="flex items-center gap-2 text-slate-700 border-r border-border pr-2 mr-1">
                    <ListFilter className="h-4 w-4" />
                    <span className="text-sm font-semibold">Filter by</span>
                  </div>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-auto h-10 px-3 text-sm font-medium bg-white border gap-2 shadow-none rounded-lg">
                  <div className="flex items-center gap-2 text-slate-700 border-r border-border pr-2 mr-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-semibold">Time</span>
                  </div>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div>
          {patients.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {paginatedPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className="group transition-all duration-300 border border-l-4 cursor-pointer overflow-hidden flex flex-col hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 bg-white"
                    style={{ borderLeftColor: getPatientStatusColor(patient.status) }}
                    onClick={() => handleRowClick(patient.id)}
                  >
                    <CardHeader className="p-4 pb-4">
                      <div className="flex justify-between items-start">
                        <Avatar className="h-10 w-10 border border-slate-100 shadow-sm ring-2 ring-white ring-offset-0">
                          <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                          <AvatarFallback className={cn("text-[13px] font-bold", getAvatarBg(patient.name))}>
                            {getAvatarInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              <DropdownMenuItem asChild>
                                <Link to={`/patients/${patient.id}`} className="flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditPatient(patient)} className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                                Edit Patient
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSendInvoice(patient)} className="flex items-center gap-2">
                                <ReceiptText className="h-4 w-4 text-muted-foreground" />
                                Send Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleAppointment(patient)} className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Schedule Appointment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendMessage(patient)} className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {patient.status === 'archived' ? (
                                <DropdownMenuItem onClick={() => console.log("Unarchiving...")} className="flex items-center gap-2 text-primary">
                                  <RotateCcw className="h-4 w-4" />
                                  Unarchive Patient
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => console.log("Archiving...")} className="flex items-center gap-2 text-destructive">
                                  <Archive className="h-4 w-4" />
                                  Archive Patient
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-semibold text-slate-800 truncate leading-tight transition-colors">
                            {patient.name}
                          </h3>
                          <code className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded leading-none ring-1 ring-slate-200/50 uppercase tracking-tighter">
                            {patient.id}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wide font-bold text-slate-600">
                            {patient.gender === 'Male' ? 'M' : 'F'}
                          </span>
                          <div className="h-1 w-1 rounded-full bg-slate-400" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                            {patient.age} Y/O
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {filteredPatients.length > itemsPerPage && (
                <div className="flex items-center border-t border-slate-200 justify-between px-2 py-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hidden lg:flex bg-white shadow-sm border-slate-200"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-white shadow-sm border-slate-200"
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
                      className="h-8 w-8 bg-white shadow-sm border-slate-200"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hidden lg:flex bg-white shadow-sm border-slate-200"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    Showing <span className="text-slate-800">{startIndex + 1}</span> - <span className="text-slate-800">{Math.min(startIndex + itemsPerPage, filteredPatients.length)}</span> of <span className="text-slate-800">{filteredPatients.length}</span> Entries
                  </div>
                </div>
              )}

              {/* No Patients Found during Search */}
              {filteredPatients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400 border border-slate-200 shadow-inner">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No patients found</h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-8 font-medium">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button variant="outline" className="shadow-sm font-bold" onClick={() => { setGlobalFilter(""); setStatusFilter("all"); setTimeFilter("all"); }}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* System-wide Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl border-2 border-dashed border-slate-200 shadow-sm">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary ring-8 ring-primary/5">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No patients in the system</h2>
              <p className="text-[15px] font-medium text-slate-500 max-w-lg mb-10 text-balance leading-relaxed">
                It appears there are no patient records in the system at the moment.
                Start by adding your first patient or importing existing records.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" variant="outline" className="min-w-[180px] gap-2 font-bold h-12 shadow-sm" onClick={() => navigate("/patients/import")}>
                  <Upload className="h-5 w-5" />
                  Import Records
                </Button>
                <Button size="lg" className="min-w-[180px] gap-2 font-bold h-12 shadow-lg" onClick={() => navigate("/patients/create")}>
                  <Plus className="h-5 w-5" />
                  Add New Patient
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditPatientModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        patient={selectedPatient}
        onSave={(data) => {
          console.log("Saving patient data:", data);
          // Actual update logic would go here
        }}
      />

      <SendInvoiceModal
        open={isInvoiceModalOpen}
        onOpenChange={setIsInvoiceModalOpen}
        patient={selectedPatient}
        onSendInvoice={(data) => {
          console.log("Sending invoice:", data);
          // Actual invoice logic would go here
        }}
      />

      <ScheduleAppointmentModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        patient={selectedPatient}
        onSchedule={(data) => {
          console.log("Scheduling appointment:", data);
          // Actual scheduling logic would go here
        }}
      />

      <SendMessageModal
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        patient={selectedPatient}
        onSendMessage={(data) => {
          console.log("Sending message:", data);
        }}
      />
    </div>
  );
}