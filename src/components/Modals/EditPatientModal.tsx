/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { countryCodes } from "@/utils/countryData";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, X, Plus, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EditPatientModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (patientData: any) => void;
    patient: any;
}

const COMMUNICATION_METHODS = ["WhatsApp", "Email", "SMS", "Phone Call"];

export function EditPatientModal({ open, onOpenChange, onSave, patient }: EditPatientModalProps) {
    const [formData, setFormData] = useState({
        patientType: "Private",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        maritalStatus: "",
        nationality: "NG",
        phone: "",
        countryCode: "NG",
        email: "",
        preferredCommunication: ["WhatsApp"] as string[],
        address: "",
        admissionStatus: "outpatient" as "outpatient" | "admitted" | "deceased",
        ward: "",
        bedNumber: "",
        dateOfDeath: "",
        timeOfDeath: "",
        causeOfDeath: "",
        certifyingDoctor: "",
        mortuaryBay: "",
        mortuaryNotes: "",
    });

    useEffect(() => {
        if (patient) {
            const admissionStatus = patient.admissionStatus ||
                (patient.isAdmitted ? "admitted" : "outpatient");
            setFormData({
                patientType: patient.patientType || "Private",
                firstName: patient.name?.split(" ")[0] || "",
                lastName: patient.name?.split(" ")[1] || "",
                dob: patient.dob || "",
                gender: patient.gender || "",
                maritalStatus: patient.maritalStatus || "",
                nationality: patient.nationality || "NG",
                phone: patient.phone?.split(" ").slice(1).join("") || "",
                countryCode: "NG",
                email: patient.email || "",
                preferredCommunication: patient.preferredCommunication || ["WhatsApp"],
                address: patient.address || "",
                admissionStatus,
                ward: patient.ward || "",
                bedNumber: patient.bedNumber || "",
                dateOfDeath: patient.mortuaryInfo?.dateOfDeath || "",
                timeOfDeath: patient.mortuaryInfo?.timeOfDeath || "",
                causeOfDeath: patient.mortuaryInfo?.causeOfDeath || "",
                certifyingDoctor: patient.mortuaryInfo?.certifyingDoctor || "",
                mortuaryBay: patient.mortuaryInfo?.mortuaryBay || "",
                mortuaryNotes: patient.mortuaryInfo?.notes || "",
            });
        }
    }, [patient, open]);

    const selectedCountry = useMemo(() =>
        countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0],
        [formData.countryCode]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patientData = {
            ...formData,
            id: patient.id,
            name: `${formData.firstName} ${formData.lastName}`,
            status: patient.status,
            isAdmitted: formData.admissionStatus === "admitted",
            lastActivity: new Date().toISOString().split('T')[0],
            mortuaryInfo: formData.admissionStatus === "deceased" ? {
                dateOfDeath: formData.dateOfDeath,
                timeOfDeath: formData.timeOfDeath,
                causeOfDeath: formData.causeOfDeath,
                certifyingDoctor: formData.certifyingDoctor,
                mortuaryBay: formData.mortuaryBay,
                notes: formData.mortuaryNotes,
            } : undefined,
        };
        onSave(patientData);
        onOpenChange(false);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleCommunication = (method: string) => {
        setFormData(prev => {
            const current = prev.preferredCommunication;
            if (current.includes(method)) {
                return { ...prev, preferredCommunication: current.filter(m => m !== method) };
            } else {
                return { ...prev, preferredCommunication: [...current, method] };
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>Edit Patient Information</DialogTitle>
                    <DialogDescription>
                        Update the patient's personal and contact details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
                        {/* Patient Type */}
                        <div className="space-y-2">
                            <Label required>Patient Type</Label>
                            <Select
                                value={formData.patientType}
                                onValueChange={(v) => handleChange("patientType", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private">Private</SelectItem>
                                    <SelectItem value="HMO">HMO</SelectItem>
                                    <SelectItem value="Public">Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" required>First Name</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" required>Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label required>Date of Birth</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !formData.dob && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.dob ? format(new Date(formData.dob), "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.dob ? new Date(formData.dob) : undefined}
                                            onSelect={(date) => handleChange("dob", date?.toISOString())}
                                            disabled={(date) => date > new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label required>Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(v) => handleChange("gender", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label required>Marital Status</Label>
                                <Select
                                    value={formData.maritalStatus}
                                    onValueChange={(v) => handleChange("maritalStatus", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Married">Married</SelectItem>
                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                        <SelectItem value="Widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" required>Phone Number</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={formData.countryCode}
                                    onValueChange={(v) => handleChange("countryCode", v)}
                                >
                                    <SelectTrigger className="w-[110px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countryCodes.map((c) => (
                                            <SelectItem key={c.code} value={c.code}>
                                                {c.flag} {c.dialCode}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className="flex-1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label required>Preferred Communication</Label>
                            <div className="flex flex-wrap gap-2">
                                {COMMUNICATION_METHODS.map((method) => (
                                    <Badge
                                        key={method}
                                        variant={formData.preferredCommunication.includes(method) ? "default" : "outline"}
                                        className="cursor-pointer py-1.5 px-3"
                                        onClick={() => toggleCommunication(method)}
                                    >
                                        {method}
                                        {formData.preferredCommunication.includes(method) ? (
                                            <Check className="ml-1 h-3 w-3" />
                                        ) : (
                                            <Plus className="ml-1 h-3 w-3" />
                                        )}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Residential Address</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <Label required>Admission Status</Label>
                            <Select
                                value={formData.admissionStatus}
                                onValueChange={(v) => handleChange("admissionStatus", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="outpatient">Outpatient</SelectItem>
                                    <SelectItem value="admitted">Admitted</SelectItem>
                                    <SelectItem value="deceased">Deceased</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.admissionStatus === "admitted" && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <Label required>Ward</Label>
                                    <Input
                                        placeholder="e.g. Surgical Ward, ICU"
                                        value={formData.ward}
                                        onChange={(e) => handleChange("ward", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label required>Bed Number</Label>
                                    <Input
                                        placeholder="e.g. B-12"
                                        value={formData.bedNumber}
                                        onChange={(e) => handleChange("bedNumber", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {formData.admissionStatus === "deceased" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-7 w-7 rounded-lg bg-slate-200 flex items-center justify-center">
                                        <Skull className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">Mortuary Information</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label required>Date of Death</Label>
                                        <Input
                                            type="date"
                                            value={formData.dateOfDeath}
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => handleChange("dateOfDeath", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Time of Death</Label>
                                        <Input
                                            type="time"
                                            value={formData.timeOfDeath}
                                            onChange={(e) => handleChange("timeOfDeath", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label required>Cause of Death</Label>
                                    <Input
                                        placeholder="e.g. Cardiac arrest, Respiratory failure"
                                        value={formData.causeOfDeath}
                                        onChange={(e) => handleChange("causeOfDeath", e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Certifying Doctor</Label>
                                        <Input
                                            placeholder="e.g. Dr. Sarah Johnson"
                                            value={formData.certifyingDoctor}
                                            onChange={(e) => handleChange("certifyingDoctor", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mortuary Bay</Label>
                                        <Input
                                            placeholder="e.g. Bay 3, Refrigeration Unit A"
                                            value={formData.mortuaryBay}
                                            onChange={(e) => handleChange("mortuaryBay", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Additional Notes</Label>
                                    <Textarea
                                        placeholder="Any additional notes regarding the deceased..."
                                        value={formData.mortuaryNotes}
                                        onChange={(e) => handleChange("mortuaryNotes", e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t bg-muted/20">
                        <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                            Cancel
                        </Button>
                        <Button type="submit">
                            Update Patient
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
