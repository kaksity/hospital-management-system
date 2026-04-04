/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { AmbulanceUrgency } from "@/data/ambulanceRequests";
import { patients as allPatients } from "@/data/patients";
import { AlertTriangle, MapPin, Ambulance, ChevronRight, Search, X, User } from "lucide-react";

interface NewAmbulanceRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function NewAmbulanceRequestModal({ open, onOpenChange, onSubmit }: NewAmbulanceRequestModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [condition, setCondition] = useState("");
  const [urgency, setUrgency] = useState<AmbulanceUrgency | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setSelectedPatient(null);
      setPatientSearch("");
      setDropdownOpen(false);
      setCondition("");
      setUrgency(null);
      setPickupLocation("");
      setNotes("");
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredPatients = allPatients.filter(p => {
    const q = patientSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q)
    );
  });

  const isValid = selectedPatient && condition.trim() && urgency && pickupLocation.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientGender: selectedPatient.gender,
      condition: condition.trim(),
      urgency: urgency!,
      pickupLocation: pickupLocation.trim(),
      notes: notes.trim(),
      status: "pending",
      requestedBy: "Admin",
    });
    onOpenChange(false);
  };

  const handleSelectPatient = (p: any) => {
    setSelectedPatient(p);
    setPatientSearch("");
    setDropdownOpen(false);
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setPatientSearch("");
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Ambulance className="h-4 w-4 text-red-600" />
            </div>
            New Ambulance Request
          </DialogTitle>
          <DialogDescription>
            Select a patient and fill in the condition details to dispatch an ambulance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Patient picker */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm font-semibold">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Patient <span className="text-red-500">*</span>
            </Label>

            {selectedPatient ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                <Avatar className="h-9 w-9 border border-muted shadow-sm">
                  <AvatarImage src={getPatientAvatarPath(selectedPatient.id, selectedPatient.gender)} alt={selectedPatient.name} />
                  <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(selectedPatient.name))}>
                    {getAvatarInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900">{selectedPatient.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedPatient.id} · {selectedPatient.gender}</p>
                </div>
                <Badge variant="outline" className="capitalize shrink-0 text-xs">{selectedPatient.status}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-slate-700 shrink-0"
                  onClick={handleClearPatient}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  ref={searchRef}
                  placeholder="Search by name, ID, or phone..."
                  value={patientSearch}
                  onChange={e => { setPatientSearch(e.target.value); setDropdownOpen(true); }}
                  onFocus={() => setDropdownOpen(true)}
                  className="pl-9"
                />
                {dropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
                    <ScrollArea className="max-h-[220px]">
                      {filteredPatients.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">No patients found</p>
                      ) : (
                        filteredPatients.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left border-b last:border-none"
                            onMouseDown={e => { e.preventDefault(); handleSelectPatient(p); }}
                          >
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={getPatientAvatarPath(p.id, p.gender)} alt={p.name} />
                              <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(p.name))}>
                                {getAvatarInitials(p.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{p.id} · {p.gender}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn("text-xs capitalize shrink-0", p.status === "active" ? "border-green-200 text-green-700" : "")}
                            >
                              {p.status}
                            </Badge>
                          </button>
                        ))
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
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
