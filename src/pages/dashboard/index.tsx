/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ArrowRight,
  Upload,
  MessageSquare,
  Users,
  FolderOpen,
  Download,
  Plus,
  Eye,
  Bell
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";

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
}

interface InvoiceItem {
  id: string;
  patient: string;
  amount: number;
  status: string;
  date: string;
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

const dashboardDataPoints = [
  { id: "revenue", label: "Total Revenue", value: 4200000, previousValue: 3800000, isCurrency: true },
  { id: "patients", label: "Active Patients", value: 1248, previousValue: 1120 },
  { id: "invoices", label: "Pending Invoices", value: 42, previousValue: 38 },
  { id: "reports", label: "Unread Reports", value: 18, previousValue: 22 },
];

const clinicalDataPoints = [
  { id: "appointments", label: "Today's Appointments", value: 24, previousValue: 22 },
  { id: "results", label: "Pending Results", value: 12, previousValue: 15 },
  { id: "cases", label: "Active Cases", value: 42, previousValue: 37 },
  { id: "urgent", label: "Urgent Revise", value: 3, previousValue: 4 },
];

const operationsDataPoints = [
  { id: "registrations", label: "New Registrations", value: 18, previousValue: 15 },
  { id: "invoicing", label: "Pending Invoicing", value: 23, previousValue: 15 },
  { id: "dispatched", label: "Reports Dispatched", value: 112, previousValue: 98 },
  { id: "tasks", label: "Facility Tasks", value: 7, previousValue: 5 },
];

const dashboardChartData = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 52 },
  { name: 'Sat', value: 78 },
  { name: 'Sun', value: 72 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const userRole = user?.role as keyof typeof dashboardData || 'client';

  const getInitialPoints = () => {
    if (userRole === 'attorney') return clinicalDataPoints;
    if (userRole === 'paralegal') return operationsDataPoints;
    return dashboardDataPoints;
  };

  const [selectedPoint, setSelectedPoint] = useState(getInitialPoints()[0]);

  const handlePointChange = (id: string) => {
    const points = getInitialPoints();
    const point = points.find(p => p.id === id);
    if (point) setSelectedPoint(point);
  };

  // Mock data for different roles with explicit typing
  const dashboardData: Record<string, DashboardData> = {
    admin: {
      stats: [
        { label: "Total Revenue", value: "₦4.2M", change: "+12%", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
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
        { id: "APT-1", patient: "Sarah Chen", type: "Ultrasound", time: "10:30 AM", status: "Confirmed" },
        { id: "APT-2", patient: "David Kim", type: "Blood Work", time: "11:45 AM", status: "Pending" },
        { id: "APT-3", patient: "Emma Watson", type: "Consultation", time: "02:15 PM", status: "Confirmed" },
        { id: "APT-4", patient: "Michael Ross", type: "MRI Scan", time: "04:30 PM", status: "Arrived" },
        { id: "APT-5", patient: "Harvey Specter", type: "Follow-up", time: "05:00 PM", status: "Confirmed" }
      ],
      recentInvoices: [
        { id: "INV-001", patient: "Sarah Chen", amount: 45000, status: "Unpaid", date: "2024-03-20" },
        { id: "INV-002", patient: "David Kim", amount: 12500, status: "Pending", date: "2024-03-20" },
        { id: "INV-003", patient: "Emma Watson", amount: 250000, status: "Partially Paid", date: "2024-03-19" },
        { id: "INV-004", patient: "Alex Taylor", amount: 75000, status: "Unpaid", date: "2024-03-19" },
        { id: "INV-005", patient: "John Doe", amount: 15000, status: "Overdue", date: "2024-03-18" }
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
        { label: "My Appointments", value: "24", change: "+2", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
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
        { label: "Registrations", value: "18", change: "+3", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
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

  // Get data for current user role, default to client if no role
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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back,{" "}
              <span className="text-[#006bff]">{user?.name || "there"}</span>
            </h1>
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[10px] uppercase tracking-wider">
              {userRole === "attorney" ? "Clinician" : userRole === "paralegal" ? "Operations" : userRole}
            </Badge>
          </div>
          <p className="text-sm font-medium text-slate-500">
            {userRole === "admin" && "Monitor clinic performance and strategic financial metrics."}
            {userRole === "attorney" && "Overview of patient appointments and clinical tasks."}
            {userRole === "paralegal" && "Manage facility documentation and pending invoices."}
            {userRole === "client" && "Track your diagnostic journey and reports."}
          </p>
        </div>

        {userRole !== "client" && (
          <div className="flex items-center gap-2">
            <Select value={selectedPoint.id} onValueChange={handlePointChange}>
              <SelectTrigger className="w-[200px] h-10 bg-white border border-slate-200 shadow-none font-bold text-xs text-slate-700 uppercase tracking-wider">
                <SelectValue placeholder="Select Perspective" />
              </SelectTrigger>
              <SelectContent>
                {userRole === 'admin' && dashboardDataPoints.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-xs font-bold uppercase tracking-wider">{p.label}</SelectItem>
                ))}
                {userRole === 'attorney' && clinicalDataPoints.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-xs font-bold uppercase tracking-wider">{p.label}</SelectItem>
                ))}
                {userRole === 'paralegal' && operationsDataPoints.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-xs font-bold uppercase tracking-wider">{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <Select defaultValue="30days">
              <SelectTrigger className="w-[140px] h-10 bg-white border border-slate-200 shadow-none font-semibold text-xs text-slate-600">
                <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-10 px-4 bg-[#006bff] hover:bg-[#0056cc] font-bold text-sm shadow-sm gap-2">
              <Plus className="h-4 w-4" />
              {userRole === "admin" ? "New Facility" : "New Patient"}
            </Button>
          </div>
        )}
      </div>

      {/* Role-specific Dashboard Content */}
      {userRole === "admin" && isAdminData(data) && (
        <div className="space-y-8">
          {/* Main Analytics Card */}
          <Card className="border shadow-none rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                    Global Perspective: {selectedPoint.label}
                  </div>
                  <div className="text-3xl font-bold text-slate-800 tabular-nums flex items-baseline gap-2 leading-none">
                    {(selectedPoint as any).isCurrency ? formatCurrency(selectedPoint.value) : selectedPoint.value}
                    <div className={cn(
                      "flex items-center text-[11px] font-bold",
                      selectedPoint.value >= selectedPoint.previousValue ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {selectedPoint.value >= selectedPoint.previousValue ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {Math.abs(((selectedPoint.value - selectedPoint.previousValue) / selectedPoint.previousValue) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    vs {(selectedPoint as any).isCurrency ? formatCurrency(selectedPoint.previousValue) : selectedPoint.previousValue} last period
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 p-2.5 px-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#006bff] shadow-[0_0_8px_rgba(0,107,255,0.4)]" />
                    <span className="text-slate-600">{selectedPoint.label}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500 italic lowercase font-medium">projected</span>
                  </div>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006bff" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#006bff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis hide={true} />
                    <RechartsTooltip
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 15px -1px rgba(0,0,0,0.05)',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}
                      labelStyle={{ marginBottom: '4px', color: '#94a3b8', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#006bff"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorDash)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming Appointments */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Upcoming Appointments</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.upcomingAppointments.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.upcomingAppointments.map((apt) => (
                        <TableRow key={apt.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{apt.patient}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tight">{apt.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-2">
                            <span className="text-[11px] font-bold text-slate-600 block">{apt.time}</span>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <Badge variant="secondary" className="text-[9px] font-black px-2 h-5 bg-slate-100 text-slate-500 border-none shadow-none uppercase">{apt.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <Calendar className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No scheduled appointments</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent Invoices</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.recentInvoices.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.recentInvoices.map((inv) => (
                        <TableRow key={inv.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{inv.patient}</span>
                              <span className="text-[10px] font-mono text-slate-400">{inv.id}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-2">
                            <span className="text-[12px] font-black text-slate-700">{formatCurrency(inv.amount)}</span>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <Badge className={cn(
                              "text-[9px] font-black px-2 h-5 border-none shadow-none uppercase",
                              inv.status === 'Unpaid' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                            )}>{inv.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <FileText className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No pending invoices</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent Payments</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.recentPayments.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.recentPayments.map((pay) => (
                        <TableRow key={pay.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{pay.patient}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tight">{pay.method}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-2">
                            <span className="text-[12px] font-black text-emerald-600">+{formatCurrency(pay.amount)}</span>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{pay.date}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <CheckCircle2 className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No recent transactions</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority Tasks */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority Tasks</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.priorityTasks.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.priorityTasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{task.task}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tight">Patient: {task.patient}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Badge className={cn(
                                "text-[9px] font-black px-2 h-5 border-none shadow-none uppercase",
                                task.priority === 'High' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
                              )}>{task.priority}</Badge>
                              <span className="text-[10px] font-black text-slate-400 tabular-nums">{task.due}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <Bell className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No pending tasks</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {userRole === "attorney" && isAttorneyData(data) && (
        <div className="space-y-8">
          {/* Main Analytics Card */}
          <Card className="border shadow-none rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                    Global Perspective: {selectedPoint.label}
                  </div>
                  <div className="text-3xl font-bold text-slate-800 tabular-nums flex items-baseline gap-2 leading-none">
                    {(selectedPoint as any).isCurrency ? formatCurrency(selectedPoint.value) : selectedPoint.value}
                    <div className={cn(
                      "flex items-center text-[11px] font-bold",
                      selectedPoint.value >= selectedPoint.previousValue ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {selectedPoint.value >= selectedPoint.previousValue ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {Math.abs(((selectedPoint.value - selectedPoint.previousValue) / selectedPoint.previousValue) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    vs {(selectedPoint as any).isCurrency ? formatCurrency(selectedPoint.previousValue) : selectedPoint.previousValue} last period
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 p-2.5 px-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#006bff] shadow-[0_0_8px_rgba(0,107,255,0.4)]" />
                    <span className="text-slate-600">{selectedPoint.label}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500 italic lowercase font-medium">clinician queue</span>
                  </div>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006bff" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#006bff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis hide={true} />
                    <RechartsTooltip
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 15px -1px rgba(0,0,0,0.05)',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}
                      labelStyle={{ marginBottom: '4px', color: '#94a3b8', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#006bff"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorDash)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming Appointments */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Clinician Schedule</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.upcomingAppointments.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.upcomingAppointments.map((apt) => (
                        <TableRow key={apt.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{apt.patient}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tight">{apt.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-2">
                            <span className="text-[11px] font-bold text-slate-600 block">{apt.time}</span>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <Badge variant="secondary" className="text-[9px] font-black px-2 h-5 bg-slate-100 text-slate-500 border-none shadow-none uppercase">{apt.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <Calendar className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No scheduled consultations</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority Tasks */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Patient Tasks</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.priorityTasks.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.priorityTasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{task.task}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tight">Patient: {task.patient}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Badge className={cn(
                                "text-[9px] font-black px-2 h-5 border-none shadow-none uppercase",
                                task.priority === 'High' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
                              )}>{task.priority}</Badge>
                              <span className="text-[10px] font-black text-slate-400 tabular-nums">{task.due}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <Bell className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No pending medical tasks</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {userRole === "paralegal" && isParalegalData(data) && (
        <div className="space-y-8">
          {/* Main Analytics Card */}
          <Card className="border shadow-none rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                    Global Perspective: {selectedPoint.label}
                  </div>
                  <div className="text-3xl font-bold text-slate-800 tabular-nums flex items-baseline gap-2 leading-none">
                    {(selectedPoint as any).isCurrency ? formatCurrency(selectedPoint.value) : selectedPoint.value}
                    <div className={cn(
                      "flex items-center text-[11px] font-bold",
                      selectedPoint.value >= selectedPoint.previousValue ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {selectedPoint.value >= selectedPoint.previousValue ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {Math.abs(((selectedPoint.value - selectedPoint.previousValue) / selectedPoint.previousValue) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    vs {(selectedPoint as any).isCurrency ? formatCurrency(selectedPoint.previousValue) : selectedPoint.previousValue} last period
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 p-2.5 px-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#006bff] shadow-[0_0_8px_rgba(0,107,255,0.4)]" />
                    <span className="text-slate-600">{selectedPoint.label}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500 italic lowercase font-medium">completed queue</span>
                  </div>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006bff" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#006bff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis hide={true} />
                    <RechartsTooltip
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 15px -1px rgba(0,0,0,0.05)',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}
                      labelStyle={{ marginBottom: '4px', color: '#94a3b8', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#006bff"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorDash)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Invoices */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Finance Queue</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.recentInvoices.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.recentInvoices.map((inv) => (
                        <TableRow key={inv.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{inv.patient}</span>
                              <span className="text-[10px] font-mono text-slate-400">{inv.id}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-2">
                            <span className="text-[12px] font-black text-slate-700">{formatCurrency(inv.amount)}</span>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <Badge className={cn(
                              "text-[9px] font-black px-2 h-5 border-none shadow-none uppercase",
                              inv.status === 'Unpaid' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                            )}>{inv.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <FileText className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No pending invoices</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Revenue Hub</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.recentPayments.length > 0 ? (
                  <Table>
                    <TableBody>
                      {data.recentPayments.map((pay) => (
                        <TableRow key={pay.id} className="hover:bg-slate-50 border-slate-50 transition-colors">
                          <TableCell className="py-3 px-6">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-800">{pay.patient}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tight">{pay.method}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-2">
                            <span className="text-[12px] font-black text-emerald-600">+{formatCurrency(pay.amount)}</span>
                          </TableCell>
                          <TableCell className="py-3 px-6 text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{pay.date}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                    <CheckCircle2 className="h-10 w-10 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No recent transactions</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Operations Queue</CardTitle>
                <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-[#006bff] p-0 h-auto hover:no-underline">View All</Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {data.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold text-[13px] text-slate-800">{task.task}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-medium tracking-tight">Patient: {task.patient}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "text-[9px] font-black px-2 h-5 border-none shadow-none uppercase",
                        task.priority === 'High' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400"
                      )}>{task.priority}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">{task.due}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border shadow-none rounded-2xl overflow-hidden bg-white flex flex-col h-[350px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Immediate Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <Button variant="outline" className="w-full justify-start gap-3 h-11 text-xs font-bold uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Upload className="h-4 w-4 text-[#006bff]" />
                  Register Patient
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 text-xs font-bold uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50">
                  <FileText className="h-4 w-4 text-[#006bff]" />
                  Generate Invoice
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 text-xs font-bold uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50">
                  <MessageSquare className="h-4 w-4 text-[#006bff]" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Client Dashboard */}
      {userRole === "client" && isClientData(data) && (
        <div className="space-y-8">
          {/* Active Case Overview */}
          <Card className="border from-primary/5 via-background to-accent/5 rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    {data.activeCase.type}
                  </CardTitle>
                  <CardDescription>Case ID: {data.activeCase.id}</CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary border border-primary/20">
                  {data.activeCase.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="text-sm font-semibold text-primary">{data.activeCase.progress}%</span>
                </div>
                <Progress value={data.activeCase.progress} className="h-2.5 rounded-full" />
              </div>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: CheckCircle2,
                    label: "Approved Criteria",
                    value: data.activeCase.criteria.approved,
                    color: "text-green-600 bg-green-100",
                  },
                  {
                    icon: Clock,
                    label: "Pending Review",
                    value: data.activeCase.criteria.pending,
                    color: "text-yellow-600 bg-yellow-100",
                  },
                  {
                    icon: AlertCircle,
                    label: "Action Required",
                    value: data.activeCase.criteria.required,
                    color: "text-red-600 bg-red-100",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:shadow-sm transition-all"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        item.color
                      )}
                    >
                      {renderIcon(item.icon, "h-5 w-5")}
                    </div>
                    <div>
                      <p className="text-xl font-bold leading-none">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filing Deadline */}
              <div className="flex items-center justify-between gap-3 rounded-xl border bg-amber-50 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-amber-800">Filing Deadline</p>
                    <p className="text-muted-foreground">
                      {new Date(data.activeCase.deadline).toLocaleDateString()}
                      ({data.activeCase.daysRemaining} days remaining)
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  View Timeline
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {data.quickActions.map((item, idx) => (
                <Card
                  key={idx}
                  className="cursor-pointer hover:shadow-md transition-all rounded-xl"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          item.iconColor
                        )}
                      >
                        {renderIcon(item.icon, "h-5 w-5")}
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        {item.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.desc}
                    </p>
                    <Button
                      variant="default"
                      className="w-full"
                      size="sm"
                    >
                      <Link to={item.link}>
                        {item.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
            <Card className="border-0 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardDescription>
                  Latest updates and actions in your case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full",
                          activity.color
                        )}
                      >
                        {renderIcon(activity.icon, "h-4 w-4")}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.detail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}