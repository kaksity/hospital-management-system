/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  MessageSquare,
  Users,
  Timer,
  Stethoscope,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { Search, Bell, Settings, MoreHorizontal, UserPlus, ClipboardList, Database } from "lucide-react";

// Define types for our data
interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface CaseItem {
  id: string;
  client: string;
  type: string;
  status: string;
  progress?: number;
  deadline?: string;
  priority?: string;
  lastActivity?: string;
}

interface TaskItem {
  id: string;
  patient: string;
  task: string;
  priority: string;
  due: string;
}

interface AppointmentItem {
  id: string;
  patient: string;
  type: string;
  time: string;
  status: string;
  patientId?: string;
  patientGender?: string;
}

interface InvoiceItem {
  id: string;
  patient: string;
  amount: number;
  status: string;
  date: string;
  patientId?: string;
  patientGender?: string;
}

interface PaymentItem {
  id: string;
  patient: string;
  amount: number;
  method: string;
  date: string;
}

interface SystemAlert {
  type: "warning" | "info";
  message: string;
  action: string;
}

interface QuickAction {
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  link: string;
}

interface Activity {
  action: string;
  detail: string;
  time: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface AdminData {
  stats: StatItem[];
  recentCases: CaseItem[];
  upcomingAppointments: AppointmentItem[];
  recentInvoices: InvoiceItem[];
  recentPayments: PaymentItem[];
  priorityTasks: TaskItem[];
}

interface AttorneyData {
  stats: StatItem[];
  assignedCases: CaseItem[];
  upcomingAppointments: AppointmentItem[];
  priorityTasks: TaskItem[];
}

interface ParalegalData {
  stats: StatItem[];
  tasks: TaskItem[];
  recentInvoices: InvoiceItem[];
  recentPayments: PaymentItem[];
}

interface ClientData {
  activeCase: {
    id: string;
    type: string;
    status: string;
    progress: number;
    criteria: {
      approved: number;
      pending: number;
      required: number;
    };
    deadline: string;
    daysRemaining: number;
  };
  quickActions: QuickAction[];
  recentActivity: Activity[];
}

type DashboardData = AdminData | AttorneyData | ParalegalData | ClientData;

// Type guards
const isAdminData = (data: DashboardData): data is AdminData => {
  return 'recentInvoices' in data && 'upcomingAppointments' in data;
};

const isAttorneyData = (data: DashboardData): data is AttorneyData => {
  return 'upcomingAppointments' in data && 'priorityTasks' in data && !('recentInvoices' in data);
};

const isParalegalData = (data: DashboardData): data is ParalegalData => {
  return 'recentInvoices' in data && !('upcomingAppointments' in data);
};

const isClientData = (data: DashboardData): data is ClientData => {
  return 'activeCase' in data && 'quickActions' in data && 'recentActivity' in data;
};

const dashboardChartData = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 52 },
  { name: 'Sat', value: 78 },
  { name: 'Sun', value: 72 },
];

// Mock data for different roles with explicit typing
const dashboardData: Record<string, DashboardData> = {
  admin: {
    stats: [
      { label: "Total Revenue", value: "₦4.2M", change: "+12%", icon: FileText, color: "text-blue-600 bg-blue-100" },
      { label: "Active Patients", value: "1,248", change: "+5%", icon: Users, color: "text-green-600 bg-green-100" },
      { label: "Pending Invoices", value: "42", change: "+23%", icon: FileText, color: "text-purple-600 bg-purple-100" },
      { label: "Unread Reports", value: "18", change: "-3%", icon: Clock, color: "text-amber-600 bg-amber-100" }
    ],
    recentCases: [
      { id: "PAT-001", client: "Alex Turner", type: "MRI Scan", status: "Active", progress: 75 },
      { id: "PAT-002", client: "Maria Garcia", type: "CT Chest", status: "Review", progress: 45 },
      { id: "PAT-003", client: "James Wilson", type: "X-Ray", status: "Draft", progress: 20 }
    ],
    upcomingAppointments: [
      { id: "APT-1", patient: "Sarah Chen", type: "Ultrasound", time: "10:30 AM", status: "Confirmed", patientId: "PAT-001", patientGender: "female" },
      { id: "APT-2", patient: "David Kim", type: "Blood Work", time: "11:45 AM", status: "Pending", patientId: "PAT-002", patientGender: "male" },
      { id: "APT-3", patient: "Emma Watson", type: "Consultation", time: "02:15 PM", status: "Confirmed", patientId: "PAT-003", patientGender: "female" },
      { id: "APT-4", patient: "Michael Ross", type: "MRI Scan", time: "04:30 PM", status: "Arrived", patientId: "PAT-004", patientGender: "male" },
      { id: "APT-5", patient: "Harvey Specter", type: "Follow-up", time: "05:00 PM", status: "Confirmed", patientId: "PAT-005", patientGender: "male" }
    ],
    recentInvoices: [
      { id: "INV-001", patient: "Sarah Chen", amount: 45000, status: "Unpaid", date: "2024-03-20", patientId: "PAT-001", patientGender: "female" },
      { id: "INV-002", patient: "David Kim", amount: 12500, status: "Pending", date: "2024-03-20", patientId: "PAT-002", patientGender: "male" },
      { id: "INV-003", patient: "Emma Watson", amount: 250000, status: "Partially Paid", date: "2024-03-19", patientId: "PAT-003", patientGender: "female" },
      { id: "INV-004", patient: "Alex Taylor", amount: 75000, status: "Unpaid", date: "2024-03-19", patientId: "PAT-004", patientGender: "male" },
      { id: "INV-005", patient: "John Doe", amount: 15000, status: "Overdue", date: "2024-03-18", patientId: "PAT-005", patientGender: "male" }
    ],
    recentPayments: [
      { id: "PAY-001", patient: "Emma Watson", amount: 150000, method: "Bank Transfer", date: "5 mins ago" },
      { id: "PAY-002", patient: "Alex Turner", amount: 45000, method: "Debit Card", date: "2 hours ago" },
      { id: "PAY-003", patient: "Maria Garcia", amount: 12500, method: "Cash", date: "4 hours ago" },
      { id: "PAY-004", patient: "James Wilson", amount: 20000, method: "Debit Card", date: "Yesterday" }
    ],
    priorityTasks: [
      { id: "TSK-1", patient: "Alex Turner", task: "Approve MRI Report", priority: "High", due: "2h" },
      { id: "TSK-2", patient: "Maria Garcia", task: "Send CT Result to Dr.", priority: "Medium", due: "4h" },
      { id: "TSK-3", patient: "Sarah Chen", task: "Verify Insurance", priority: "High", due: "1h" },
      { id: "TSK-4", patient: "David Kim", task: "Follow-up Call", priority: "Low", due: "1d" }
    ]
  },
  attorney: {
    stats: [
      { label: "My Appointments", value: "24", change: "+2", icon: FileText, color: "text-blue-600 bg-blue-100" },
      { label: "Pending Results", value: "8", change: "+3", icon: Clock, color: "text-amber-600 bg-amber-100" },
      { label: "Completed", value: "42", change: "+5", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
      { label: "Urgent", value: "3", change: "-1", icon: AlertCircle, color: "text-red-600 bg-red-100" }
    ],
    assignedCases: [],
    upcomingAppointments: [
      { id: "APT-1", patient: "Sarah Chen", type: "Ultrasound", time: "10:30 AM", status: "Confirmed" },
      { id: "APT-2", patient: "David Kim", type: "Blood Work", time: "11:45 AM", status: "Pending" }
    ],
    priorityTasks: [
      { id: "TSK-1", patient: "Alex Turner", task: "Review Radiology Scan", priority: "High", due: "1h" }
    ]
  },
  paralegal: {
    stats: [
      { label: "Registrations", value: "18", change: "+3", icon: FileText, color: "text-blue-600 bg-blue-100" },
      { label: "Invoices to Process", value: "23", change: "+8", icon: FileText, color: "text-amber-600 bg-amber-100" },
      { label: "Completed", value: "112", change: "+4", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
      { label: "Messages", value: "7", change: "+2", icon: MessageSquare, color: "text-purple-600 bg-purple-100" }
    ],
    tasks: [
      { id: "TSK-3", patient: "Sarah Chen", task: "Verify Billing Info", priority: "High", due: "1h" }
    ],
    recentInvoices: [
      { id: "INV-001", patient: "Sarah Chen", amount: 45000, status: "Unpaid", date: "Today" }
    ],
    recentPayments: [
      { id: "PAY-002", patient: "Alex Turner", amount: 45000, method: "Debit Card", date: "1h ago" }
    ]
  },
  client: {
    activeCase: {
      id: "ACV-2024-001",
      type: "O-1A Visa Petition",
      status: "Active",
      progress: 67,
      criteria: { approved: 8, pending: 2, required: 3 },
      deadline: "2025-03-15",
      daysRemaining: 45
    },
    quickActions: [
      {
        title: "Upload Documents",
        desc: "Add evidence for pending criteria",
        icon: Upload,
        iconColor: "text-primary bg-primary/10",
        link: "/diagnostic-reports/upload"
      },
      {
        title: "Messages",
        desc: "2 new messages from your team",
        icon: MessageSquare,
        iconColor: "text-blue-600 bg-blue-100",
        link: "/help-desk"
      },
      {
        title: "Case Details",
        desc: "View complete petition status",
        icon: FileText,
        iconColor: "text-green-600 bg-green-100",
        link: "/task-manager/ACV-2024-001"
      }
    ],
    recentActivity: [
      {
        action: "Document approved",
        detail: "Press coverage evidence for Media Coverage criterion",
        time: "2 hours ago",
        icon: CheckCircle2,
        color: "text-green-600 bg-green-100",
      },
      {
        action: "Comment added",
        detail: "Attorney reviewed your judging evidence",
        time: "5 hours ago",
        icon: MessageSquare,
        color: "text-blue-600 bg-blue-100",
      },
      {
        action: "Action required",
        detail: "Upload additional evidence for Awards criterion",
        time: "1 day ago",
        icon: AlertCircle,
        color: "text-amber-600 bg-amber-100",
      },
    ]
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const userRole = user?.role as keyof typeof dashboardData || 'client';
  const data = dashboardData[userRole];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Active: "bg-green-100 text-green-800",
      Review: "bg-yellow-100 text-yellow-800",
      Draft: "bg-gray-100 text-gray-800",
      Urgent: "bg-red-100 text-red-800"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-blue-100 text-blue-800"
    };
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  // Helper function to render icons safely
  const renderIcon = (IconComponent: React.ComponentType<any>, className: string) => {
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto p-6 lg:px-10 lg:py-6 space-y-6">
          <div className="flex flex-col space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest antialiased">
              {userRole === 'admin' ? "Overview of Diagnostic Facility & Strategic Oversight" : "Overview of Practice Management & Daily Operational Summary"}
            </p>
          </div>

          {/* Unified Summary Card - 4 Column Grid Style */}
          {data && 'stats' in data && (
            <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-slate-100">
                {(data as any).stats.map((stat: any, idx: number) => (
                  <div key={idx} className="p-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">{stat.label}</p>
                      <div className="flex items-center gap-1">
                        <h3 className="text-xl font-bold text-slate-900 tabular-nums leading-none pt-1">{stat.value}</h3>
                        <div className={cn(
                          "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit mt-1",
                          stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {stat.change.startsWith('+') ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                          {stat.change}
                        </div>
                      </div>
                    </div>
                    <div className={cn("p-2 rounded-xl", stat.color)}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 lg:px-10 lg:py-8 space-y-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content - col-8 */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <Card className="border rounded-2xl overflow-hidden bg-white shadow-none">
              <div className="max-w-[600px] mx-auto">
                <div className="p-8 pb-4 max-w-[450px] mx-auto flex flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center transition-colors bg-slate-100 text-slate-600">
                    <Timer className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-slate-900 text-center">Getting Started</div>
                    <div className="text-sm text-slate-500 mt-1 pb-4 text-center">
                      New to Carepak? Try these quick steps to set up your practice and start managing patients.
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <div className="bg-white border rounded-xl overflow-hidden divide-y divide-border">
                    {[
                      { icon: Database, title: "Import patient data", desc: "Sync your existing records from CSV or EHR systems.", btnText: "Import", color: "bg-blue-50 text-blue-600", path: "/patients/import" },
                      { icon: UserPlus, title: "Add a new patient", desc: "Create a detailed medical profile for a new patient entry.", btnText: "Add Patient", color: "bg-emerald-50 text-emerald-600", path: "/patients/create" },
                      { icon: Users, title: "Add a team member", desc: "Invite colleagues to collaborate on patient care and tasks.", btnText: "Invite Team", color: "bg-purple-50 text-purple-600", path: "/settings/members" },
                      { icon: ClipboardList, title: "Create a new Task", desc: "Assign medical follow-ups or diagnostic reviews.", btnText: "New Task", color: "bg-amber-50 text-amber-600", path: "/task-manager/create" },
                      { icon: FileText, title: "Generate diagnostic report", desc: "Create an automated diagnostic summary based on data.", btnText: "Generate", color: "bg-rose-50 text-rose-600", path: "/diagnostic-reports/create" },
                      { icon: Settings, title: "Configure facility settings", desc: "Update your practice details and user permissions.", btnText: "Configure", color: "bg-slate-100 text-slate-600", path: "/settings/general" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", item.color)}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[15px] font-semibold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <Link to={item.path}>
                          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold antialiased text-slate-800">
                            {item.btnText}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - col-4 */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Appointment Card */}
            <div className="space-y-2">
              <div className="flex flex-row items-center justify-between">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Appointments</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
              </div>
              <Card className="border rounded-xl overflow-hidden bg-white shadow-none">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {data && 'upcomingAppointments' in data ? (data as any).upcomingAppointments.slice(0, 3).map((app: any) => (
                      <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border shrink-0">
                            <AvatarImage src={getPatientAvatarPath(app.patientId || '', app.patientGender || '')} alt={app.patient} />
                            <AvatarFallback className={cn("text-[10px]", getAvatarBg(app.patient))}>
                              {getAvatarInitials(app.patient)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{app.patient}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold antialiased">
                              <Clock className="h-3 w-3" />
                              {app.time}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-600 transition-colors" />
                      </div>
                    )) : (
                      <div className="p-6 text-center">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">No appointments today</p>
                      </div>
                    )}
                    {data && 'upcomingAppointments' in data && (data as any).upcomingAppointments.length > 0 && (
                      <Link to="/appointments" className="block p-3 text-center border-t bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <span className="text-[10px] font-black uppercase text-[hsl(var(--primary))] tracking-widest">View Full Schedule</span>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Recent Invoices</div>
              <Card className="border rounded-xl overflow-hidden bg-white shadow-none">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {data && 'recentInvoices' in data ? (data as any).recentInvoices.slice(0, 3).map((inv: any, i: number) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border shrink-0">
                            <AvatarImage src={getPatientAvatarPath(inv.patientId || '', inv.patientGender || '')} alt={inv.patient} />
                            <AvatarFallback className={cn("text-[10px]", getAvatarBg(inv.patient))}>
                              {getAvatarInitials(inv.patient)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{inv.patient}</p>
                            <p className="text-[10px] text-slate-500 font-semibold antialiased uppercase tracking-tight">{inv.id} • Jan {20 - i}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900">{formatCurrency(inv.amount)}</span>
                      </div>
                    )) : (
                      <div className="p-6 text-center">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">No recent invoices</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages sent out */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Sent Messages</div>
              <Card className="border rounded-xl overflow-hidden bg-white shadow-none">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {[
                      { to: 'Dr. Smith', text: 'Diagnostic results uploaded...', time: '2h ago' },
                      { to: 'Maria Garcia', text: 'Appointment confirmed for tomorrow...', time: '5h ago' }
                    ].map((msg, i) => (
                      <div key={i} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <MessageSquare className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-800 truncate">{msg.to}</p>
                            <span className="text-xs text-slate-600 font-semibold antialiased">{msg.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}