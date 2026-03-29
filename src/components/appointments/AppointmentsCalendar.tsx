"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
  subDays,
  isBefore,
  startOfDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  MoreVertical,
  Clock,
  User,
  Stethoscope,
  CalendarPlus,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEditAppointmentModal } from "@/components/Modals/AddEditAppointmentModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { Appointment, useAppointments } from "@/hooks/use-appointments";
import { toast } from "sonner";

export function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleOpenModal = (date?: Date) => {
    setModalInitialDate(date);
    setIsModalOpen(true);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-light">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday} className="px-3 h-8 text-xs font-semibold border-border">
            Today
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center mr-4 gap-4 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1d73ff]" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#05ac43]" />
              <span>Completed</span>
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <CalendarPlus className="h-4 w-4" />
            <span>New Appointment</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        // Find appointments for this day
        const dayAppointments = appointments.filter(app => isSameDay(app.date, cloneDay));
        const isPast = isBefore(cloneDay, startOfDay(new Date()));

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-32 border-r border-b group transition-all duration-200 p-1 flex flex-col cursor-pointer",
              !isSameMonth(day, monthStart) ? "bg-muted/10 text-muted-foreground/40" : "bg-background",
              isSameDay(day, selectedDate) && "bg-primary/[0.02] ring-1 ring-inset ring-[#70B2DB]",
              isPast && "bg-muted/5 opacity-80",
              i === 0 ? "border-l-0" : "",
              i === 6 && "border-r-0",
              day > subDays(endDate, 7) && "border-b-0",
            )}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex items-center justify-between p-1 px-1.5 mb-1">
              <span className={cn(
                "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                isToday(day) ? "bg-[hsl(var(--primary))] text-primary-foreground" : "group-hover:bg-muted"
              )}>
                {formattedDate}
              </span>
              {dayAppointments.length > 0 && (
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase">
                  {dayAppointments.length} Appts
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar px-0.5">
              {dayAppointments.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className={cn(
                    "group/item relative px-2 py-1 rounded-md text-[10px] font-bold border truncate transition-all",
                    app.status === 'completed'
                      ? "bg-[#EBFFF6] text-[#008037] border-[#58BF85]"
                      : "bg-[#F0F6FF] text-[#1f61e2] border-[#6291ee]"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span>{app.time}</span>
                    <span className="opacity-60 font-medium">•</span>
                    <span className="truncate">{app.patientName}</span>
                  </div>
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-[10px] text-muted-foreground font-bold px-2 py-0.5 italic">
                  + {dayAppointments.length - 3} more
                </div>
              )}
            </div>

            {!isPast && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white shadow-sm border"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(cloneDay);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="ring-1 ring-border rounded-xl overflow-hidden shadow-sm">{rows}</div>;
  };

  // Get appointments for selected date
  const selectedDateAppointments = appointments.filter(app => isSameDay(app.date, selectedDate));

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Calendar Grid */}
      <div className="flex-1">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Selected Day Appointments */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <Card className="bg-muted/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <CalendarDays className="h-5 w-5" />
                <h3 className="font-bold text-sm">Appointments</h3>
              </div>
              <Badge variant="outline" className="bg-background text-[10px] font-black uppercase tracking-tight">
                {format(selectedDate, "MMM d")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map((app) => (
                <div key={app.id} className="relative group transition-all">
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-full",
                    app.status === 'completed' ? "bg-green-500" : "bg-blue-500"
                  )} />
                  <div className="pl-4 py-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-black">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {app.time}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-xs font-bold"
                            onClick={() => {
                              setEditingAppointment(app);
                              setIsModalOpen(true);
                            }}
                          >
                            Edit Appointment
                          </DropdownMenuItem>

                          {app.status === 'scheduled' && (
                            <DropdownMenuItem
                              className="text-xs font-bold"
                              onClick={() => updateAppointment(app.id, { status: 'completed' })}
                            >
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {app.status !== 'cancelled' && (
                            <DropdownMenuItem
                              className="text-xs font-bold text-red-600"
                              onClick={() => {
                                if (window.confirm(`Cancel appointment for ${app.patientName}?`)) {
                                  updateAppointment(app.id, { status: 'cancelled' });
                                  toast.success("Appointment cancelled");
                                }
                              }}
                            >
                              Cancel Appointment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 border shrink-0">
                          <AvatarImage src={getPatientAvatarPath(app.patientId, app.patientGender)} alt={app.patientName} />
                          <AvatarFallback className={cn("text-[10px]", getAvatarBg(app.patientName))}>
                            {getAvatarInitials(app.patientName)}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="text-sm font-bold text-foreground truncate">{app.patientName}</h4>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="space-y-1 mt-1.5">
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <Stethoscope className="h-3 w-3" />
                            {app.service}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <User className="h-3 w-3" />
                            {app.doctor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/90 flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground">No appointments</p>
                {!isBefore(selectedDate, startOfDay(new Date())) && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2 text-primary"
                    onClick={() => handleOpenModal(selectedDate)}
                  >
                    Schedule One
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddEditAppointmentModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingAppointment(null); // Clear edit state when modal closes
        }}
        initialDate={modalInitialDate}
        appointmentToEdit={editingAppointment}
        onSave={(appointmentData, isEdit) => {
          if (isEdit) {
            updateAppointment(appointmentData.id, appointmentData);
          } else {
            addAppointment(appointmentData);
          }
          setSelectedDate(appointmentData.date);
        }}
        onDelete={(appointmentId) => {
          deleteAppointment(appointmentId);
        }}
      />
    </div>
  );
}
