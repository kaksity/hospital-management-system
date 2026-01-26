"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Phone,
  Briefcase,
  Landmark,
  Hash,
  Calendar,
  CreditCard,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";

interface ViewDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: any;
}

export function ViewDoctorModal({
  open,
  onOpenChange,
  doctor,
}: ViewDoctorModalProps) {
  if (!doctor) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg">{doctor.name}</DialogTitle>
                <Badge className={cn(getStatusBadge(doctor.status))}>
                  {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                </Badge>
              </div>
              <DialogDescription className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
                {doctor.id} • Registered {formatDate(doctor.createdAt)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Professional Details */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 pb-6 border rounded-xl border-input/50 bg-slate-50 p-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Hospital</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {doctor.hospital}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Mobile Number</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {doctor.phone}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Connected Marketer</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                {doctor.marketer}
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-2">
              <CreditCard className="h-3 w-3" />
              Financial Information
            </h4>

            <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-input/50">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Account Name</span>
                <p className="text-sm font-semibold">{doctor.accountName || "Not provided"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Bank</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Landmark className="h-3.5 w-3.5 text-muted-foreground" />
                    {doctor.bankName || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Account Number</span>
                  <div className="flex items-center gap-1.5 text-sm font-mono font-semibold">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    {doctor.accountNumber || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
