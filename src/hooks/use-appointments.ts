import { useEffect, useState } from 'react';

export interface Appointment {
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

// Helper function to serialize/deserialize dates
const serializeAppointments = (appointments: Appointment[]): string => {
  return JSON.stringify(appointments, (key, value) => {
    if (key === 'date') {
      // Handle both Date objects and strings
      if (value instanceof Date) {
        return value.toISOString();
      } else if (typeof value === 'string') {
        // If it's already a string, make sure it's ISO format
        return new Date(value).toISOString();
      }
    }
    return value;
  });
};

const deserializeAppointments = (json: string): Appointment[] => {
  try {
    const parsed = JSON.parse(json, (key, value) => {
      if (key === 'date' && typeof value === 'string') {
        return new Date(value); // Convert ISO string back to Date
      }
      return value;
    });
    return parsed || [];
  } catch (error) {
    console.error('Failed to parse appointments from localStorage:', error);
    return [];
  }
};

// Default appointments
const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "APP-001",
    patientId: "CP120456A",
    patientName: "John Adebayo",
    patientGender: "Male",
    service: "MRI Brain",
    doctor: "Dr. Ope Adeyemi",
    time: "09:00 AM",
    date: new Date(2026, 0, 21),
    status: "scheduled",
  },
  {
    id: "APP-002",
    patientId: "CP456789D",
    patientName: "Sarah Phillips",
    patientGender: "Female",
    service: "CT Head",
    doctor: "Dr. Michael Chen",
    time: "10:30 AM",
    date: new Date(2026, 0, 21),
    status: "scheduled",
  },
  {
    id: "APP-003",
    patientId: "CP238122C",
    patientName: "Maria Garcia",
    patientGender: "Female",
    service: "Chest X-Ray",
    doctor: "Dr. Sarah Johnson",
    time: "02:00 PM",
    date: new Date(2026, 0, 22),
    status: "scheduled",
  },
  {
    id: "APP-004",
    patientId: "CP349011B",
    patientName: "James Wilson",
    patientGender: "Male",
    service: "Ultrasound Pelvis",
    doctor: "Dr. Michael Chen",
    time: "03:45 PM",
    date: new Date(2026, 0, 21),
    status: "completed",
  },
];

const STORAGE_KEY = 'radiology_appointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    // Load from localStorage on initial render
    if (typeof window === 'undefined') return DEFAULT_APPOINTMENTS;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return deserializeAppointments(saved);
      }
    } catch (error) {
      console.error('Failed to load appointments from localStorage:', error);
    }

    return DEFAULT_APPOINTMENTS;
  });

  // Save to localStorage whenever appointments change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeAppointments(appointments));
    } catch (error) {
      console.error('Failed to save appointments to localStorage:', error);
    }
  }, [appointments]);

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `APP-${Date.now().toString().slice(-6)}`,
      status: 'scheduled'
    };

    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, ...updates } : app
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  // Clear all appointments (optional, useful for debugging)
  const clearAppointments = () => {
    setAppointments([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Reset to default appointments
  const resetToDefault = () => {
    setAppointments(DEFAULT_APPOINTMENTS);
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    clearAppointments,
    resetToDefault
  };
};