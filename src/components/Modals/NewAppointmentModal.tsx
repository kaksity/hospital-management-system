"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Stethoscope, Activity, Check, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

const MOCK_PATIENTS = [
  { id: "CP120456A", name: "Alex Turner", email: "alex.turner@email.com", gender: "Male" },
  { id: "CP238122C", name: "Maria Garcia", email: "maria.garcia@email.com", gender: "Female" },
  { id: "CP349011B", name: "James Wilson", email: "james.wilson@email.com", gender: "Male" },
  { id: "CP456789D", name: "Lisa Wang", email: "lisa.wang@email.com", gender: "Female" },
];

const MOCK_SERVICES = [
  { id: "S1", name: "MRI Brain (Contrast)", price: 150000 },
  { id: "S2", name: "CT Head", price: 45000 },
  { id: "S3", name: "Chest X-Ray", price: 12000 },
  { id: "S4", name: "Abdominal Ultrasound", price: 25000 },
];

const MOCK_DOCTORS = [
  { id: "D1", name: "Dr. Ope Adeyemi", specialty: "Neuroradiologist" },
  { id: "D2", name: "Dr. Michael Chen", specialty: "Diagnostic Radiologist" },
  { id: "D3", name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
];

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
}

export function NewAppointmentModal({ open, onOpenChange, initialDate }: NewAppointmentModalProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [patientId, setPatientId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const handleSave = () => {
    // Collect data and hand off to parent/API
    console.log({
      patientId,
      serviceId,
      doctorId,
      date,
      time
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#fafafa] border-b h-24 flex items-center px-8">
          <div>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              New Appointment
            </DialogTitle>
            <DialogDescription className="text-primary/60 font-medium">
              Schedule a diagnostic scan or consultation.
            </DialogDescription>
          </div>
        </div>

        <div className="py-6 pt-2 px-8 space-y-4">
          {/* Patient Selection */}
          <div className="space-y-1">
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {patientId ? (
                    <>
                      {(() => {
                        const p = MOCK_PATIENTS.find(p => p.id === patientId);
                        return (
                          <>
                            <Avatar className="h-5 w-5 border">
                              <AvatarImage src={getPatientAvatarPath(p?.id || "", p?.gender || "Male")} />
                              <AvatarFallback className={cn("text-[8px]", getAvatarBg(p?.name || ""))}>
                                {getAvatarInitials(p?.name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">
                              {p?.name}
                            </span>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Select a patient...</span>
                  )}
                </div>
              </SelectTrigger>
              <SelectContent>
                {MOCK_PATIENTS.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-3 py-0.5">
                      <Avatar className="h-6 w-6 border">
                        <AvatarImage src={getPatientAvatarPath(p.id, p.gender)} alt={p.name} />
                        <AvatarFallback className={cn("text-[10px]", getAvatarBg(p.name))}>
                          {getAvatarInitials(p.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{p.id}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Service Selection */}
            <div className="space-y-1">
              <Label>Service</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SERVICES.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-1">
              <Label>Doctor</Label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_DOCTORS.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left ",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-xl font-bold"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-1">
              <Label>Preferred Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {TIME_SLOTS.map(t => (
                      <SelectItem key={t} value={t} className="text-xs font-bold rounded-md">{t}</SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-6 bg-muted/10 border-t flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-[10px] py-1 font-black px-3 rounded-full border-muted-foreground/20">
              EST. DURATION: 45 MINS
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
