"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Check,
  X,
  Search,
  Calendar as CalendarIcon,
  Clock,
  Scan,
  Stethoscope,
  AlertTriangle,
  UserPlus,
  UserCheck,
  Users,
  FileText,
  User,
  Trash2,
  Save
} from "lucide-react";
import { format, parse } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { PatientCollection } from "@/components/PatientCollection";


// Services data
const MOCK_SERVICES = [
  { id: "MRI", name: "MRI", subServices: ["Brain (Contrast)", "Spine (Lumbar)", "Knee", "Shoulder", "Abdomen"] },
  { id: "CT", name: "CT Scan", subServices: ["Chest", "Abdomen & Pelvis", "Head", "Angiography", "Virtual Colonoscopy"] },
  { id: "XRAY", name: "X-Ray", subServices: ["Chest", "Wrist", "Knee", "Spine", "Skull"] },
  { id: "US", name: "Ultrasound", subServices: ["Pelvis", "Abdomen", "Thyroid", "Breast", "Doppler"] },
  { id: "MAMMO", name: "Mammography", subServices: ["Digital", "3D Tomosynthesis", "Screening", "Diagnostic"] },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  { value: "high", label: "High", color: "bg-red-100 text-red-700" },
];

// Mock patients data with visit history
const MOCK_PATIENTS = [
  {
    id: "CP120456A",
    name: "Alex Turner",
    age: 28,
    gender: "Male",
    patientType: "private" as const,
    phone: "+234 801 234 5678",
    email: "alex.turner@email.com",
    lastVisit: "2025-01-15",
    totalVisits: 3,
    lastService: "MRI Brain",
    pendingTests: ["CT Chest", "X-Ray Wrist"],
    avatar: "",
    status: "active" as const,
    referringHospital: "City General Hospital",
    referringDoctor: "Dr. Sarah Johnson"
  },
  {
    id: "CP238122C",
    name: "Maria Garcia",
    age: 34,
    gender: "Female",
    patientType: "hmo" as const,
    phone: "+234 802 345 6789",
    email: "maria.garcia@email.com",
    lastVisit: "2025-01-10",
    totalVisits: 2,
    lastService: "Ultrasound Pelvis",
    pendingTests: ["MRI Spine"],
    avatar: "",
    status: "active" as const,
    referringHospital: "Metropolitan Medical Center",
    referringDoctor: "Dr. Michael Chen"
  },
  {
    id: "CP349011B",
    name: "James Wilson",
    age: 42,
    gender: "Male",
    patientType: "regular" as const,
    phone: "+234 803 456 7890",
    email: "james.wilson@email.com",
    lastVisit: "2024-12-05",
    totalVisits: 5,
    lastService: "CT Abdomen",
    pendingTests: ["X-Ray Chest"],
    avatar: "",
    status: "active" as const,
    referringHospital: "St. Jude Specialist Center",
    referringDoctor: "Dr. Emily Okafor"
  },
  {
    id: "CP456789D",
    name: "Lisa Wang",
    age: 25,
    gender: "Female",
    patientType: "hmo" as const,
    phone: "+234 804 567 8901",
    email: "lisa.wang@email.com",
    lastVisit: "2025-01-08",
    totalVisits: 1,
    lastService: "Mammography",
    pendingTests: ["Ultrasound Breast"],
    avatar: "",
    status: "active" as const,
    referringHospital: "Redeemer Health Clinic",
    referringDoctor: "Dr. David Smith"
  },
  {
    id: "CP567890E",
    name: "David Rodriguez",
    age: 31,
    gender: "Male",
    patientType: "private" as const,
    phone: "+234 805 678 9012",
    email: "david.rodriguez@email.com",
    lastVisit: "2024-11-15",
    totalVisits: 2,
    lastService: "X-Ray Knee",
    pendingTests: ["MRI Knee"],
    avatar: "",
    status: "active" as const,
    referringHospital: "City General Hospital",
    referringDoctor: "Dr. Sarah Johnson"
  }
];

// Mock doctors data
const MOCK_DOCTORS = [
  { id: "DOC-001", name: "Dr. Sarah Johnson", specialty: "Radiologist", available: true },
  { id: "DOC-002", name: "Dr. Michael Chen", specialty: "Neurologist", available: true },
  { id: "DOC-003", name: "Dr. Ope Adeyemi", specialty: "Radiologist", available: false },
  { id: "DOC-004", name: "Dr. David Lee", specialty: "Orthopedist", available: true },
  { id: "DOC-005", name: "Dr. Alice Wong", specialty: "Pediatrician", available: true },
];

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");

  const [formData, setFormData] = useState({
    // Patient Selection
    patientId: "",

    // Task Details
    service: "",
    subService: "",
    priority: "medium",
    referringHospital: "",
    referringDoctor: "",
    assignedDoctor: "",
    date: "",
    time: "09:00",
    clinicalNotes: "",
    isEmergency: false,
    isComparison: false,
  });

  useEffect(() => {
    // Simulate fetching task data
    const fetchTask = () => {
      setIsLoading(true);
      // In a real app, you'd fetch by ID. Here we just pre-fill with some data
      setTimeout(() => {
        // Mocking a task that was found
        const foundTask = {
          patientId: "CP120456A",
          service: "MRI",
          subService: "Brain (Contrast)",
          priority: "high",
          referringHospital: "City General Hospital",
          referringDoctor: "Dr. Sarah Johnson",
          assignedDoctor: "DOC-001",
          date: "2025-01-25",
          time: "10:30",
          clinicalNotes: "Rule out metastases, known lung cancer.",
          isEmergency: true,
          isComparison: false,
        };

        setFormData({
          patientId: foundTask.patientId,
          service: foundTask.service,
          subService: foundTask.subService,
          priority: foundTask.priority,
          referringHospital: foundTask.referringHospital,
          referringDoctor: foundTask.referringDoctor,
          assignedDoctor: foundTask.assignedDoctor,
          date: foundTask.date,
          time: foundTask.time,
          clinicalNotes: foundTask.clinicalNotes,
          isEmergency: foundTask.isEmergency,
          isComparison: foundTask.isComparison,
        });

        setSelectedDate(new Date(foundTask.date));
        setSelectedTime(foundTask.time);
        setIsLoading(false);
      }, 800);
    };

    fetchTask();
  }, [id]);

  const isFormValid = useMemo(() => {
    return formData.patientId !== "" &&
      formData.service !== "" &&
      formData.subService !== "" &&
      selectedDate;
  }, [formData.patientId, formData.service, formData.subService, selectedDate]);


  // Get selected patient details
  const selectedPatient = useMemo(() => {
    return MOCK_PATIENTS.find(p => p.id === formData.patientId);
  }, [formData.patientId]);

  // Get selected doctor details
  const selectedDoctor = useMemo(() => {
    return MOCK_DOCTORS.find(d => d.id === formData.assignedDoctor);
  }, [formData.assignedDoctor]);

  // Get sub-services for selected service
  const availableSubServices = useMemo(() => {
    const service = MOCK_SERVICES.find(s => s.id === formData.service);
    return service ? service.subServices : [];
  }, [formData.service]);

  // Auto-set comparison if patient has visited before
  const shouldAutoSetComparison = useMemo(() => {
    return selectedPatient && selectedPatient.totalVisits > 1;
  }, [selectedPatient]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-populate referring info when patient is selected
      ...(field === "patientId" && selectedPatient ? {
        isComparison: selectedPatient.totalVisits > 1,
        referringHospital: selectedPatient.referringHospital || "",
        referringDoctor: selectedPatient.referringDoctor || ""
      } : {})
    }));

    // Reset sub-service when service changes
    if (field === "service" && value !== formData.service) {
      setFormData(prev => ({ ...prev, subService: "" }));
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    // Combine all form data
    const finalData = {
      ...formData,
      id,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      time: selectedTime,
      patientName: selectedPatient?.name,
      patientType: selectedPatient?.patientType,
    };

    console.log("Updating task:", finalData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/task-manager");
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task:", id);
      navigate("/task-manager");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-light">Edit Task</h1>
          <p className="text-muted-foreground">Update task details for {selectedPatient?.name || "Patient"}</p>
        </div>
        <Badge variant="outline" className="font-mono px-3 py-1">
          {id}
        </Badge>
      </div>

      {/* Vertical Timeline Layout */}
      <div className="relative space-y-0">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border" />

        {/* Step 1: Patient Selection */}
        <div className="relative ml-4 pl-10 pb-8">
          {/* Step Indicator */}
          <div className="absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-white bg-background flex items-center justify-center font-medium -translate-x-1/2">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Patient Selection</h3>
            </div>

            <PatientCollection
              patients={MOCK_PATIENTS}
              selectedPatientId={formData.patientId}
              onPatientSelect={(patientId) => handleChange("patientId", patientId)}
              label="Selected Patient"
              required
            />
          </div>
        </div>

        {/* Step 2: Task Details */}
        <div className="relative ml-4 pl-10">
          {/* Step Indicator */}
          <div className="absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-white bg-background flex items-center justify-center font-medium -translate-x-1/2">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              2
            </div>
          </div>

          {/* Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Task Details</h3>
              </div>

              {/* Service Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label required>Service Type</Label>
                  <Select value={formData.service} onValueChange={(v) => handleChange("service", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SERVICES.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center gap-2">
                            <Scan className="h-4 w-4 text-muted-foreground" />
                            {service.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label required>Sub-Service</Label>
                  <Select
                    value={formData.subService}
                    onValueChange={(v) => handleChange("subService", v)}
                    disabled={!formData.service}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.service ? "Select sub-service" : "Select service first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubServices.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label required>Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label required>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => handleChange("priority", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              priority.value === 'high' ? 'bg-red-500' :
                                priority.value === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            )} />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Referring Doctor */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label>Referring Hospital</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={selectedPatient?.referringHospital || formData.referringHospital}
                      onChange={(e) => handleChange("referringHospital", e.target.value)}
                      className="pl-10 bg-muted/50"
                      disabled={!!selectedPatient?.referringHospital}
                      readOnly={!!selectedPatient?.referringHospital}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Referring Doctor</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={selectedPatient?.referringDoctor || formData.referringDoctor}
                      onChange={(e) => handleChange("referringDoctor", e.target.value)}
                      className="pl-10 bg-muted/50"
                      disabled={!!selectedPatient?.referringDoctor}
                      readOnly={!!selectedPatient?.referringDoctor}
                    />
                  </div>
                </div>
              </div>

              {/* Assign Doctor */}
              <div className="space-y-1">
                <Label>Assign to Doctor</Label>
                <Select
                  value={formData.assignedDoctor}
                  onValueChange={(v) => handleChange("assignedDoctor", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DOCTORS.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              doctor.available ? 'bg-green-500' : 'bg-red-500'
                            )} />
                            <div>
                              <div className="font-medium">{doctor.name}</div>
                            </div>
                          </div>
                          {!doctor.available && (
                            <Badge variant="outline" className="text-xs">
                              Busy
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDoctor && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected: <span className="font-medium">{selectedDoctor.name}</span> ({selectedDoctor.specialty})
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              <div className="space-y-1">
                <Label>Clinical Notes</Label>
                <Textarea
                  placeholder="Enter relevant clinical information, history, or specific instructions..."
                  value={formData.clinicalNotes}
                  onChange={(e) => handleChange("clinicalNotes", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Flags */}
              <div className="space-y-1">
                <Label>Flags</Label>
                <div className="grid md:grid-cols-2 gap-4 pb-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <Label htmlFor="emergency" className="cursor-pointer">
                        Emergency Case
                      </Label>
                    </div>
                    <Switch
                      id="emergency"
                      checked={formData.isEmergency}
                      onCheckedChange={(checked) => handleChange("isEmergency", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="comparison" className="cursor-pointer">
                        Comparison
                      </Label>
                    </div>
                    <Switch
                      id="comparison"
                      checked={formData.isComparison || shouldAutoSetComparison}
                      onCheckedChange={(checked) => handleChange("isComparison", checked)}
                      disabled={shouldAutoSetComparison}
                    />
                  </div>
                </div>

                {shouldAutoSetComparison && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-primary">
                        Comparison study auto-selected for returning patient
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/task-manager")}>
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Task
            </Button>
            <Button
              className="gap-2 min-w-[140px]"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>Updating Task...</>
              ) : (
                <>Update Task <Save className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}