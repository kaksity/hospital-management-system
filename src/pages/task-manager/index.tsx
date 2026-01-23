"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Scan,
  User,
  Grid,
  List,
  AlertTriangle,
  FileIcon,
  Edit,
  FileText,
  ChevronRight,
  ChevronDown,
  ListFilter,
  UserMinus,
  UserPlus,
  Calendar,
  X,
  UserCheck,
  UserX,
  Users
} from "lucide-react";
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PatientType = "regular" | "private" | "hmo";
type TaskStatus = "pending" | "draft" | "completed" | "assigned" | "unassigned";
type Priority = "high" | "medium" | "low";
type AssignmentStatus = "assigned" | "unassigned";

interface Task {
  id: string;
  scanType: string;
  patient: string;
  patientType: PatientType;
  referringDoctor?: string;
  assignedDoctor?: string;
  status: TaskStatus;
  priority: Priority;
  time: string;
  date: string;
  service: string;
  subService: string;
  isEmergency: boolean;
  isComparison: boolean;
  tags: string[];
  assignmentStatus: AssignmentStatus;
  assignedTo?: string;
  createdDate?: string;
  dueDate?: string;
  referralNotes?: string;
  isWalkIn: boolean;
  paymentStatus?: "paid" | "pending" | "insurance";
}

const tasks: Task[] = [
  {
    id: "TSK-2024-001",
    scanType: "MRI Brain (Contrast)",
    patient: "John Adebayo",
    patientType: "hmo",
    referringDoctor: "Dr. Ope Adeyemi",
    assignedDoctor: "Dr. Sarah Johnson",
    status: "pending",
    priority: "high",
    time: "10:30 AM",
    date: "2024-11-20",
    service: "MRI",
    subService: "Brain with Contrast",
    isEmergency: true,
    isComparison: false,
    tags: ["neuro", "urgent"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "2024-11-19",
    dueDate: "2024-11-20",
    referralNotes: "Rule out metastases, known lung cancer",
    isWalkIn: false,
    paymentStatus: "insurance"
  },
  {
    id: "TSK-2024-002",
    scanType: "CT Chest",
    patient: "Maria Garcia",
    patientType: "private",
    referringDoctor: "Dr. Michael Chen",
    assignedDoctor: "Dr. Sarah Johnson",
    status: "draft",
    priority: "medium",
    time: "11:15 AM",
    date: "2024-11-20",
    service: "CT Scan",
    subService: "Chest CT",
    isEmergency: false,
    isComparison: true,
    tags: ["pulmonary", "follow-up"],
    assignmentStatus: "unassigned",
    createdDate: "2024-11-19",
    dueDate: "2024-11-20",
    isWalkIn: true,
    paymentStatus: "paid"
  },
  {
    id: "TSK-2024-003",
    scanType: "CT Abdomen",
    patient: "James Wilson",
    patientType: "regular",
    referringDoctor: undefined,
    assignedDoctor: "Dr. David Lee",
    status: "completed",
    priority: "low",
    time: "09:00 AM",
    date: "2024-11-19",
    service: "CT Scan",
    subService: "Abdomen & Pelvis",
    isEmergency: false,
    isComparison: false,
    tags: ["abdominal", "routine"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "2024-11-19",
    dueDate: "2024-11-20",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance"
  },
  {
    id: "TSK-2024-004",
    scanType: "Ultrasound Pelvis",
    patient: "Lisa Wang",
    patientType: "hmo",
    referringDoctor: "Dr. Michael Chen",
    assignedDoctor: "Dr. David Lee",
    status: "pending",
    priority: "high",
    time: "02:45 PM",
    date: "2024-11-20",
    service: "Ultrasound",
    subService: "Pelvic",
    isEmergency: true,
    isComparison: false,
    tags: ["gynae", "urgent"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "2024-11-19",
    dueDate: "2024-11-20",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance"
  },
  {
    id: "TSK-2024-005",
    scanType: "X-Ray Wrist",
    patient: "Robert Kim",
    patientType: "private",
    referringDoctor: "Dr. Michael Chen",
    assignedDoctor: "Dr. David Lee",
    status: "pending",
    priority: "medium",
    time: "03:30 PM",
    date: "2024-11-20",
    service: "X-Ray",
    subService: "Wrist",
    isEmergency: false,
    isComparison: true,
    tags: ["ortho", "trauma"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "2024-11-19",
    dueDate: "2024-11-20",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance"
  },
  {
    id: "TSK-2024-006",
    scanType: "MRI Spine",
    patient: "Sarah Connor",
    patientType: "regular",
    referringDoctor: "Dr. Ope Adeyemi",
    assignedDoctor: "Dr. David Lee",
    status: "draft",
    priority: "medium",
    time: "01:15 PM",
    date: "2024-11-20",
    service: "MRI",
    subService: "Lumbar Spine",
    isEmergency: false,
    isComparison: false,
    tags: ["spinal", "routine"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "2024-11-19",
    dueDate: "2024-11-20",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance"
  }
];

const services = ["All Services", "CT Scan", "MRI", "X-Ray", "Ultrasound"];

export default function TaskManager() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [selectedService, setSelectedService] = useState("All Services");
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [collapsedServices, setCollapsedServices] = useState<Record<string, boolean>>({});
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [activeFilterTab, setActiveFilterTab] = useState<"status" | "service" | "assignment" | "date">("status");

  const toggleCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch =
        task.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.scanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.referringDoctor && task.referringDoctor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.assignedDoctor && task.assignedDoctor.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesService =
        selectedService === "All Services" ||
        task.service === selectedService;

      const matchesAssignment =
        assignmentFilter === "all" ||
        task.assignmentStatus === assignmentFilter;

      // Date range filter
      const taskDate = new Date(task.date);
      const matchesDateRange =
        (!dateRange.from || taskDate >= dateRange.from) &&
        (!dateRange.to || taskDate <= dateRange.to);

      return matchesSearch && matchesStatus && matchesService && matchesAssignment && matchesDateRange;
    });

    // Sort with emergency tasks first, then by priority
    return filtered.sort((a, b) => {
      if (a.isEmergency && !b.isEmergency) return -1;
      if (!a.isEmergency && b.isEmergency) return 1;

      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [statusFilter, searchQuery, selectedService, assignmentFilter, dateRange]);

  const statusCounts = useMemo(() => {
    return {
      pending: tasks.filter(t => t.status === "pending").length,
      draft: tasks.filter(t => t.status === "draft").length,
      completed: tasks.filter(t => t.status === "completed").length,
    };
  }, []);

  const getStatusBadge = (status: TaskStatus) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      assigned: "bg-purple-100 text-purple-800 border-purple-200",
      unassigned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const statusColors = {
    pending: "bg-yellow-500",
    draft: "bg-blue-500",
    completed: "bg-green-500",
    assigned: "bg-purple-500",
    unassigned: "bg-gray-500",
  };

  const getAssignmentBadge = (status: AssignmentStatus) => {
    const variants = {
      assigned: "bg-green-100 text-green-800 border-green-200",
      unassigned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: Priority) => {
    const variants = {
      high: "border-red-200 text-red-700 bg-red-50",
      medium: "border-yellow-200 text-yellow-700 bg-yellow-50",
      low: "border-green-200 text-green-700 bg-green-50",
    };
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  const getPatientTypeBadge = (type: PatientType) => {
    const variants = {
      regular: "bg-blue-100 text-blue-700 border-blue-200",
      private: "bg-purple-100 text-purple-700 border-purple-200",
      hmo: "bg-green-100 text-green-700 border-green-200",
    };
    return variants[type];
  };

  const getStatusBorderColor = (task: Task) => {
    if (task.isEmergency) return '#ef4444'; // Red for emergency

    const statusColors = {
      pending: '#f59e0b', // Yellow
      draft: '#3b82f6', // Blue
      completed: '#10b981', // Green
      assigned: '#8b5cf6', // Purple
      unassigned: '#6b7280', // Gray
    };
    return statusColors[task.status] || '#6b7280';
  };

  const groupTasksByService = () => {
    const groups: Record<string, Task[]> = {};

    filteredTasks.forEach(task => {
      if (!groups[task.service]) {
        groups[task.service] = [];
      }
      groups[task.service].push(task);
    });

    return groups;
  };

  const serviceGroups = groupTasksByService();

  return (
    <div className="flex flex-col h-full overflow-x-hidden bg-[#fafafa]">
      {/* Header section fixed */}
      <div className="flex-none space-y-6 p-6 pb-4 bg-background border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-light">Tasks</h1>
            <p className="text-muted-foreground text-sm">Monitor and assign reporting tasks to radiologists</p>
          </div>
          <Button className="gap-2 shadow-sm font-semibold">
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full sm:w-auto flex-1">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, patients, doctors..."
                className="pl-9 h-10 border bg-muted/20 focus-visible:bg-background transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              {(['pending', 'draft', 'completed'] as const).map((status) => (
                <div key={status} className="flex items-center gap-2 group cursor-default">
                  <div className={cn("h-2.5 w-2.5 rounded-full", statusColors[status], status === 'pending' && "animate-pulse")} />
                  <span className="text-xs font-semibold text-slate-600 capitalize">{status}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-muted font-semibold">
                    {statusCounts[status]}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 px-3 min-w-[100px] justify-between border">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {statusFilter === 'all' && selectedService === 'All Services' && assignmentFilter === 'all'
                        ? 'Filter'
                        : `${statusFilter !== 'all' ? statusFilter : ''}${statusFilter !== 'all' && (selectedService !== 'All Services' || assignmentFilter !== 'all') ? ' • ' : ''}${selectedService !== 'All Services' ? selectedService : ''}${selectedService !== 'All Services' && assignmentFilter !== 'all' ? ' • ' : ''}${assignmentFilter !== 'all' ? assignmentFilter : ''}`
                      }
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[400px] p-0 flex">
                {/* Vertical Tabs */}
                <div className="w-[120px] border-r bg-white">
                  <div className="p-3">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-[13px] h-8 rounded-none",
                        activeFilterTab === "status"
                          ? "bg-[#e9f2fe] text-[#1868db] font-semibold border-l-2 border-[#1868db]"
                          : "text-slate-600 hover:bg-white/50"
                      )}
                      onClick={() => setActiveFilterTab("status")}
                    >
                      Status
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-[13px] h-8 rounded-none",
                        activeFilterTab === "service"
                          ? "bg-[#e9f2fe] text-[#1868db] font-semibold border-l-2 border-[#1868db]"
                          : "text-slate-600 hover:bg-white/50"
                      )}
                      onClick={() => setActiveFilterTab("service")}
                    >
                      Service
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-[13px] h-8 rounded-none",
                        activeFilterTab === "assignment"
                          ? "bg-[#e9f2fe] text-[#1868db] font-semibold border-l-2 border-[#1868db]"
                          : "text-slate-600 hover:bg-white/50"
                      )}
                      onClick={() => setActiveFilterTab("assignment")}
                    >
                      Assignment
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-[13px] h-8 rounded-none",
                        activeFilterTab === "date"
                          ? "bg-[#e9f2fe] text-[#1868db] font-semibold border-l-2 border-[#1868db]"
                          : "text-slate-600 hover:bg-white/50"
                      )}
                      onClick={() => setActiveFilterTab("date")}
                    >
                      Date
                    </Button>
                  </div>
                </div>

                {/* Filter Content Area */}
                <div className="flex-1 p-4 max-h-[300px] overflow-y-auto">
                  {activeFilterTab === "status" && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700">Filter by Status</p>
                      <div>
                        {["all", "pending", "draft", "completed", "assigned", "unassigned"].map((s) => (
                          <Button
                            key={s}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start capitalize text-[13px] h-9",
                              statusFilter === s
                                ? "bg-primary/10 text-primary font-semibold "
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                            onClick={() => setStatusFilter(s)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                s === 'pending' ? 'bg-yellow-500' :
                                  s === 'draft' ? 'bg-blue-500' :
                                    s === 'completed' ? 'bg-green-500' :
                                      s === 'assigned' ? 'bg-purple-500' :
                                        s === 'unassigned' ? 'bg-gray-500' :
                                          'bg-slate-300'
                              )} />
                              {s}
                            </div>
                            {statusFilter === s && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFilterTab === "service" && (
                    <div className="space-y-3">
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-xs font-bold text-slate-700">Filter by Service</p>
                        <div className="relative w-full">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            placeholder="Search services..."
                            className="h-9 text-xs w-full pl-8"
                            onChange={(e) => {
                              // Implement service search here
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        {services.map((s) => (
                          <Button
                            key={s}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-[13px] h-9",
                              selectedService === s
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                            onClick={() => setSelectedService(s)}
                          >
                            <div className="flex items-center gap-2">
                              <Scan className="h-3.5 w-3.5 text-muted-foreground" />
                              {s}
                            </div>
                            {selectedService === s && <CheckCircle2 className="h-3.5 w-3.5 text-[#006bff] ml-auto" />}
                          </Button>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full text-xs text-slate-500 hover:text-slate-700 mt-2">
                        <Plus className="h-3 w-3 mr-1" />
                        Show more services
                      </Button>
                    </div>
                  )}

                  {activeFilterTab === "assignment" && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700">Filter by Assignment</p>
                      <div className="space-y-1">
                        {["all", "assigned", "unassigned"].map((a) => (
                          <Button
                            key={a}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start capitalize text-[13px] h-9",
                              assignmentFilter === a
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                            onClick={() => setAssignmentFilter(a)}
                          >
                            <div className="flex items-center gap-2">
                              {a === 'assigned' ? (
                                <UserCheck className="h-3.5 w-3.5 text-green-500" />
                              ) : a === 'unassigned' ? (
                                <UserX className="h-3.5 w-3.5 text-red-500" />
                              ) : (
                                <Users className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              {a}
                            </div>
                            {assignmentFilter === a && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFilterTab === "date" && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700">Filter by Date Range</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-600 mb-2 font-medium">From Date</p>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <Input
                                type="date"
                                className="h-9 text-sm pl-8"
                                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-2 font-medium">To Date</p>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <Input
                                type="date"
                                className="h-9 text-sm pl-8"
                                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {(statusFilter !== 'all' || selectedService !== 'All Services' || assignmentFilter !== 'all' || dateRange.from || dateRange.to) && (
                  <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-3">
                    <Button
                      variant="ghost"
                      className="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setStatusFilter('all');
                        setSelectedService('All Services');
                        setAssignmentFilter('all');
                        setDateRange({});
                      }}
                    >
                      <X className="h-3.5 w-3.5 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border">
              <Button
                variant={viewMode === "board" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("board")}
                className={cn("h-8 gap-2 px-3", viewMode === "board" && "bg-background text-primary font-bold")}
              >
                <Grid className="h-3.5 w-3.5" />
                <span className="text-xs">Board</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn("h-8 gap-2 px-3", viewMode === "list" && "bg-background text-primary font-bold")}
              >
                <List className="h-3.5 w-3.5" />
                <span className="text-xs">List</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-w-0">
        {viewMode === "board" ? (
          <div className="h-full overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="flex gap-6 min-w-max p-6 pb-4">
              {Object.entries(serviceGroups).map(([service, serviceTasks]) => (
                <div key={service} className="w-[320px] bg-background border rounded-lg flex flex-col gap-4 px-3 py-2">
                  <div className="flex items-center justify-between flex-none pb-2 border-b-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm tracking-tight text-slate-700">{service}</h3>
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {serviceTasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    {serviceTasks.map((task) => {
                      const isCollapsed = collapsedCards[task.id];
                      return (
                        <Card
                          key={task.id}
                          className={cn(
                            "transition-all duration-200 cursor-pointer border-l-4",
                            isCollapsed ? "py-1" : "py-0"
                          )}
                          style={{ borderLeftColor: getStatusBorderColor(task) }}
                          onClick={() => setCollapsedCards(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                        >
                          <CardContent className={cn("p-4", isCollapsed && "py-3")}>
                            <div className="flex justify-between items-start">
                              {isCollapsed ? (
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                  <span className="font-bold text-sm truncate text-slate-700">{task.patient}</span>
                                  <div className="flex-shrink-0 flex gap-1">
                                    {task.isEmergency && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Emergency" />}
                                    {task.isComparison && <div className="h-2 w-2 rounded-full bg-blue-500" title="Comparison" />}
                                  </div>
                                  <span className="text-[11px] text-muted-foreground truncate opacity-70">• {task.subService}</span>
                                </div>
                              ) : (
                                <div className="flex-1 min-w-0">
                                  <div className="flex gap-2 items-center mb-1">
                                    <h4 className="font-bold text-sm tracking-tight text-slate-800 truncate">{task.patient}</h4>
                                    <Badge
                                      variant="default"
                                      className={cn("text-[9px] font-extrabold capitalize border", getPatientTypeBadge(task.patientType))}
                                    >
                                      {task.patientType}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 h-4">
                                    <code className="text-[10px] font-semibold text-muted-foreground bg-muted px-1 rounded">{task.id}</code>
                                    <div className="flex gap-1">
                                      {task.isEmergency && <div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                                      {task.isComparison && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="text-[10px] text-slate-500 ml-auto">{task.date}</span>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 opacity-70 hover:opacity-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[220px]">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                                      Edit Task Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                      Start Report
                                    </DropdownMenuItem>
                                    {/* Assignment actions */}
                                    {task.assignedDoctor ? (
                                      <>
                                        <DropdownMenuItem>
                                          <User className="h-4 w-4 mr-2" />
                                          Reassign Task...
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <UserMinus className="h-4 w-4 mr-2" />
                                          Unassign
                                        </DropdownMenuItem>
                                      </>
                                    ) : (
                                      <DropdownMenuItem>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Assign to Radiologist...
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <AlertCircle className="h-4 w-4 mr-2" />
                                      Flag Issue
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 p-0 text-slate-600 hover:text-slate-800"
                                  onClick={(e) => toggleCard(task.id, e)}
                                >
                                  {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>

                            {!isCollapsed && (
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="text-[12px] text-slate-600 flex items-center gap-2 font-semibold">
                                    <Scan className="h-3.5 w-3.5" />
                                    {task.subService}
                                  </div>
                                  <Badge className={cn("text-[9px] px-2 py-0 font-bold capitalize", getStatusBadge(task.status))}>
                                    {task.status}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {task.isEmergency && (
                                    <Badge variant="default" className="bg-red-100 text-red-700 border-red-200 text-[10px] font-bold py-0">
                                      EMERGENCY
                                    </Badge>
                                  )}
                                  {task.isComparison && (
                                    <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] font-bold py-0">
                                      COMPARISON
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t">
                                  <div className="space-y-2">
                                    {task.referringDoctor && (
                                      <div className="flex items-center gap-1.5">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                                          <Stethoscope className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700">{task.referringDoctor}</span>
                                      </div>
                                    )}
                                    {task.assignedDoctor && (
                                      <div className="flex items-center gap-1.5">
                                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                                          <User className="h-2.5 w-2.5 text-green-600" />
                                        </div>
                                        <span className="text-[10px] text-slate-600">Assigned to <span className="font-bold">{task.assignedDoctor}</span></span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                                      <Clock className="h-3 w-3" />
                                      {task.time}
                                    </div>
                                    <div className="text-[10px] text-slate-400">{task.date}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // List View - Grouped by Service with Tables
          <div className="space-y-6 p-6 overflow-y-auto h-full custom-scrollbar">
            {Object.entries(serviceGroups).map(([service, serviceTasks]) => {
              const isServiceCollapsed = collapsedServices[service];
              return (
                <Card key={service} className="overflow-hidden border transition-all duration-200">
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-slate-50/50 transition-colors",
                      !isServiceCollapsed && "border-b bg-slate-50/30"
                    )}
                    onClick={() => setCollapsedServices(prev => ({ ...prev, [service]: !prev[service] }))}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Scan className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-700">{service}</h3>
                        <p className="text-[11px] text-muted-foreground font-semibold">
                          {serviceTasks.length} task{serviceTasks.length !== 1 ? 's' : ''} in queue
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="font-semibold text-[11px] h-8 hover:bg-white hover:text-primary transition-all">
                          <Plus className="h-3.5 w-3.5" />
                          New Task
                        </Button>
                      </div>
                      <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        {isServiceCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {!isServiceCollapsed && (
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-200">
                          <TableHead className="w-[40px] px-6"></TableHead>
                          <TableHead className="w-[120px] font-bold text-slate-500 uppercase text-[10px] tracking-wider">Task ID</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Patient Details</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Task</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Priority</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">Date/Time</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceTasks.map((task) => {
                          const isCollapsed = collapsedCards[task.id] !== false;
                          return (
                            <TableRow
                              key={task.id}
                              className={cn(
                                "cursor-pointer transition-colors border-slate-100",
                                !isCollapsed ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                              )}
                              onClick={() => setCollapsedCards(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                            >
                              <TableCell className="px-6">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                                  {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <code className="text-[10px] font-bold font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                  {task.id}
                                </code>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-700">{task.patient}</span>
                                  <Badge
                                    variant="outline"
                                    className={cn("text-[9px] font-extrabold capitalize border", getPatientTypeBadge(task.patientType))}
                                  >
                                    {task.patientType}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                  <Scan className="h-3.5 w-3.5 opacity-60" />
                                  {task.subService}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={cn("text-[9px] px-2 py-0 font-bold capitalize", getStatusBadge(task.status))}>
                                  {task.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981' }} />
                                  <span className="text-xs font-bold capitalize text-slate-600">{task.priority}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="text-xs font-bold text-slate-500">{task.time}</div>
                                <div className="text-[10px] text-slate-400">{task.date}</div>
                              </TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit Task</DropdownMenuItem>
                                    <DropdownMenuItem><FileText className="h-4 w-4 mr-2" /> Write Report</DropdownMenuItem>
                                    {task.assignedDoctor ? (
                                      <>
                                        <DropdownMenuItem><User className="h-4 w-4 mr-2" /> Reassign</DropdownMenuItem>
                                        <DropdownMenuItem><UserMinus className="h-4 w-4 mr-2" /> Unassign</DropdownMenuItem>
                                      </>
                                    ) : (
                                      <DropdownMenuItem><UserPlus className="h-4 w-4 mr-2" /> Assign</DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><CheckCircle2 className="h-4 w-4 mr-2" /> Mark Completed</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600"><AlertCircle className="h-4 w-4 mr-2" /> Flag Issue</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}

                  {serviceTasks.length === 0 && !isServiceCollapsed && (
                    <div className="p-12 text-center bg-white">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Scan className="h-6 w-6 text-slate-300" />
                      </div>
                      <h4 className="font-bold text-slate-700">No active tasks</h4>
                      <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                        All tasks for this service have been completed.
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}

            {Object.keys(serviceGroups).length === 0 && (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">No tasks found</h3>
                <p className="text-sm text-muted-foreground max-w-[300px] mt-1">
                  Try adjusting your search or filtering by a different status.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}