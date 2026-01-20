/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useParams, Link } from "react-router-dom";
import {
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  FileText,
  DollarSign,
  User,
  Building,
  Globe,
  Clock,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Receipt,
  FileSearch,
  Plus,
  ReceiptIcon,
  CalendarCheck
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
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/formatCurrency";


export default function PatientDetail() {
  const { id: routeId } = useParams();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading patient details...
      </div>
    );
  }

  // Mock patient data
  const patientData = {
    id: routeId || "PT-001",
    name: "Alex Turner",
    email: "alex.turner@email.com",
    phone: "+234 812 345 6789",
    status: "active",
    joinedDate: "2024-10-15",
    lastActivity: "2025-01-15",
    address: "123 Healthcare Blvd, Lagos, Nigeria",

    // Clinical Information
    clinicalInfo: {
      patientType: "Private",
      gender: "Male" as const,
      dob: "1997-05-15",
      age: 28,
      maritalStatus: "Single",
      nationality: "Nigerian",
      bloodGroup: "O+",
      genotype: "AA",
      allergies: ["Penicillin"],
      medications: ["None"],
      history: "Chronic headaches for 3 months.",
      registeredBy: "Adebayo Olusola",
      preferredCommunication: "WhatsApp"
    },

    // Appointments associated with this patient
    appointments: [
      {
        id: "APT-2025-001",
        type: "MRI Brain",
        status: "Completed",
        date: "2025-01-15",
        time: "10:00 AM",
        doctor: "Dr. Sarah Johnson",
        facility: "Main Radiology Wing"
      },
      {
        id: "APT-2025-012",
        type: "CT Chest",
        status: "Schedule",
        date: "2025-02-10",
        time: "02:30 PM",
        doctor: "Dr. Michael Chen",
        facility: "Emergency Radiology"
      },
      {
        id: "APT-2024-118",
        type: "X-Ray Leg",
        status: "Completed",
        date: "2024-12-05",
        time: "09:15 AM",
        doctor: "Dr. Emily Okafor",
        facility: "Outpatient Clinic"
      }
    ],

    // Medical Reports
    reports: [
      {
        id: "REP-9921",
        title: "Brain MRI Analysis",
        type: "MRI Report",
        date: "2025-01-16",
        status: "Finalized",
        doctor: "Dr. Sarah Johnson"
      },
      {
        id: "REP-9844",
        title: "Lower Limb X-Ray Findings",
        type: "X-Ray Report",
        date: "2024-12-06",
        status: "Finalized",
        doctor: "Dr. Emily Okafor"
      }
    ],

    // Payment information
    paymentSummary: {
      totalValue: 185000,
      paid: 150000,
      balance: 35000,
      nextPaymentDue: "2025-02-15",
      invoices: [
        { id: "INV-1001", name: "MRI Brain Scanning", amount: 120000, status: "paid", date: "2025-01-15" },
        { id: "INV-1002", name: "CT Chest Consultation", amount: 30000, status: "paid", date: "2025-01-20" },
        { id: "INV-1003", name: "Follow-up Preparation", amount: 35000, status: "pending", dueDate: "2025-02-15" }
      ]
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar className="h-12 w-12 border border-muted shadow-sm">
              <AvatarImage src={getPatientAvatarPath(patientData.id, patientData.clinicalInfo.gender)} alt={patientData.name} />
              <AvatarFallback
                className={cn("text-sm font-semibold", getAvatarBg(patientData.name))}
              >
                {getAvatarInitials(patientData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold leading-tight">{patientData.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(patientData.status)}>
                    {patientData.status.charAt(0).toUpperCase() + patientData.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {patientData.id}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(patientData.joinedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last activity {formatDate(patientData.lastActivity)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4" />
                Edit Patient
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarCheck className="h-4 w-4" />
                Schedule Appointment
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4" />
                Export Patient Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ReceiptIcon className="w-4 h-4" />
                Create Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4" variant="line">
          <TabsTrigger variant="line" value="info" className="flex items-center gap-1">
            <User className="h-4 w-4" /> Patient Information
          </TabsTrigger>
          <TabsTrigger variant="line" value="appointments" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Appointments
          </TabsTrigger>
          <TabsTrigger variant="line" value="payments" className="flex items-center gap-1">
            <Receipt className="h-4 w-4" /> Payments / Invoices
          </TabsTrigger>
          <TabsTrigger variant="line" value="reports" className="flex items-center gap-1">
            <FileSearch className="h-4 w-4" /> Report (Medical)
          </TabsTrigger>
        </TabsList>

        {/* Patient Information Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Full Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Patient Type</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.clinicalInfo.patientType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Patient Name</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Patient ID</p>
                  <p className="text-sm font-mono mt-1.5">{patientData.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.email}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mobile Number</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date of Birth</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-medium">{formatDate(patientData.clinicalInfo.dob)}</span>
                    <Badge variant="outline" className="text-[10px] font-bold h-5 px-1.5">
                      {patientData.clinicalInfo.age} YRS
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Gender</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.clinicalInfo.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Marital Status</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.clinicalInfo.maritalStatus}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Residential Address</p>
                  <p className="text-sm font-medium mt-1.5 leading-relaxed">{patientData.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Nationality</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.clinicalInfo.nationality}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Preferred Communication</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.clinicalInfo.preferredCommunication}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last Appointment</p>
                  <p className="text-sm font-medium mt-1.5">
                    {patientData.appointments.length > 0
                      ? formatDate(patientData.appointments[0].date)
                      : "No record"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date of Registration</p>
                  <p className="text-sm font-medium mt-1.5">{formatDate(patientData.joinedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Registered By</p>
                  <p className="text-sm font-medium mt-1.5">{patientData.clinicalInfo.registeredBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Appointment History</CardTitle>
                <CardDescription>View upcoming and previous clinical visits</CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Schedule New
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientData.appointments.map((apt) => (
                    <TableRow key={apt.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          {apt.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">{formatDate(apt.date)}</div>
                          <div className="text-xs text-muted-foreground">{apt.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{apt.facility}</TableCell>
                      <TableCell>{apt.doctor}</TableCell>
                      <TableCell>
                        <Badge className={getAppointmentStatusBadge(apt.status)}>
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
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
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Revenue</div>
                  <div className="text-xl font-bold font-mono">₦{patientData.paymentSummary.totalValue.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Amount Paid</div>
                  <div className="text-xl font-bold text-green-600 font-mono">₦{patientData.paymentSummary.paid.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Balance Due</div>
                  <div className="text-xl font-bold text-yellow-600 font-mono">₦{patientData.paymentSummary.balance.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-xs text-primary/80 uppercase tracking-wider font-semibold mb-1">Next Due Date</div>
                  <div className="text-xl font-bold text-primary">{formatDate(patientData.paymentSummary.nextPaymentDue)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Billing history and outstanding invoices</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                  <Receipt className="h-4 w-4" /> Create Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date / Due</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.paymentSummary.invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                        <TableCell className="font-medium text-sm">{inv.name}</TableCell>
                        <TableCell className="font-mono tracking-tighter">₦{inv.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={
                            inv.status === 'paid' ? 'bg-green-100 text-green-800 border-none' :
                              'bg-yellow-100 text-yellow-800 border-none'
                          }>
                            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {inv.status === 'paid' ? formatDate(inv.date!) : formatDate(inv.dueDate!)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Download</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medical Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Medical Reports</CardTitle>
                <CardDescription>Diagnostic findings and clinical report archives</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Add Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Radiologist</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientData.reports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold">{report.id}</TableCell>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/30 font-normal">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(report.date)}</TableCell>
                      <TableCell>{report.doctor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span className="text-sm">{report.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          View PDF <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {patientData.reports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <FileSearch className="h-8 w-8 opacity-20" />
                          No medical reports found for this patient.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}