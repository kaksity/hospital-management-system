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
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  case: string;
  task: string;
  priority: string;
  due: string;
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
  systemAlerts: SystemAlert[];
}

interface AttorneyData {
  stats: StatItem[];
  assignedCases: CaseItem[];
}

interface ParalegalData {
  stats: StatItem[];
  tasks: TaskItem[];
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
  return 'recentCases' in data && 'systemAlerts' in data;
};

const isAttorneyData = (data: DashboardData): data is AttorneyData => {
  return 'assignedCases' in data;
};

const isParalegalData = (data: DashboardData): data is ParalegalData => {
  return 'tasks' in data;
};

const isClientData = (data: DashboardData): data is ClientData => {
  return 'activeCase' in data && 'quickActions' in data && 'recentActivity' in data;
};

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data for different roles with explicit typing
  const dashboardData: Record<string, DashboardData> = {
    admin: {
      stats: [
        { label: "Total Cases", value: "142", change: "+12%", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
        { label: "Active Users", value: "28", change: "+5%", icon: Users, color: "text-green-600 bg-green-100" },
        { label: "Documents", value: "1,248", change: "+23%", icon: FileText, color: "text-purple-600 bg-purple-100" },
        { label: "Pending Review", value: "18", change: "-3%", icon: Clock, color: "text-amber-600 bg-amber-100" }
      ],
      recentCases: [
        { id: "ACV-2024-001", client: "Alex Turner", type: "O-1A", status: "Active", progress: 75, deadline: "2025-03-15" },
        { id: "ACV-2024-002", client: "Maria Garcia", type: "EB-2 NIW", status: "Review", progress: 45, deadline: "2025-04-20" },
        { id: "ACV-2024-003", client: "James Wilson", type: "L-1A", status: "Draft", progress: 20, deadline: "2025-05-10" }
      ],
      systemAlerts: [
        { type: "warning" as const, message: "Storage at 85% capacity", action: "Upgrade Plan" },
        { type: "info" as const, message: "New feature: Bulk document upload", action: "Learn More" }
      ]
    },
    attorney: {
      stats: [
        { label: "My Cases", value: "24", change: "+2", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
        { label: "For Review", value: "8", change: "+3", icon: Clock, color: "text-amber-600 bg-amber-100" },
        { label: "Approved", value: "42", change: "+5", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
        { label: "Urgent", value: "3", change: "-1", icon: AlertCircle, color: "text-red-600 bg-red-100" }
      ],
      assignedCases: [
        { 
          id: "ACV-2024-001", 
          client: "Alex Turner", 
          type: "O-1A", 
          priority: "High", 
          lastActivity: "2 hours ago", 
          status: "Review" 
        },
        { 
          id: "ACV-2024-005", 
          client: "Sarah Chen", 
          type: "EB-1A", 
          priority: "Medium", 
          lastActivity: "1 day ago", 
          status: "Draft" 
        },
        { 
          id: "ACV-2024-008", 
          client: "David Kim", 
          type: "O-1B", 
          priority: "High", 
          lastActivity: "3 hours ago", 
          status: "Active" 
        }
      ]
    },
    paralegal: {
      stats: [
        { label: "Assigned Cases", value: "18", change: "+3", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
        { label: "Documents to Process", value: "23", change: "+8", icon: FileText, color: "text-amber-600 bg-amber-100" },
        { label: "Completed", value: "12", change: "+4", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
        { label: "Client Messages", value: "7", change: "+2", icon: MessageSquare, color: "text-purple-600 bg-purple-100" }
      ],
      tasks: [
        { case: "ACV-2024-001", task: "Upload missing award certificates", priority: "High", due: "Tomorrow" },
        { case: "ACV-2024-002", task: "Follow up on expert letters", priority: "Medium", due: "2 days" },
        { case: "ACV-2024-003", task: "Organize media coverage files", priority: "Low", due: "1 week" }
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
          link: "/documents/upload"
        },
        {
          title: "Messages",
          desc: "2 new messages from your team",
          icon: MessageSquare,
          iconColor: "text-blue-600 bg-blue-100",
          link: "/messages"
        },
        {
          title: "Case Details",
          desc: "View complete petition status",
          icon: FileText,
          iconColor: "text-green-600 bg-green-100",
          link: "/cases/ACV-2024-001"
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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back,{" "}
            <span className="text-primary">{user?.name || "there"}</span>
          </h1>
          <p className="text-muted-foreground">
            {userRole === "admin" && "Platform administration and analytics"}
            {userRole === "attorney" && "Case review and legal oversight"}
            {userRole === "paralegal" && "Case management and document processing"}
            {userRole === "client" && "Your immigration case progress"}
          </p>
        </div>
        
        {userRole !== "client" && (
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button> */}
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </div>
        )}
      </div>

      {/* Role-specific Dashboard Content */}
      {userRole === "admin" && isAdminData(data) && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3 p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", stat.color)}>
                      {renderIcon(stat.icon, "h-4 w-4")}
                    </div>
                    <div className="">
                      <CardDescription className="text-sm font-medium">
                        {stat.label}
                      </CardDescription>
                      <CardTitle className="text-2xl">{stat.value}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                {/* <CardContent className="p-4 pt-0">
                  <p className={cn(
                    "text-xs",
                    stat.change.startsWith('+') ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change} from last month
                  </p>
                </CardContent> */}
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Cases */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Latest case activity across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentCases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell className="font-medium">{caseItem.id}</TableCell>
                        <TableCell>{caseItem.client}</TableCell>
                        <TableCell>{caseItem.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(caseItem.status)}>
                            {caseItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={caseItem.progress} className="w-16 h-2" />
                            <span className="text-sm font-medium">{caseItem.progress}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Platform notifications and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.systemAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Bell className={cn(
                      "h-5 w-5 mt-0.5",
                      alert.type === "warning" ? "text-amber-600" : "text-blue-600"
                    )} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.message}</p>
                      <Button variant="link" className="h-auto p-0 text-sm">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {userRole === "attorney" && isAttorneyData(data) && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3 p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", stat.color)}>
                      {renderIcon(stat.icon, "h-4 w-4")}
                    </div>
                    <div>
                      <CardTitle className="text-muted-foreground text-sm font-medium">{stat.label}</CardTitle>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Assigned Cases */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>My Assigned Cases</CardTitle>
              <CardDescription>Cases requiring your legal review</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Case ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.assignedCases.map((caseItem) => (
                    <TableRow key={caseItem.id} className="hover:bg-transparent">
                      <TableCell className="font-medium">{caseItem.id}</TableCell>
                      <TableCell>{caseItem.client}</TableCell>
                      <TableCell>{caseItem.type}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(caseItem.priority!)}>
                          {caseItem.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{caseItem.lastActivity}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Link to={`/cases/${caseItem.id}`} className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {userRole === "paralegal" && isParalegalData(data) && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3 p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", stat.color)}>
                      {renderIcon(stat.icon, "h-4 w-4")}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  </div>
                </CardHeader>
                {/* <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} today
                  </p>
                </CardContent> */}
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Your current assignments and deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Case: {task.case}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                    </div>
                    <Badge className={getPriorityBadge(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Create Case Report
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message Clients
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