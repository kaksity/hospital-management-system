"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Phone, Briefcase, Landmark, Hash, CreditCard } from "lucide-react";

interface AddEditDoctorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (doctor: any) => void;
    doctor?: any; // If provided, we are in edit mode
}

// Mock Data for Dropdowns
const MARKETERS = [
    { id: "MKT-001", name: "Sarah Johnson" },
    { id: "MKT-002", name: "Michael Chen" },
    { id: "MKT-003", name: "Olusola Adebayo" },
];

const BANKS = [
    "Zenith Bank",
    "Guaranty Trust Bank (GTB)",
    "Access Bank",
    "First Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Stanbic IBTC Bank",
    "Fidelity Bank",
];

const HOSPITALS = [
    "Main Radiology Wing",
    "St. Nicholas Hospital",
    "Reddington Hospital",
    "Lagos University Teaching Hospital",
];

export function AddEditDoctorModal({
    open,
    onOpenChange,
    onSuccess,
    doctor,
}: AddEditDoctorModalProps) {
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        hospital: "",
        phone: "",
        marketer: "",
        accountName: "",
        bankName: "",
        accountNumber: "",
    });

    // Reset form when modal opens or doctor changes
    React.useEffect(() => {
        if (doctor) {
            setFormData({
                name: doctor.name || "",
                hospital: doctor.hospital || "",
                phone: doctor.phone || "",
                marketer: doctor.marketer || "",
                accountName: doctor.accountName || "",
                bankName: doctor.bankName || "",
                accountNumber: doctor.accountNumber || "",
            });
        } else {
            setFormData({
                name: "",
                hospital: "",
                phone: "",
                marketer: "",
                accountName: "",
                bankName: "",
                accountNumber: "",
            });
        }
    }, [doctor, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSuccess?.({
                ...doctor,
                ...formData,
                id: doctor?.id || `DOC-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
                status: doctor?.status || "active",
                createdAt: doctor?.createdAt || new Date().toISOString().split("T")[0],
            });
            onOpenChange(false);
        }, 1000);
    };

    const isEdit = !!doctor;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Doctor" : "Add New Referring Doctor"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the professional details and financial preferences of the referring doctor."
                            : "Register a new referring doctor and connect them to a hospital and marketer."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-1">
                    {/* Professional Information Section */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border-b pb-2">Professional Details</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" required>Doctor Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="e.g. Dr. Jane Smith"
                                        className="pl-9"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hospital" required>Hospital</Label>
                                <Select
                                    value={formData.hospital}
                                    onValueChange={(value) => setFormData({ ...formData, hospital: value })}
                                    required
                                >
                                    <SelectTrigger id="hospital" className="pl-9 relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Select Hospital" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOSPITALS.map((hosp) => (
                                            <SelectItem key={hosp} value={hosp}>{hosp}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" required>Mobile No.</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        placeholder="e.g. +234 801 222 3333"
                                        className="pl-9"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="marketer" required>Marketer (Connected)</Label>
                                <Select
                                    value={formData.marketer}
                                    onValueChange={(value) => setFormData({ ...formData, marketer: value })}
                                    required
                                >
                                    <SelectTrigger id="marketer" className="pl-9 relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Select Marketer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MARKETERS.map((mkt) => (
                                            <SelectItem key={mkt.id} value={mkt.name}>{mkt.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Financial Information Section */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border-b pb-2">Financial Preferences</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="accountName"
                                        placeholder="e.g. Jane Smith Peters"
                                        className="pl-9"
                                        value={formData.accountName}
                                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Select
                                        value={formData.bankName}
                                        onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                                    >
                                        <SelectTrigger id="bankName" className="pl-9 relative">
                                            <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Select Bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BANKS.map((bank) => (
                                                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="accountNumber"
                                            placeholder="10-digit account number"
                                            maxLength={10}
                                            className="pl-9"
                                            value={formData.accountNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                setFormData({ ...formData, accountNumber: val });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="min-w-[120px]">
                            {loading ? (isEdit ? "Updating..." : "Registering...") : (isEdit ? "Save Changes" : "Register Doctor")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
