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
  User
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tasks = [
  {
    id: "TSK-2024-001",
    scanType: "MRI Brain (Contrast)",
    patient: "John Adebayo",
    doctor: "Dr. Ope Adeyemi",
    status: "pending",
    priority: "high",
    time: "10:30 AM",
    date: "2024-11-20"
  },
  {
    id: "TSK-2024-002",
    scanType: "Chest X-Ray",
    patient: "Maria Garcia",
    doctor: "Dr. Michael Chen",
    status: "reporting",
    priority: "medium",
    time: "11:15 AM",
    date: "2024-11-20"
  },
  {
    id: "TSK-2024-003",
    scanType: "CT Abdomen",
    patient: "James Wilson",
    doctor: "Dr. Sarah Johnson",
    status: "completed",
    priority: "low",
    time: "09:00 AM",
    date: "2024-11-19"
  },
  {
    id: "TSK-2024-004",
    scanType: "Ultrasound Pelvis",
    patient: "Lisa Wang",
    doctor: "Dr. Michael Chen",
    status: "pending",
    priority: "high",
    time: "02:45 PM",
    date: "2024-11-20"
  }
];

export default function TaskManager() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.scanType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && task.status === "pending") ||
        (activeTab === "completed" && task.status === "completed");

      return matchesSearch && matchesTab;
    });
  }, [activeTab, searchQuery]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      reporting: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "border-red-200 text-red-700 bg-red-50",
      medium: "border-yellow-200 text-yellow-700 bg-yellow-50",
      low: "border-green-200 text-green-700 bg-green-50",
    };
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Task Queue</h1>
          <p className="text-muted-foreground text-sm">Monitor and assign reporting tasks to radiologists</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Reports</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Currently Reporting</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Today</p>
                <h3 className="text-2xl font-bold">28</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border/50 pb-1">
          <TabsList variant="line" className="justify-start h-auto p-0 bg-transparent gap-8">
            <TabsTrigger
              value="all"
              variant="line"
              className="px-0 pb-3 text-sm font-medium data-[state=active]:bg-transparent"
            >
              All Tasks
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              variant="line"
              className="px-0 pb-3 text-sm font-medium data-[state=active]:bg-transparent"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              variant="line"
              className="px-0 pb-3 text-sm font-medium data-[state=active]:bg-transparent"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto pb-2">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, patients, doctors..."
                className="pl-9 h-10 border-muted-foreground/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead>Task ID</TableHead>
                <TableHead>Scan / Service</TableHead>
                <TableHead>Patient Details</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50 transition-colors border-b border-border/50">
                  <TableCell>
                    <code className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                      {task.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{task.scanType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{task.patient}</span>
                      <span className="text-[10px] text-muted-foreground">REG-00{task.id.split('-').pop()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{task.doctor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] font-bold capitalize", getPriorityBadge(task.priority))}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px] px-2 py-0.5 font-bold capitalize", getStatusBadge(task.status))}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{task.time}</span>
                      <span className="text-[10px] text-muted-foreground">{task.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" /> Reassign Task
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" /> Flag Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTasks.length === 0 && (
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
        </Card>
      </Tabs>
    </div>
  );
}
