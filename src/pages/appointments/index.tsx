"use client";

import { AppointmentsCalendar } from "@/components/appointments/AppointmentsCalendar";

export default function AppointmentsPage() {
  return (
    <div className="p-6 h-full bg-background">
      <AppointmentsCalendar />
    </div>
  );
}