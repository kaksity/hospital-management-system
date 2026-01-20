/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { Clock, Calendar as CalendarIcon, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

interface ScheduleAppointmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient: any;
    onSchedule: (appointmentData: any) => void;
}

const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM"
];

export function ScheduleAppointmentModal({ open, onOpenChange, patient, onSchedule }: ScheduleAppointmentModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleSchedule = () => {
        if (selectedDate && selectedTime) {
            onSchedule({
                patientId: patient.id,
                patientName: patient.name,
                date: selectedDate.toISOString(),
                time: selectedTime,
            });
            onOpenChange(false);
            setSelectedTime(null);
        }
    };

    if (!patient) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                    <DialogDescription>
                        Select a convenient date and time for the patient's next clinical visit.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                    {/* Patient Summary & Details */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="p-4 rounded-xl border bg-muted/30">
                            <Avatar className="h-10 w-10 border border-muted shadow-sm mb-3">
                                <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                                <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(patient.name))}>
                                    {getAvatarInitials(patient.name)}
                                </AvatarFallback>
                            </Avatar>
                            <h4 className="font-semibold">{patient.name}</h4>
                            <p className="text-xs text-muted-foreground font-mono">{patient.id}</p>

                            <div className="mt-4 space-y-2 border-t pt-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="h-5 px-1.5 capitalize font-normal">
                                        {patient.status}
                                    </Badge>
                                    <span>•</span>
                                    <span>{patient.gender}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Selected Slot</h5>
                            {selectedDate && selectedTime ? (
                                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Appointment Details</span>
                                        <CalendarIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="text-sm font-semibold">{format(selectedDate, "EEEE, MMMM do, yyyy")}</p>
                                    <p className="text-lg font-bold text-primary mt-1">{selectedTime}</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl border border-dashed bg-muted/10 text-center py-8">
                                    <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                                    <p className="text-xs text-muted-foreground">Select a date and time to see details here</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar Picker */}
                    <div className="md:col-span-5 flex flex-col items-start">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Select Date</h5>
                        <div className="p-2 border rounded-xl bg-card">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setSelectedTime(null);
                                }}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0}
                                className="rounded-md"
                            />
                        </div>
                    </div>

                    {/* Time Picker */}
                    <div className="md:col-span-3">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-1">Available Times</h5>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 overflow-y-auto max-h-[340px] px-1 scrollbar-thin scrollbar-thumb-muted">
                            {TIME_SLOTS.map((time) => (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    className={cn(
                                        "justify-center h-11 text-xs font-medium transition-all duration-200",
                                        selectedTime === time ? "ring-2 ring-primary ring-offset-2" : "hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSchedule}
                        disabled={!selectedDate || !selectedTime}
                        className="gap-2 min-w-[170px]"
                    >
                        Confirm Appointment
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
