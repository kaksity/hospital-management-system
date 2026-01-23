"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Stethoscope, Activity, Check, CalendarCheck, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { toast } from "sonner";

const MOCK_PATIENTS = [
  { id: "CP120456A", name: "Alex Turner", email: "alex.turner@email.com", gender: "Male" },
  { id: "CP238122C", name: "Maria Garcia", email: "maria.garcia@email.com", gender: "Female" },
  { id: "CP349011B", name: "James Wilson", email: "james.wilson@email.com", gender: "Male" },
  { id: "CP456789D", name: "Lisa Wang", email: "lisa.wang@email.com", gender: "Female" },
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

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: "Male" | "Female";
  service: string;
  doctor: string;
  time: string;
  date: Date;
  status: "scheduled" | "completed" | "cancelled";
}

interface AddEditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  appointmentToEdit?: Appointment | null;
  onSave?: (appointment: any, isEdit: boolean) => void;
  onDelete?: (appointmentId: string) => void;
}

export function AddEditAppointmentModal({
  open,
  onOpenChange,
  initialDate,
  appointmentToEdit,
  onSave,
  onDelete
}: AddEditAppointmentModalProps) {
  const isEditMode = !!appointmentToEdit;

  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [patientId, setPatientId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const MOCK_SERVICES = [
    { id: "S1", name: "MRI Brain (Contrast)", price: 150000 },
    { id: "S2", name: "MRI Spine", price: 180000 },
    { id: "S3", name: "MRI Abdomen", price: 120000 },
    { id: "S4", name: "MRI Knee", price: 90000 },
    { id: "S5", name: "CT Head", price: 45000 },
    { id: "S6", name: "CT Chest", price: 55000 },
    { id: "S7", name: "CT Abdomen", price: 65000 },
    { id: "S8", name: "CT Angiography", price: 85000 },
    { id: "S9", name: "Chest X-Ray", price: 12000 },
    { id: "S10", name: "Abdominal X-Ray", price: 15000 },
    { id: "S11", name: "Abdominal Ultrasound", price: 25000 },
    { id: "S12", name: "Pelvic Ultrasound", price: 28000 },
    { id: "S13", name: "Echocardiogram", price: 75000 },
    { id: "S14", name: "Mammogram", price: 35000 },
    { id: "S15", name: "Bone Density Scan", price: 45000 },
  ];

  // Add search state
  const [serviceSearch, setServiceSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  // Filter services based on search
  const filteredServices = MOCK_SERVICES.filter(service =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Filter patients based on search
  const filteredPatients = MOCK_PATIENTS.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Initialize form with appointment data when in edit mode
  useEffect(() => {
    if (isEditMode && appointmentToEdit) {
      setDate(appointmentToEdit.date);
      setPatientId(appointmentToEdit.patientId);
      setServiceId(MOCK_SERVICES.find(s => s.name === appointmentToEdit.service)?.id || "");
      setDoctorId(MOCK_DOCTORS.find(d => d.name === appointmentToEdit.doctor)?.id || "");
      setTime(appointmentToEdit.time);
    } else if (open) {
      // Reset form for new appointment
      setDate(initialDate || new Date());
      setPatientId("");
      setServiceId("");
      setDoctorId("");
      setTime("");
      setServiceSearch("");
      setPatientSearch("");
    }
  }, [isEditMode, appointmentToEdit, open, initialDate]);

  const handleSave = () => {
    // Get patient, service, and doctor details
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    const service = MOCK_SERVICES.find(s => s.id === serviceId);
    const doctor = MOCK_DOCTORS.find(d => d.id === doctorId);

    if (!patient || !service || !doctor || !date || !time) {
      toast.error("Please fill all required fields");
      return;
    }

    const appointmentData = {
      patientId,
      patientName: patient.name,
      patientGender: patient.gender as "Male" | "Female",
      service: service.name,
      doctor: doctor.name,
      time,
      date: new Date(date!),
      ...(isEditMode && { id: appointmentToEdit!.id, status: appointmentToEdit!.status })
    };

    // Call parent's save handler
    onSave?.(appointmentData, isEditMode);

    // Show success message
    toast.success(`${isEditMode ? "Appointment updated" : "Appointment booked"} successfully!`, {
      description: `${patient.name} - ${service.name}\n${format(date, 'PPP')} at ${time}`,
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!appointmentToEdit) return;

    if (window.confirm(`Are you sure you want to delete this appointment for ${appointmentToEdit.patientName}?`)) {
      onDelete?.(appointmentToEdit.id);
      toast.success("Appointment deleted successfully");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-[#fafafa] border-b h-24 flex items-center px-8">
          <div>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              {isEditMode ? "Edit Appointment" : "New Appointment"}
            </DialogTitle>
            <DialogDescription className="text-primary/60 font-medium">
              {isEditMode ? "Update appointment details" : "Schedule a diagnostic scan or consultation."}
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
                            <span className="font-medium text-sm">{p?.name}</span>
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
                {/* Search input */}
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search by name or ID..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Patient list */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-3 py-0.5">
                          <Avatar className="h-6 w-6 border">
                            <AvatarImage src={getPatientAvatarPath(p.id, p.gender)} alt={p.name} />
                            <AvatarFallback className={cn("text-[10px]", getAvatarBg(p.name))}>
                              {getAvatarInitials(p.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="font-semibold leading-snug text-sm">{p.name}</div>
                            <div className="text-[10px] leading-tight text-muted-foreground uppercase font-mono font-semibold">{p.id}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-3 text-center text-sm text-muted-foreground">
                      No patients found
                    </div>
                  )}
                </div>
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
                  {/* Search input */}
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Service list */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredServices.length > 0 ? (
                      filteredServices.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center justify-between">
                            <span>{s.name}</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              ₦{s.price.toLocaleString()}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-3 text-center text-sm text-muted-foreground">
                        No services found
                      </div>
                    )}
                  </div>
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
                    <CalendarIcon className="h-4 w-4" />
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
              {isEditMode ? (
                <>
                  <Save className="h-4 w-4" />
                  Update Appointment
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Book Appointment
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}