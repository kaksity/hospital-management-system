"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Scan,
  User,
  List,
  Edit,
  FileText,
  ChevronRight,
  ChevronDown,
  ListFilter,
  UserMinus,
  UserPlus,
  X,
  UserCheck,
  UserX,
  Users,
  LayoutGrid,
  Calendar as CalendarIcon,
  Eye,
  Hospital
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ViewTaskModal from "@/components/Modals/ViewTaskModal";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  referringHospital?: string;
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
    date: "20 Jan 2026",
    service: "MRI",
    subService: "Brain with Contrast",
    isEmergency: true,
    isComparison: false,
    tags: ["neuro", "urgent"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "19 Jan 2026",
    dueDate: "20 Jan 2026",
    referralNotes: "Rule out metastases, known lung cancer",
    isWalkIn: false,
    paymentStatus: "insurance",
    referringHospital: "Evercare Hospital"
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
    date: "20 Jan 2026",
    service: "CT Scan",
    subService: "Chest CT",
    isEmergency: false,
    isComparison: true,
    tags: ["pulmonary", "follow-up"],
    assignmentStatus: "unassigned",
    createdDate: "19 Jan 2026",
    dueDate: "20 Jan 2026",
    isWalkIn: true,
    paymentStatus: "paid",
    referringHospital: "Evercare Hospital"
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
    date: "20 Jan 2026",
    service: "CT Scan",
    subService: "Abdomen & Pelvis",
    isEmergency: false,
    isComparison: false,
    tags: ["abdominal", "routine"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "20 Jan 2026",
    dueDate: "20 Jan 2026",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance",
    referringHospital: "St. Nicholas Hospital"
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
    date: "20 Jan 2026",
    service: "Ultrasound",
    subService: "Pelvic",
    isEmergency: true,
    isComparison: false,
    tags: ["gynae", "urgent"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "19 Jan 2026",
    dueDate: "20 Jan 2026",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance",
    referringHospital: "Lagos University Teaching Hospital"
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
    date: "20 Jan 2026",
    service: "X-Ray",
    subService: "Wrist",
    isEmergency: false,
    isComparison: true,
    tags: ["ortho", "trauma"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "19 Jan 2026",
    dueDate: "20 Jan 2026",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance",
    referringHospital: "Reddington Hospital"
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
    date: "20 Jan 2026",
    service: "MRI",
    subService: "Lumbar Spine",
    isEmergency: false,
    isComparison: false,
    tags: ["spinal", "routine"],
    assignmentStatus: "assigned",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "19 Jan 2026",
    dueDate: "20 Jan 2026",
    referralNotes: "",
    isWalkIn: false,
    paymentStatus: "insurance",
    referringHospital: "Evercare Hospital"
  }
];

const services = ["All Services", "CT Scan", "MRI", "X-Ray", "Ultrasound"];

export default function TaskManager() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [selectedService, setSelectedService] = useState("All Services");
  const [boardCollapsedCards, setBoardCollapsedCards] = useState<Record<string, boolean>>({});
  const [listCollapsedCards, setListCollapsedCards] = useState<Record<string, boolean>>({});
  const [collapsedServices, setCollapsedServices] = useState<Record<string, boolean>>({});
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [activeFilterTab, setActiveFilterTab] = useState<"status" | "service" | "assignment" | "date">("status");

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<Task | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTaskForView, setSelectedTaskForView] = useState<Task | null>(null);

  const toggleCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBoardCollapsedCards(prev => {
      // Board view defaults to expanded (false), so we toggle what's there or default to true (to collapse it)
      const isCurrentlyCollapsed = prev[id] === true;
      return { ...prev, [id]: !isCurrentlyCollapsed };
    });
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
      pending: "bg-yellow-100 text-yellow-800",
      draft: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      assigned: "bg-purple-100 text-purple-800",
      unassigned: "bg-gray-100 text-gray-800",
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
      assigned: "bg-green-100 text-green-800",
      unassigned: "bg-gray-100 text-gray-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: Priority) => {
    const variants = {
      high: "text-red-800 bg-red-100",
      medium: "text-yellow-800 bg-yellow-100",
      low: "text-green-800 bg-green-100",
    };
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  const getPatientTypeBadge = (type: PatientType) => {
    const variants = {
      regular: "bg-blue-100 text-blue-800",
      private: "bg-purple-100 text-purple-800",
      hmo: "bg-green-100 text-green-800",
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

  const [doctors] = useState([
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Radiologist", avatar: "SJ" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Radiologist", avatar: "MC" },
    { id: "3", name: "Dr. Ope Adeyemi", specialty: "Neurologist", avatar: "OA" },
    { id: "4", name: "Dr. David Lee", specialty: "Orthopedist", avatar: "DL" },
    { id: "5", name: "Dr. Emily Brown", specialty: "Cardiologist", avatar: "EB" },
  ]);
  const [doctorSearch, setDoctorSearch] = useState("");

  // Filter doctors based on search
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
    );
  }, [doctorSearch, doctors]);

  // Function to handle assignment
  const handleAssignTask = (taskId: string, doctorId: string) => {
    console.log(`Assigning task ${taskId} to doctor ${doctorId}`);
    // Here you would typically make an API call
    setAssignmentModalOpen(false);
    setSelectedTaskForAssignment(null);
  };

  // Function to handle reassignment
  const handleReassignTask = (task: Task, doctorId: string) => {
    console.log(`Reassigning task ${task.id} from ${task.assignedDoctor} to doctor ${doctorId}`);
    // Here you would typically make an API call
    setAssignmentModalOpen(false);
    setSelectedTaskForAssignment(null);
  };

  return (
    <div className="flex flex-col h-full overflow-x-hidden bg-[#fafafa]">
      {/* Header section fixed */}
      <div className="flex-none space-y-6 p-6 pb-4 bg-background border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Tasks</h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Monitor and assign reporting tasks to radiologists</p>
          </div>
          <Button
            className="h-9 px-4" size="sm"
            onClick={() => navigate("/task-manager/create")}
          >
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
                            {statusFilter === s && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-[hsl(var(--primary))]" />}
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
                            {selectedService === s && <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--primary))] ml-auto" />}
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
                      <div>
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
                            {assignmentFilter === a && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-[hsl(var(--primary))]" />}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFilterTab === "date" && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700 mb-3">Filter by Date Range</p>

                      <div className="flex items-center gap-0 border border-slate-200 rounded-md overflow-hidden bg-white h-9">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "h-full px-3 justify-start w-full text-left font-normal gap-2 rounded-none border-none text-xs",
                                !dateRange.from && "text-slate-400"
                              )}
                            >
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {dateRange.from ? format(dateRange.from, "MMM dd") : "Start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <div className="w-px h-4 bg-slate-200 shrink-0" />

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "h-full px-3 justify-start w-full text-left font-normal gap-2 rounded-none border-none text-xs",
                                !dateRange.to && "text-slate-400"
                              )}
                            >
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {dateRange.to ? format(dateRange.to, "MMM dd") : "End date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        {(dateRange.from || dateRange.to) && (
                          <>
                            <div className="w-px h-4 bg-slate-200 shrink-0" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-full w-8 text-slate-400 hover:text-slate-600 rounded-none"
                              onClick={() => { setDateRange({ from: undefined, to: undefined }); }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Display selected date range */}
                      {(dateRange.from || dateRange.to) && (
                        <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-2.5 w-2.5" />
                            <span className="font-medium">
                              {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Any start"}
                              {" → "}
                              {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Any end"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Quick date presets */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quick filters</p>
                        <div className="flex flex-wrap gap-1">
                          {[
                            {
                              label: "Today", getDates: () => {
                                const today = new Date();
                                return { from: today, to: today };
                              }
                            },
                            {
                              label: "Yesterday", getDates: () => {
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                return { from: yesterday, to: yesterday };
                              }
                            },
                            {
                              label: "Last 7 days", getDates: () => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 6);
                                return { from: start, to: end };
                              }
                            },
                            {
                              label: "This month", getDates: () => {
                                const now = new Date();
                                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                return { from: start, to: end };
                              }
                            },
                            { label: "Clear", getDates: () => ({ from: undefined, to: undefined }) }
                          ].map((preset) => (
                            <Button
                              key={preset.label}
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] px-2 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                              onClick={() => setDateRange(preset.getDates())}
                            >
                              {preset.label}
                            </Button>
                          ))}
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
                      <X className="h-3.5 w-3.5" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-1 bg-[#fafafa] p-1 rounded-lg border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("board")}
                className={cn(
                  "h-8 gap-2 px-3 transition-all duration-200 font-medium",
                  viewMode === "board"
                    ? "bg-white text-[hsl(var(--primary))] !font-semibold"
                    : "text-slate-600 hover:bg-white/80 hover:text-[hsl(var(--primary))]"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="text-xs ">Board</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-8 gap-2 px-3 transition-all duration-200 font-medium",
                  viewMode === "list"
                    ? "bg-white text-[hsl(var(--primary))] !font-semibold"
                    : "text-slate-600 hover:bg-white/80 hover:text-[hsl(var(--primary))]"
                )}
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
                  <div className="flex items-center justify-between flex-none pb-3 pt-2 border-b-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm tracking-tight text-slate-700">{service}</h3>
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {serviceTasks.length}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    {serviceTasks.map((task) => {
                      const isCollapsed = boardCollapsedCards[task.id] === true;
                      return (
                        <Card
                          key={task.id}
                          className={cn(
                            "transition-all duration-200 border-l-4",
                            isCollapsed ? "py-1" : "py-0"
                          )}
                          style={{ borderLeftColor: getStatusBorderColor(task) }}
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
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <Avatar className="h-8 w-8 border border-muted shadow-sm shrink-0">
                                    <AvatarImage src={getPatientAvatarPath(task.id, "Male")} alt={task.patient} />
                                    <AvatarFallback className={cn("text-[10px] font-bold", getAvatarBg(task.patient))}>
                                      {getAvatarInitials(task.patient)}
                                    </AvatarFallback>
                                  </Avatar>
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
                                    </div>
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
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedTaskForView(task);
                                        setViewModalOpen(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                      View Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => navigate(`/task-manager/edit/${task.id}`)}
                                    >
                                      <Edit className="h-4 w-4 text-muted-foreground" />
                                      Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => navigate("/diagnostic-reports/create", { state: { task } })}
                                    >
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                      Start Report
                                    </DropdownMenuItem>
                                    {/* Assignment actions */}
                                    {task.assignedDoctor ? (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedTaskForAssignment(task);
                                        setAssignmentModalOpen(true);
                                      }}>
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Reassign Task
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedTaskForAssignment(task);
                                        setAssignmentModalOpen(true);
                                      }}>
                                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                                        Assign to Doctor
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                      Mark as Completed
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
                                    <Badge variant="default" className="bg-red-100 text-red-800 uppercase text-[10px] font-bold py-0">
                                      Emergency
                                    </Badge>
                                  )}
                                  {task.isComparison && (
                                    <Badge variant="default" className="bg-blue-100 text-blue-800 uppercase text-[10px] font-bold py-0">
                                      Comparison
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                                  <CalendarIcon className="h-3 w-3" />
                                  {task.date} {task.time}
                                </div>

                                <div className="pt-3 border-t space-y-2">
                                  {task.assignedDoctor && (
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Stethoscope className="h-3 w-3 text-primary" />
                                      </div>
                                      <span className="text-[11px] font-semibold text-slate-600">{task.assignedDoctor}</span>
                                    </div>
                                  )}
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
                          <TableHead className="font-semibold text-slate-500 uppercase text-[11px] tracking-wider">Task ID</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Patient Details</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Task</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Reporting Doctor</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Status</TableHead>
                          <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Date</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceTasks.map((task) => {
                          const isCollapsed = listCollapsedCards[task.id] !== false;
                          return (
                            <React.Fragment key={task.id}>
                              <TableRow
                                className={cn(
                                  "cursor-pointer transition-colors border",
                                  !isCollapsed ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                                )}
                                onClick={() => setListCollapsedCards(prev => ({ ...prev, [task.id]: !isCollapsed }))}
                              >
                                <TableCell className="px-6">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <code className="text-[10px] font-semibold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                      {task.id}
                                    </code>
                                    <div className="flex gap-1">
                                      {task.isEmergency && <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" title="Emergency" />}
                                      {task.isComparison && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" title="Comparison" />}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7 border border-muted shadow-sm shrink-0">
                                      <AvatarImage src={getPatientAvatarPath(task.id, "Male")} alt={task.patient} />
                                      <AvatarFallback className={cn("text-[10px] font-bold", getAvatarBg(task.patient))}>
                                        {getAvatarInitials(task.patient)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-slate-700">{task.patient}</span>
                                        <Badge
                                          variant="default"
                                          className={cn("text-[10px] font-extrabold capitalize border h-4 px-1.5", getPatientTypeBadge(task.patientType))}
                                        >
                                          {task.patientType}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
                                    <Scan className="h-3.5 w-3.5 opacity-60" />
                                    {task.subService}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {task.assignedDoctor ? (
                                      <>
                                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                          <Stethoscope className="h-3.5 w-3.5 text-green-600" />
                                        </div>
                                        <span className="text-[13px] font-semibold text-slate-700">{task.assignedDoctor}</span>
                                      </>
                                    ) : (
                                      <span className="text-[13px] font-semibold text-slate-500">Unassigned</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={cn("text-[10px] px-2 py-0 font-semibold capitalize", getStatusBadge(task.status))}>
                                    {task.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-[13px] font-semibold text-slate-700">{task.date} {task.time}</div>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[220px]">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedTaskForView(task);
                                          setViewModalOpen(true);
                                        }}
                                      >
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        View Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => navigate(`/task-manager/edit/${task.id}`)}
                                      >
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                        Edit Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => navigate("/diagnostic-reports/create", { state: { task } })}
                                      >
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Start Report
                                      </DropdownMenuItem>
                                      {/* Assignment actions */}
                                      {task.assignedDoctor ? (
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedTaskForAssignment(task);
                                          setAssignmentModalOpen(true);
                                        }}>
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          Reassign Task
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedTaskForAssignment(task);
                                          setAssignmentModalOpen(true);
                                        }}>
                                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                                          Assign to Doctor
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                        Mark as Completed
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>

                              {!isCollapsed && (
                                <TableRow className="bg-slate-50/30 hover:bg-slate-50/40 transition-colors border">
                                  <TableCell colSpan={8} className="p-0">
                                    <div className="px-16 py-4 flex flex-col gap-4 border-l-[3px] border-[hsl(var(--primary))] bg-slate-50/20">
                                      <div className="grid grid-cols-4 gap-8">
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Priority</p>
                                          <div className="flex items-center gap-1.5 pt-1">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f0a421ff' : '#10b981' }} />
                                            <span className="text-[13px] font-semibold capitalize text-slate-700">{task.priority}</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Referring Hospital</p>
                                          <div className="flex items-center gap-2 pt-1">
                                            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                              <Hospital className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{task.referringHospital || "N/A"}</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Referring Doctor</p>
                                          <div className="flex items-center gap-2 pt-1">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                              <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{task.referringDoctor || "N/A"}</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">Flags</p>
                                          <div className="flex items-center gap-2 pt-1">
                                            {task.isEmergency && (
                                              <Badge className="text-[10px] font-semibold uppercase bg-red-100 text-red-800 h-5">
                                                Emergency
                                              </Badge>
                                            )}
                                            {task.isComparison && (
                                              <Badge className="text-[10px] font-semibold uppercase bg-blue-100 text-blue-800 h-5">
                                                Comparison
                                              </Badge>
                                            )}
                                            {!task.isEmergency && !task.isComparison && (
                                              <span className="text-[11px] font-medium text-slate-400">None</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
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

      {/* Assignment Modal */}
      <Dialog
        open={assignmentModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAssignmentModalOpen(false);
            setSelectedTaskForAssignment(null);
            setSelectedDoctorId(null);
            setDoctorSearch("");
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>
              {selectedTaskForAssignment?.assignedDoctor ? 'Reassign' : 'Assign'} Task
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-1">
                <code className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {selectedTaskForAssignment?.id}
                </code>
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedTaskForAssignment && (
            <div className="flex flex-col h-full overflow-hidden">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Select a doctor to{" "}
                  {selectedTaskForAssignment.assignedDoctor
                    ? "reassign"
                    : "assign"}{" "}
                  this task:
                </p>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search doctors"
                    className="pl-10 h-10 border-input"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 b-2 max-h-70">
                <div className="space-y-1.5 py-2">
                  {filteredDoctors.map((doctor) => {
                    const isTaskAssignedToDoctor =
                      selectedTaskForAssignment.assignedDoctor === doctor.name;
                    const isActuallySelected = selectedDoctorId === doctor.id;

                    return (
                      <div
                        key={doctor.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-50 hover:border-input",
                          isTaskAssignedToDoctor
                            ? "bg-slate-50 border-input pointer-events-none opacity-60"
                            : isActuallySelected
                              ? "bg-slate-50 border-primary shadow-[0_0_0_1px_rgba(var(--primary),0.05)]"
                              : "bg-white border-input/50"
                        )}
                        onClick={() => setSelectedDoctorId(doctor.id)}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                            isActuallySelected
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          <Stethoscope className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-slate-800 leading-tight">
                            {doctor.name}
                          </div>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {doctor.specialty}
                          </p>
                        </div>
                        {isTaskAssignedToDoctor && (
                          <Badge className="bg-[#EBFFF6] text-[#008037] text-[10px] border-[#58BF85] font-bold">
                            Current
                          </Badge>
                        )}
                        {isActuallySelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    );
                  })}

                  {filteredDoctors.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">
                        No doctors found matching "{doctorSearch}"
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {selectedTaskForAssignment.assignedDoctor && (
                <div>
                  <div className="p-4 py-3 bg-amber-50 rounded-xl border border-[#ecd471]">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 min-w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-[12px] text-amber-700 leading-snug">
                          This task is currently assigned to{" "}
                          <span className="font-bold">
                            {selectedTaskForAssignment.assignedDoctor}
                          </span>
                          . Reassigning will notify both the current and new
                          doctor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 border-t bg-slate-50/50">
            <Button
              variant="outline"
              onClick={() => {
                setAssignmentModalOpen(false);
                setSelectedTaskForAssignment(null);
                setSelectedDoctorId(null);
                setDoctorSearch("");
              }}
              className="font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTaskForAssignment && selectedDoctorId) {
                  const doctorName =
                    doctors.find((d) => d.id === selectedDoctorId)?.name || "";
                  if (selectedTaskForAssignment.assignedDoctor) {
                    handleReassignTask(selectedTaskForAssignment, selectedDoctorId);
                  } else {
                    handleAssignTask(selectedTaskForAssignment.id, selectedDoctorId);
                  }
                  toast.success(`Task reassigned to ${doctorName}`);
                }
              }}
              disabled={!selectedDoctorId}
            >
              {selectedDoctorId ? (
                <>
                  Reassign to Dr.{" "}
                  {
                    doctors.find((d) => d.id === selectedDoctorId)?.name.split(" ")
                      .pop()
                  }
                </>
              ) : selectedTaskForAssignment?.assignedDoctor ? (
                "Reassign Task"
              ) : (
                "Assign Task"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Task Modal */}
      {selectedTaskForView && (
        <ViewTaskModal
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedTaskForView(null);
          }}
          task={selectedTaskForView}
          onEdit={() => {
            navigate(`/task-manager/edit/${selectedTaskForView.id}`);
            setViewModalOpen(false);
          }}
          onDelete={() => {
            // Add delete logic if needed
            console.log("Delete task", selectedTaskForView.id);
            setViewModalOpen(false);
          }}
        />
      )}
    </div>
  );
}