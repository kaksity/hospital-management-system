/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Plus,
  ReceiptIcon,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  User,
  Mail,
  MoreHorizontal,
  Edit,
  FileText,
  Receipt,
  FileSearch,
  Stethoscope,
  ChevronRight,
  Hospital,
  Ambulance,
  Skull,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { UploadReportModal } from "@/components/Modals/UploadReportModal";
import { RequestAmbulanceModal } from "@/components/Modals/RequestAmbulanceModal";
import { useAmbulanceRequests } from "@/hooks/use-ambulance-requests";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/formatCurrency";


import { patients as initialPatients, Patient, MedicalHistoryEntry } from "@/data/patients";


export default function PatientDetail() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [medicalHistory, setMedicalHistory] = React.useState<MedicalHistoryEntry[]>([]);
  const [newHistoryNote, setNewHistoryNote] = React.useState("");
  const [reports, setReports] = React.useState<any[]>([]);
  const [isUploadReportModalOpen, setIsUploadReportModalOpen] = React.useState(false);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = React.useState(false);
  const { addRequest } = useAmbulanceRequests();

  // Find the patient in our central data store
  const patient = React.useMemo(() => {
    return initialPatients.find(p => p.id === routeId);
  }, [routeId]);

  React.useEffect(() => {
    if (patient) {
        setMedicalHistory(patient.medicalHistory || []);
        
        // Initialize reports
        setReports(patient.pendingTests.length > 0 ? [
          {
            id: `REP-${patient.id}-9921`,
            title: "Medical Analysis",
            type: "Medical Report",
            date: patient.lastActivity,
            status: "Finalized",
            doctor: "Dr. Sarah Johnson"
          }
        ] : []);
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [patient]);

  const handleAddHistory = () => {
    if (!newHistoryNote.trim()) return;
    const newEntry: MedicalHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        addedBy: "Dr. Admin User", // Simulated logged-in doctor
        notes: newHistoryNote.trim()
    };
    setMedicalHistory([newEntry, ...medicalHistory]);
    setNewHistoryNote("");
  };

  const handleUploadReport = (files: File[], metadata: any) => {
    const newReport = {
      id: `REP-${patientData.id}-${Math.floor(Math.random() * 10000)}`,
      title: metadata.title,
      type: metadata.type,
      date: new Date().toISOString(),
      status: "Finalized",
      doctor: "Dr. Admin User"
    };
    setReports([newReport, ...reports]);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-medium">Fetching patient records...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Patient Not Found</h2>
        <p className="text-slate-500 mt-2">The record for ID {routeId} could not be located in the clinical database.</p>
        <Button className="mt-6" asChild>
          <Link to="/patients">Return to Patient List</Link>
        </Button>
      </div>
    );
  }

  // Map central patient data to the detailed view structure
  const patientData = {
    id: patient.id,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    status: patient.status,
    joinedDate: patient.joinedDate,
    lastActivity: patient.lastActivity,
    address: "123 Healthcare Blvd, Lagos, Nigeria", // This would ideally come from the data store too

    clinicalInfo: {
      patientType: patient.patientType,
      gender: patient.gender,
      dob: patient.dob,
      age: patient.age,
      maritalStatus: "Single",
      nationality: "Nigerian",
      bloodGroup: "O+",
      genotype: "AA",
      allergies: ["Penicillin"],
      medications: ["None"],
      history: `${patient.name} has a history of ${patient.lastService || "routine checkups"}.`,
      registeredBy: "Adebayo Olusola",
      preferredCommunication: "WhatsApp"
    },

    // Clinical and Financial history (Mocking these for now but linking to the patient's ID)
    appointments: [
      {
        id: `APT-${patient.id}-001`,
        type: "General Consultation",
        status: "Completed",
        date: patient.lastActivity,
        time: "10:00 AM",
        doctor: "Dr. Sarah Johnson",
        facility: "Main Clinic"
      },
      ... (patient.totalVisits > 1 ? [
        {
          id: `APT-${patient.id}-012`,
          type: "Follow-up Consultation",
          status: "Schedule",
          date: "2025-02-10",
          time: "02:30 PM",
          doctor: "Dr. Michael Chen",
          facility: "Emergency Room"
        }
      ] : [])
    ],

    paymentSummary: {
      totalValue: patient.totalValue,
      paid: patient.totalValue * 0.8,
      balance: patient.totalValue * 0.2,
      nextPaymentDue: "2025-02-15",
      invoices: [
        {
          id: `INV-${patient.id}-1001`,
          name: "Medical Consultation Fee",
          amount: patient.totalValue,
          status: patient.totalValue > 0 ? "paid" : "pending",
          date: patient.lastActivity
        }
      ]
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-100",
      completed: "bg-blue-100 text-blue-800 border-blue-100",
      inactive: "bg-gray-100 text-gray-800 border-gray-100",
      archived: "bg-red-100 text-red-800 border-red-100"
    };
    return cn("capitalize font-semibold", variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800");
  };

  const getAppointmentStatusBadge = (status: string) => {
    const variants = {
      Completed: "bg-green-100 text-green-800",
      Schedule: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fafafa]">
      <Tabs defaultValue="info" className="w-full flex flex-col">
        {/* Profile Header - White Background */}
        <div className="bg-white border-b">
          <div className="px-6 pt-6 space-y-6 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getPatientAvatarPath(patientData.id, patientData.clinicalInfo.gender)} alt={patientData.name} />
                  <AvatarFallback className={cn("text-xl font-bold text-white", getAvatarBg(patientData.name))}>
                    {getAvatarInitials(patientData.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">{patientData.name}</h1>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-semibold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                        {patientData.id}
                      </code>
                      <Badge className={getStatusBadge(patientData.status)}>
                        {patientData.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined {formatDate(patientData.joinedDate)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      <Clock className="h-3.5 w-3.5" />
                      Last Active {formatDate(patientData.lastActivity)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      <User className="h-3.5 w-3.5" />
                      {patientData.clinicalInfo.patientType}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {patient.admissionStatus === "deceased" ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                    <Skull className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-600">Deceased</span>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      onClick={() => setIsAmbulanceModalOpen(true)}
                    >
                      <Ambulance className="h-4 w-4" />
                      Request Ambulance
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-4 gap-2">
                      <Mail className="h-4 w-4" />
                      Send Email
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem className="gap-2 text-sm py-2">
                          <Edit className="h-4 w-4 text-muted-foreground" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm py-2">
                          <CalendarCheck className="h-4 w-4 text-muted-foreground" /> Schedule Visit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-sm py-2">
                          <FileText className="h-4 w-4 text-muted-foreground" /> Export Records
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-sm py-2"
                          onClick={() => navigate(`/invoices/create?patientId=${patientData.id}`)}
                        >
                          <ReceiptIcon className="h-4 w-4 text-muted-foreground" /> Create Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>

            <TabsList variant="line" className="h-auto p-0 bg-transparent gap-8 border-none overflow-x-auto justify-start no-scrollbar">
              <TabsTrigger variant="line" value="info" className="text-sm font-medium px-0 pb-3 h-auto data-[state=active]:text-slate-700 data-[state=active]:font-semibold border-b-2 border-transparent data-[state=active]:border-[hsl(var(--primary))] rounded-none transition-all flex items-center gap-2">
                <User className="h-4 w-4" /> Patient Bio
              </TabsTrigger>
              <TabsTrigger variant="line" value="clinical" className="text-sm font-medium px-0 pb-3 h-auto data-[state=active]:text-slate-700 data-[state=active]:font-semibold border-b-2 border-transparent data-[state=active]:border-[hsl(var(--primary))] rounded-none transition-all flex items-center gap-2">
                <Stethoscope className="h-4 w-4" /> Clinical Info
              </TabsTrigger>
              <TabsTrigger variant="line" value="appointments" className="text-sm font-medium px-0 pb-3 h-auto data-[state=active]:text-slate-700 data-[state=active]:font-semibold border-b-2 border-transparent data-[state=active]:border-[hsl(var(--primary))] rounded-none transition-all flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Clinical Visits
              </TabsTrigger>
              <TabsTrigger variant="line" value="payments" className="text-sm font-medium px-0 pb-3 h-auto data-[state=active]:text-slate-700 data-[state=active]:font-semibold border-b-2 border-transparent data-[state=active]:border-[hsl(var(--primary))] rounded-none transition-all flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Financials
              </TabsTrigger>
              <TabsTrigger variant="line" value="reports" className="text-sm font-medium px-0 pb-3 h-auto data-[state=active]:text-slate-700 data-[state=active]:font-semibold border-b-2 border-transparent data-[state=active]:border-[hsl(var(--primary))] rounded-none transition-all flex items-center gap-2">
                <FileSearch className="h-4 w-4" /> Diagnostic Reports
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab Content - Gray Background */}
        <div className="p-6 flex-1 max-w-[1600px] mx-auto w-full">

          {/* Patient Information Tab */}
          <TabsContent value="info">
            <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 py-4 px-6">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">Full Clinical Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-7">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient ID</p>
                    <p className="text-sm font-mono font-bold text-slate-600">{patientData.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Type</p>
                    <p className="text-sm font-semibold text-slate-800 capitalize">{patientData.clinicalInfo.patientType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{formatDate(patientData.clinicalInfo.dob)}</span>
                      <Badge variant="secondary" className="text-[10px] font-bold bg-slate-100 text-slate-500 border-none h-5 px-1.5">
                        {patientData.clinicalInfo.age} YRS
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</p>
                    <p className="text-sm font-semibold text-slate-800 uppercase tracking-tight">{patientData.clinicalInfo.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marital Status</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.clinicalInfo.maritalStatus}</p>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Residential Address</p>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{patientData.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nationality</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.clinicalInfo.nationality}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Communication</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.clinicalInfo.preferredCommunication}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Appointment</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {patientData.appointments.length > 0
                        ? formatDate(patientData.appointments[0].date)
                        : "No record"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registration Date</p>
                    <p className="text-sm font-semibold text-slate-800">{formatDate(patientData.joinedDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered By</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.clinicalInfo.registeredBy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clinical Information Tab */}
          <TabsContent value="clinical">
            <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-700">Clinical Details</CardTitle>
                    <div className="text-xs font-medium text-slate-600">Manage patient's clinical and medical information</div>
                </div>
                <Button size="sm" className="h-8 text-xs font-bold gap-2">
                  <Edit className="h-3.5 w-3.5" /> Edit Clinical Info
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Group</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.clinicalInfo.bloodGroup || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Genotype</p>
                    <p className="text-sm font-semibold text-slate-800">{patientData.clinicalInfo.genotype || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allergies</p>
                    <div className="flex gap-2 mt-1">
                      {patientData.clinicalInfo.allergies?.length > 0 ? patientData.clinicalInfo.allergies.map(a => (
                        <Badge key={a} variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">{a}</Badge>
                      )) : <span className="text-sm font-semibold text-slate-800">None known</span>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Medications</p>
                    <div className="flex gap-2 mt-1">
                      {patientData.clinicalInfo.medications?.length > 0 ? patientData.clinicalInfo.medications.map(a => (
                        <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                      )) : <span className="text-sm font-semibold text-slate-800">None</span>}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Notes</p>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{patientData.clinicalInfo.history || "No significant medical history recorded."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History Section */}
            <Card className="border shadow-none bg-white rounded-2xl overflow-hidden mt-6">
              <CardHeader className="border-b bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-700">Patient Medical History</CardTitle>
                    <div className="text-xs font-medium text-slate-600">Timeline of all medical notes and history entries</div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Add New History Note */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Add New Note</label>
                    <Textarea 
                      placeholder="Write patient medical history, symptoms, or consultation notes here..." 
                      className="min-h-[100px] resize-y bg-white text-sm"
                      value={newHistoryNote}
                      onChange={(e) => setNewHistoryNote(e.target.value)}
                    />
                    <div className="flex justify-end pt-1">
                      <Button onClick={handleAddHistory} size="sm" className="gap-2 h-9 px-5 font-semibold" disabled={!newHistoryNote.trim()}>
                        <Plus className="h-4 w-4" /> Save Note
                      </Button>
                    </div>
                  </div>

                  {/* History Timeline */}
                  <div className="space-y-4 pt-4">
                    {medicalHistory.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <div className="h-12 w-12 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <FileText className="h-5 w-5 opacity-40 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">No History Records</p>
                        <p className="text-xs mt-1 text-slate-400">There are no medical notes recorded for this patient yet.</p>
                      </div>
                    ) : (
                      <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 py-2 space-y-8">
                        {medicalHistory.map((entry) => (
                          <div key={entry.id} className="relative pl-6 md:pl-8">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))] ring-4 ring-white" />
                            
                            <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-slate-50/50 border-b px-4 py-2.5 flex flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-[hsl(var(--primary))/0.1] flex items-center justify-center">
                                            <User className="h-3 w-3 text-[hsl(var(--primary))]" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{entry.addedBy}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border px-2 py-1 rounded-md">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatDate(entry.date)} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">{entry.notes}</p>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4 px-6 space-y-0">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-700">Clinical Visit Log</CardTitle>
                  <div className="text-xs font-medium text-slate-600">Comprehensive history of clinical appointments and consultations</div>
                </div>
                <Button size="sm" className="h-8 text-xs font-bold gap-2">
                  <Plus className="h-3.5 w-3.5" /> Schedule New Visit
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4 pl-6">Service Type</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Schedule Date</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Attending Facility</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Primary Clinician</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.appointments.map((apt) => (
                      <TableRow key={apt.id} className="hover:bg-slate-50/50 transition-colors border-b">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Stethoscope className="h-3.5 w-3.5 text-slate-500" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{apt.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-semibold text-slate-800">{formatDate(apt.date)} {apt.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Hospital className="h-3.5 w-3.5 text-slate-500" />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600">{apt.facility}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Stethoscope className="h-3.5 w-3.5 text-slate-500" />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600">{apt.doctor}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-[11px] border-none px-2 py-0.5", getAppointmentStatusBadge(apt.status))}>
                            {apt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments / Invoices Tab */}
          <TabsContent value="payments">
            <div className="space-y-6">
              <div className="space-y-8">
                {/* Unified Financial Summary Card */}
                <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-slate-100">
                    {[
                      { label: "Total Revenue", value: patientData.paymentSummary.totalValue, icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Amount Paid", value: patientData.paymentSummary.paid, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Balance Due", value: patientData.paymentSummary.balance, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
                          <h3 className={cn(
                            "text-lg font-bold tabular-nums leading-none pt-1",
                            (i === 1 ? "text-emerald-600" : (i === 2 ? "text-amber-600" : "text-slate-900"))
                          )}>
                            {formatCurrency(stat.value as number)}
                          </h3>
                        </div>
                        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                          <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Invoices Table */}
                <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4 px-6 space-y-0">
                    <div>
                      <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-700">Billing History</CardTitle>
                      <div className="text-xs font-medium text-slate-600">Track and manage all invoices issued to this patient</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold antialiased gap-2 bg-white"
                      onClick={() => navigate(`/invoices/create?patientId=${patientData.id}`)}
                    >
                      <Plus className="h-3.5 w-3.5" /> Create New Invoice
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                          <TableHead className="text-[11px] font-black uppercase tracking-widest py-4 pl-6">Invoice ID</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-widest py-4">Medical Service</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-widest py-4">Total Amount</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-widest py-4">Billed Date</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-widest py-4">Status</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-widest py-4 pr-6 text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientData.paymentSummary.invoices.map((inv) => (
                          <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                            <TableCell className="pl-6 py-4">
                              <code className="text-[11px] font-bold font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                                {inv.id}
                              </code>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-semibold text-slate-700">{inv.name}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-black text-slate-900 tabular-nums">{formatCurrency(inv.amount)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-[13px] font-semibold text-slate-600">{formatDate(inv.date)}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={cn(
                                "text-[11px] font-semibold capitalize border-none px-2 py-0.5",
                                inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              )}>
                                {inv.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Medical Reports Tab */}
          <TabsContent value="reports">
            <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4 px-6 space-y-0">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-700">Medical Report Archive</CardTitle>
                  <div className="text-xs font-medium text-slate-600">Validated diagnostic findings and medical interpretations</div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-2 bg-white" onClick={() => setIsUploadReportModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> File New Report
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4 pl-6">Report ID</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Diagnostic Title</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Report Type</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Finalized Date</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Lead Clinician</TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest py-4">Status</TableHead>
                      <TableHead className="text-[11px] font-black uppercase tracking-widest py-4 pr-6 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                        <TableCell className="pl-6 py-4">
                          <code className="text-[11px] font-bold font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                            {report.id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-semibold text-slate-700">{report.title}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[11px] font-semibold bg-slate-50 text-slate-500 border-slate-200">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-[13px] font-semibold text-slate-600">{formatDate(report.date)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[13px] font-semibold text-slate-600">{report.doctor}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[13px] font-semibold antialiased capitalize text-emerald-700">{report.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-[11px] font-black uppercase text-[hsl(var(--primary))] hover:bg-slate-50 transition-colors gap-1">
                            Review PDF <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {reports.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                              <FileSearch className="h-6 w-6 opacity-40 text-slate-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold uppercase tracking-widest">No reports found</p>
                              <p className="text-xs font-medium text-slate-400 italic">This patient does not have any finalized diagnostic reports.</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <UploadReportModal
         open={isUploadReportModalOpen}
         onOpenChange={setIsUploadReportModalOpen}
         onUpload={handleUploadReport}
         patientName={patientData.name}
      />

      <RequestAmbulanceModal
        open={isAmbulanceModalOpen}
        onOpenChange={setIsAmbulanceModalOpen}
        patient={patient}
        onSubmit={(data) => addRequest(data)}
      />
    </div>
  );
}