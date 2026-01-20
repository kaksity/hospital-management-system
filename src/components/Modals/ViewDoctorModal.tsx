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
    CreditCard
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
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-lg">{doctor.name}</DialogTitle>
                                <Badge className={cn(getStatusBadge(doctor.status))}>
                                    {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                                </Badge>
                            </div>
                            <DialogDescription className="font-mono text-xs">
                                {doctor.id} • Registered {formatDate(doctor.createdAt)}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Professional Details */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 pb-6 border-b border-border/50">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Hospital</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                {doctor.hospital}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mobile Number</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                {doctor.phone}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Connected Marketer</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                {doctor.marketer}
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-2">
                            <CreditCard className="h-3 w-3" />
                            Financial Information
                        </h4>

                        <div className="bg-muted/30 rounded-xl p-4 space-y-4 border border-border/50">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Account Name</span>
                                <p className="text-sm font-semibold">{doctor.accountName || "Not provided"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Bank</span>
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <Landmark className="h-3.5 w-3.5 text-muted-foreground" />
                                        {doctor.bankName || "N/A"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Account Number</span>
                                    <div className="flex items-center gap-1.5 text-sm font-mono font-medium">
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
