"use client";

import {
  X,
  Calendar as CalendarIcon,
  Stethoscope,
  Scan,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  Edit,
  Trash2,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAvatarInitials, getAvatarBg, getPatientAvatarPath } from "@/utils/avatarUtils";

interface ViewTaskModalProps {
  task: any; // Using the Task type from index.tsx
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ViewTaskModal({ task, isOpen, onClose, onEdit, onDelete }: ViewTaskModalProps) {
  const navigate = useNavigate();
  if (!task) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-amber-100 text-amber-700",
      draft: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      assigned: "bg-purple-100 text-purple-700",
      unassigned: "bg-slate-100 text-slate-600",
    };
    return variants[status as keyof typeof variants] || "bg-slate-50 text-slate-600";
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return variants[priority as keyof typeof variants] || "bg-slate-50 text-slate-600";
  };

  const getPatientTypeBadge = (type: string) => {
    const variants = {
      regular: "bg-blue-100 text-blue-700",
      private: "bg-purple-100 text-purple-700",
      hmo: "bg-green-100 text-green-700",
    };
    return variants[type as keyof typeof variants] || "bg-slate-50 text-slate-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl">
        {/* Header - Glassmorphism Style */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl bg-primary/10 text-primary shrink-0",
              task.isEmergency && "bg-red-50 text-red-600 border border-[#e49d9d]"
            )}>
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="font-semibold  text-slate-900">
                  {task.service} - {task.subService}
                </DialogTitle>
                <Badge variant="default" className={cn("text-[10px] font-semibold capitalize", getStatusBadge(task.status))}>
                  {task.status}
                </Badge>
                {task.isEmergency && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-100 text-red-700 border border-[#e49d9d] rounded text-[10px] font-black animate-pulse uppercase">
                    <AlertTriangle className="h-3 w-3" />
                    Emergency
                  </div>
                )}
              </div>
              <code className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                {task.id}
              </code>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfd]">
          <div className="p-6 flex flex-col gap-6">
            {/* Patient Detail Card */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={getPatientAvatarPath(task.id, "Male")} alt={task.patient} />
                      <AvatarFallback className={cn("text-xl font-bold", getAvatarBg(task.patient))}>
                        {getAvatarInitials(task.patient)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 leading-tight">{task.patient}</h3>
                      <code className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {task.patientId || task.id.replace('TSK', 'PT')}
                      </code>
                      <Badge className={cn("text-[10px] font-extrabold uppercase py-0.5", getPatientTypeBadge(task.patientType))}>
                        {task.patientType}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border rounded-lg">
                      <div className={cn("h-2 w-2 rounded-full",
                        task.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      )} />
                      <span className="text-xs font-bold text-slate-700 capitalize">{task.priority} Priority</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-input opacity-60" />

                <div className="grid grid-cols-2 mt-6 gap-y-4 gap-x-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Phone Number</p>
                    <div className="flex items-center gap-2 group">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <Phone className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{task.phone || "+234 800 123 4567"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Email Address</p>
                    <div className="flex items-center gap-2 group">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <Mail className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">{task.email || "patient@example.com"}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</p>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <Scan className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="font-semibold text-sm">{task.service}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Sub-Service</p>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <Scan className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="font-semibold text-sm">{task.subService}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Date & Time</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      {task.date} at {task.time}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Payment Status</p>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="font-semibold text-sm capitalize">
                        {task.paymentStatus || "Insurance"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Referring Physician</label>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{task.referringDoctor || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Reporting Doctor</label>
                    {task.assignedDoctor ? (
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <Stethoscope className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1 flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm truncate">{task.assignedDoctor}</p>
                          <Badge className="bg-[#EBFFF6] text-[#008037] text-[9px] font-semibold border-[#58BF85] px-1.5 h-4 capitalize">
                            Assigned
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-3 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-semibold h-[54px]">
                        Unassigned
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Notes Card */}
            <Card className="overflow-hidden bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-slate-700" />
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Clinical Notes</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {task.referralNotes || "No referral notes provided. Standard imaging protocol applies."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 px-6 bg-white border-t flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9 px-4 text-[13px] font-bold" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              Edit Task
            </Button>
            {task.status !== 'completed' ? (
              <Button
                className="h-9 px-6 font-semibold text-sm"
                onClick={() => navigate("/diagnostic-reports/create", { state: { task } })}
              >
                Start Reporting Flow
              </Button>
            ) : (
              <Button variant="outline" className="h-9 px-6 font-bold text-sm">
                View Report
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}