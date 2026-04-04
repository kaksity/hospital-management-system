/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { AmbulanceUrgency } from "@/data/ambulanceRequests";
import { AlertTriangle, MapPin, Ambulance, ChevronRight } from "lucide-react";

interface RequestAmbulanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
  onSubmit: (data: {
    patientId: string;
    patientName: string;
    patientGender: "Male" | "Female";
    condition: string;
    urgency: AmbulanceUrgency;
    pickupLocation: string;
    notes: string;
    status: "pending";
    requestedBy: string;
  }) => void;
}

const URGENCY_OPTIONS: { value: AmbulanceUrgency; label: string; description: string; color: string }[] = [
  { value: "critical", label: "Critical", description: "Life-threatening, immediate response required", color: "border-red-500 bg-red-50 text-red-700" },
  { value: "high",     label: "High",     description: "Serious condition, urgent transport needed",  color: "border-orange-500 bg-orange-50 text-orange-700" },
  { value: "medium",   label: "Medium",   description: "Stable but requires prompt medical attention", color: "border-yellow-500 bg-yellow-50 text-yellow-700" },
  { value: "low",      label: "Low",      description: "Non-urgent, routine transport",                color: "border-green-500 bg-green-50 text-green-700" },
];

export function RequestAmbulanceModal({ open, onOpenChange, patient, onSubmit }: RequestAmbulanceModalProps) {
  const [condition, setCondition] = useState("");
  const [urgency, setUrgency] = useState<AmbulanceUrgency | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setCondition("");
      setUrgency(null);
      setPickupLocation("");
      setNotes("");
    }
  }, [open]);

  const isValid = condition.trim() && urgency && pickupLocation.trim();

  const handleSubmit = () => {
    if (!isValid || !patient) return;
    onSubmit({
      patientId: patient.id,
      patientName: patient.name,
      patientGender: patient.gender,
      condition: condition.trim(),
      urgency: urgency!,
      pickupLocation: pickupLocation.trim(),
      notes: notes.trim(),
      status: "pending",
      requestedBy: "Admin",
    });
    onOpenChange(false);
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Ambulance className="h-4 w-4 text-red-600" />
            </div>
            Request Ambulance
          </DialogTitle>
          <DialogDescription>
            Dispatch an ambulance based on the patient's current condition and urgency level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Patient summary */}
          <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
            <Avatar className="h-10 w-10 border border-muted shadow-sm">
              <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
              <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(patient.name))}>
                {getAvatarInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900">{patient.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{patient.id}</p>
            </div>
            <Badge variant="outline" className="capitalize shrink-0">{patient.status}</Badge>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition" className="flex items-center gap-1.5 text-sm font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
              Patient Condition <span className="text-red-500">*</span>
            </Label>
            <Input
              id="condition"
              placeholder="e.g. Severe chest pain, loss of consciousness..."
              value={condition}
              onChange={e => setCondition(e.target.value)}
            />
          </div>

          {/* Urgency */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Urgency Level <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {URGENCY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUrgency(opt.value)}
                  className={cn(
                    "text-left p-3 rounded-xl border-2 transition-all duration-150",
                    urgency === opt.value
                      ? opt.color + " border-current"
                      : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/30"
                  )}
                >
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-80">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label htmlFor="pickup" className="flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Pickup Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pickup"
              placeholder="e.g. 12 Awolowo Road, Ikoyi, Lagos"
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information for the paramedic team..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white min-w-[160px]"
          >
            <Ambulance className="h-4 w-4" />
            Dispatch Ambulance
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
