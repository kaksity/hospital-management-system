"use client";

import { useState } from "react";
import {
  X,
  User,
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Scan,
  AlertTriangle,
  FileText,
  Tag,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Edit,
  UserPlus,
  Printer,
  Download,
  Share2,
  MessageCircle,
  Copy,
  History,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ViewTaskModalProps {
  task: any; // Replace with your Task type
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ViewTaskModal({ task, isOpen, onClose, onEdit, onDelete }: ViewTaskModalProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  if (!isOpen) return null;

  // Mock task data for the modal
  const taskData = {
    id: "TSK-2024-001",
    patientName: "John Adebayo",
    patientId: "PT-2024-001",
    phone: "0800 123 4567",
    email: "john.adebayo@example.com",
    patientType: "hmo" as const,
    insurance: "ABC Insurance Co.",
    service: "MRI",
    subService: "Brain with Contrast",
    date: new Date("2024-11-20"),
    time: "10:30 AM",
    priority: "high" as const,
    referringDoctor: "Dr. Ope Adeyemi",
    assignedDoctor: "Dr. Sarah Johnson",
    clinicalNotes: "Rule out metastases, known lung cancer. Patient has history of smoking for 15 years. Recent weight loss and persistent cough.",
    isEmergency: true,
    isComparison: false,
    isWalkIn: false,
    tags: ["neuro", "urgent", "oncology", "follow-up"],
    status: "pending" as const,
    assignmentStatus: "assigned" as const,
    createdDate: "2024-11-19",
    dueDate: "2024-11-21",
    createdBy: "Admin User",
    lastModified: new Date("2024-11-19"),
    paymentStatus: "insurance" as const,
    reportStatus: "not_started" as const
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      assigned: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getPatientTypeBadge = (type: string) => {
    const variants = {
      regular: "bg-blue-100 text-blue-700 border-blue-200",
      private: "bg-purple-100 text-purple-700 border-purple-200",
      hmo: "bg-green-100 text-green-700 border-green-200",
    };
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Task Details</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                      {taskData.id}
                    </code>
                    <Badge className={cn("text-xs font-bold", getStatusBadge(taskData.status))}>
                      {taskData.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2">1 of 5</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Patient & Task Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Info */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-slate-100">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                            {taskData.patientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{taskData.patientName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn("text-xs", getPatientTypeBadge(taskData.patientType))}>
                              {taskData.patientType.toUpperCase()}
                            </Badge>
                            {taskData.patientType === "hmo" && taskData.insurance && (
                              <Badge variant="outline" className="text-xs">
                                {taskData.insurance}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full",
                            taskData.priority === 'high' ? 'bg-red-500' :
                              taskData.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          )} />
                          <span className="text-sm font-semibold capitalize">{taskData.priority} Priority</span>
                        </div>
                        {taskData.isEmergency && (
                          <Badge className="mt-2 bg-red-100 text-red-700 border-red-200 text-xs">
                            EMERGENCY
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Patient ID</p>
                        <p className="font-medium">{taskData.patientId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Contact</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">{taskData.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Email</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium truncate">{taskData.email}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Payment Status</p>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          {taskData.paymentStatus === 'insurance' ? 'Insurance' : 'Paid'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Details */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Study Details</h4>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Service Type</p>
                        <div className="flex items-center gap-2">
                          <Scan className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{taskData.service}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Sub-Service</p>
                        <p className="font-semibold">{taskData.subService}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Date & Time</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{format(taskData.date, "MMM dd, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{taskData.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Created</p>
                        <p className="font-medium">{taskData.createdDate}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-slate-500">Clinical Notes</p>
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <p className="text-sm text-slate-700">{taskData.clinicalNotes}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-slate-500">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {taskData.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-3 py-1 bg-slate-100 text-slate-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Assignment & Actions */}
              <div className="space-y-6">
                {/* Assignment Status */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Assignment</h4>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Referring Doctor</p>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{taskData.referringDoctor}</p>
                            <p className="text-sm text-slate-600">Referring Physician</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500 mb-2">Assigned Radiologist</p>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                              {taskData.assignedDoctor.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{taskData.assignedDoctor}</p>
                            <p className="text-sm text-slate-600">Radiologist</p>
                          </div>
                          <Badge className="ml-auto bg-green-100 text-green-700 border-green-200">
                            Assigned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4" />
                        Start Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Add Comment
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Printer className="h-4 w-4" />
                        Print Details
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Task
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Copy className="h-4 w-4" />
                        Duplicate Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Timeline</h4>
                    <div className="space-y-4">
                      {[
                        { time: "Today, 10:30 AM", action: "Task scheduled", user: "System" },
                        { time: "Yesterday, 3:45 PM", action: "Assigned to radiologist", user: "Admin" },
                        { time: "Nov 19, 2:30 PM", action: "Task created", user: "Admin" },
                      ].map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "h-2 w-2 rounded-full mt-1",
                              index === 0 ? "bg-primary" : "bg-slate-300"
                            )} />
                            {index < 2 && <div className="h-8 w-px bg-slate-200 mt-1" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-sm">{item.action}</p>
                            <p className="text-xs text-slate-500">
                              {item.time} • by {item.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Flag Issue
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}