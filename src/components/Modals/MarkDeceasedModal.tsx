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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { MortuaryInfo } from "@/data/patients";
import { Skull } from "lucide-react";

interface MarkDeceasedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
  onConfirm: (patientId: string, mortuaryInfo: MortuaryInfo) => void;
}

const emptyForm = {
  dateOfDeath: "",
  timeOfDeath: "",
  causeOfDeath: "",
  certifyingDoctor: "",
  mortuaryBay: "",
  notes: "",
};

export function MarkDeceasedModal({
  open,
  onOpenChange,
  patient,
  onConfirm,
}: MarkDeceasedModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) setForm(emptyForm);
  }, [open]);

  const isValid = form.dateOfDeath.trim() && form.causeOfDeath.trim();

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    if (!isValid || !patient) return;
    onConfirm(patient.id, {
      dateOfDeath: form.dateOfDeath,
      timeOfDeath: form.timeOfDeath,
      causeOfDeath: form.causeOfDeath,
      certifyingDoctor: form.certifyingDoctor,
      mortuaryBay: form.mortuaryBay,
      notes: form.notes,
    });
    onOpenChange(false);
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Skull className="h-4 w-4 text-slate-600" />
            </div>
            Record Patient as Deceased
          </DialogTitle>
          <DialogDescription>
            This action will update the patient's admission status and record mortuary details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Patient summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
            <Avatar className="h-9 w-9 border border-muted shadow-sm">
              <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
              <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(patient.name))}>
                {getAvatarInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900">{patient.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{patient.id}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Date of Death</Label>
              <Input
                type="date"
                value={form.dateOfDeath}
                max={new Date().toISOString().split("T")[0]}
                onChange={e => handleChange("dateOfDeath", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Time of Death</Label>
              <Input
                type="time"
                value={form.timeOfDeath}
                onChange={e => handleChange("timeOfDeath", e.target.value)}
              />
            </div>
          </div>

          {/* Cause of Death */}
          <div className="space-y-1.5">
            <Label required>Cause of Death</Label>
            <Input
              placeholder="e.g. Cardiac arrest, Respiratory failure"
              value={form.causeOfDeath}
              onChange={e => handleChange("causeOfDeath", e.target.value)}
            />
          </div>

          {/* Certifying Doctor & Mortuary Bay */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Certifying Doctor</Label>
              <Input
                placeholder="e.g. Dr. Sarah Johnson"
                value={form.certifyingDoctor}
                onChange={e => handleChange("certifyingDoctor", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mortuary Bay</Label>
              <Input
                placeholder="e.g. Bay 3, Unit A"
                value={form.mortuaryBay}
                onChange={e => handleChange("mortuaryBay", e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Any additional notes regarding the deceased..."
              value={form.notes}
              onChange={e => handleChange("notes", e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="gap-2 bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Skull className="h-4 w-4" />
            Confirm & Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
