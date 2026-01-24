"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Tag,
  UserPlus,
  UserCheck,
  Users,
  Shield,
  Phone,
  Mail,
  FileText,
  User
} from "lucide-react";
import { format } from "date-fns";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

const STEPS = [
  { id: 1, title: "Patient Selection", icon: User },
  { id: 2, title: "Task Details", icon: FileText },
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
    status: "active" as const
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
    status: "active" as const
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
    status: "active" as const
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
    status: "active" as const
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
    status: "active" as const
  }
];

// Mock doctors data
const MOCK_DOCTORS = [
  { id: "DOC-001", name: "Dr. Sarah Johnson", specialty: "Radiologist", available: true },
  { id: "DOC-002", name: "Dr. Michael Chen", specialty: "Neurologist", available: true },
  { id: "DOC-003", name: "Dr. Ope Adeyemi", specialty: "Radiologist", available: false },
  { id: "DOC-004", name: "Dr. David Lee", specialty: "Orthopedist", available: true },
];

// Services data
const MOCK_SERVICES = [
  { id: "MRI", name: "MRI", subServices: ["Brain (Contrast)", "Spine (Lumbar)", "Knee", "Shoulder", "Abdomen"] },
  { id: "CT", name: "CT Scan", subServices: ["Chest", "Abdomen & Pelvis", "Head", "Angiography", "Virtual Colonoscopy"] },
  { id: "XRAY", name: "X-Ray", subServices: ["Chest", "Wrist", "Knee", "Spine", "Skull"] },
  { id: "US", name: "Ultrasound", subServices: ["Pelvis", "Abdomen", "Thyroid", "Breast", "Doppler"] },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  { value: "high", label: "High", color: "bg-red-100 text-red-700" },
];

export default function CreateTask() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Patient Selection
    patientId: "",

    // Step 2: Task Details
    service: "",
    subService: "",
    priority: "medium",
    referringDoctor: "",
    assignedDoctor: "",
    date: "",
    time: "09:00",
    clinicalNotes: "",
    isEmergency: false,
    isComparison: false,
    isWalkIn: false,
    tags: [] as string[],
  });

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.patientId !== "";
    }
    if (currentStep === 2) {
      return formData.service !== "" && formData.subService !== "" && selectedDate;
    }
    return true;
  };

  // Get selected patient details
  const selectedPatient = useMemo(() => {
    return MOCK_PATIENTS.find(p => p.id === formData.patientId);
  }, [formData.patientId]);

  // Get selected doctor details
  const selectedDoctor = useMemo(() => {
    return MOCK_DOCTORS.find(d => d.id === formData.assignedDoctor);
  }, [formData.assignedDoctor]);

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    return MOCK_PATIENTS.filter(patient =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch)
    );
  }, [patientSearch]);

  // Filter doctors based on search
  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter(doctor =>
      doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
    );
  }, [doctorSearch]);

  // Get sub-services for selected service
  const availableSubServices = useMemo(() => {
    const service = MOCK_SERVICES.find(s => s.id === formData.service);
    return service ? service.subServices : [];
  }, [formData.service]);

  // Auto-set comparison if patient has visited before
  const shouldAutoSetComparison = useMemo(() => {
    return selectedPatient && selectedPatient.totalVisits > 1;
  }, [selectedPatient]);

  const handleNext = () => {
    if (isStepValid()) {
      if (currentStep === 1 && selectedPatient && selectedPatient.totalVisits > 1) {
        setFormData(prev => ({ ...prev, isComparison: true }));
      }
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Reset sub-service when service changes
    if (field === "service" && value !== formData.service) {
      setFormData(prev => ({ ...prev, subService: "" }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    // Combine all form data
    const finalData = {
      ...formData,
      tags,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      time: selectedTime,
      patientName: selectedPatient?.name,
      patientType: selectedPatient?.patientType,
    };

    console.log("Creating task:", finalData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/task-manager");
    }, 1500);
  };

  const getPatientTypeBadge = (type: string) => {
    const variants = {
      regular: "bg-blue-100 text-blue-700",
      private: "bg-purple-100 text-purple-700",
      hmo: "bg-green-100 text-green-700",
    };
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGenderBadge = (gender: string) => {
    return gender === 'Male'
      ? "bg-blue-100 text-blue-700"
      : "bg-pink-100 text-pink-700";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-light">Create New Task</h1>
        <p className="text-muted-foreground">Select a patient and create a reporting task for radiologists</p>
      </div>

      {/* Timeline Progress Header */}
      <div className="relative space-y-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary border-2 border-white text-primary-foreground flex items-center justify-center font-medium text-base z-10">
            {currentStep}
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-light">
              <span className="text-muted-foreground font-medium mr-2">Step {currentStep} of {STEPS.length}:</span>
              {STEPS[currentStep - 1].title}
            </h2>
          </div>
        </div>

        {/* Form Content with Vertical Timeline Line */}
        <div className="relative ml-4 pl-10">
          {/* The Timeline Line */}
          <div className="absolute left-0 top-[-16px] bottom-0 w-[2px] bg-border" />

          <div className="border-none bg-card/50 backdrop-blur-sm px-0">
            <div className="pb-5">
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Patient Search */}
                  <div className="space-y-4">
                    <Label required>Search for Patient</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, patient ID, or phone number..."
                        className="pl-9"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                      />
                    </div>

                    {/* Patients List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all hover:bg-muted/50",
                            formData.patientId === patient.id && "bg-primary/5 border-primary/20"
                          )}
                          onClick={() => handleChange("patientId", patient.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-9 w-9 border border-muted shadow-sm">
                                <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                                <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(patient.name))}>
                                  {getAvatarInitials(patient.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{patient.name}</h3>
                                <code className="text-xs font-mono font-semibold bg-muted px-2 py-1 rounded">
                                  {patient.id}
                                </code>
                                <Badge className={cn("text-xs capitalize", getPatientTypeBadge(patient.patientType))}>
                                  {patient.patientType}
                                </Badge>
                                <Badge className={cn("text-xs", getGenderBadge(patient.gender))}>
                                  {patient.gender.charAt(0)}
                                </Badge>
                              </div>
                            </div>
                            {/* Visit Info */}
                            <div className="flex items-center gap-4 text-[13px] text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{patient.totalVisits} visits</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 border-t mt-3">
                            <div className="flex gap-4 justify-between pt-3">
                              {/* Pending Tests */}
                              {patient.pendingTests.length > 0 && (
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Scan className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">Pending Tests:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {patient.pendingTests.map((test, index) => (
                                      <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                        {test}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Last Service */}
                              {patient.lastService && (
                                <div className="flex flex-col justify-end items-end gap-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Scan className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">Last Service: {formatDate(patient.lastVisit)}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">
                                    {patient.lastService}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>

                          {formData.patientId === patient.id && (
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}

                      {filteredPatients.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">No patients found matching "{patientSearch}"</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate("/patients/create")}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Register New Patient
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Patient Summary */}
                  {selectedPatient && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(selectedPatient.name))}>
                                {getAvatarInitials(selectedPatient.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">Selected Patient</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedPatient.name} • {selectedPatient.id}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChange("patientId", "")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Patient Type:</span>
                            <Badge className={cn("ml-2", getPatientTypeBadge(selectedPatient.patientType))}>
                              {selectedPatient.patientType.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Visits:</span>
                            <span className="font-medium ml-2">{selectedPatient.totalVisits}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Visit:</span>
                            <span className="font-medium ml-2">{formatDate(selectedPatient.lastVisit)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className="ml-2 bg-green-100 text-green-700">
                              Active
                            </Badge>
                          </div>
                        </div>

                        {shouldAutoSetComparison && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">
                                This is a returning patient. Comparison study will be auto-selected.
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Selected Patient Info */}
                  {selectedPatient && (
                    <Card className="bg-slate-50/50 border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(selectedPatient.name))}>
                                {getAvatarInitials(selectedPatient.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{selectedPatient.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {selectedPatient.id} • {selectedPatient.patientType.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <Badge className={cn(getPatientTypeBadge(selectedPatient.patientType))}>
                            {selectedPatient.patientType.toUpperCase()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Service Selection */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
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

                    <div className="space-y-2">
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
                    <div className="space-y-2">
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

                    <div className="space-y-2">
                      <Label required>Priority</Label>
                      <RadioGroup
                        value={formData.priority}
                        onValueChange={(v) => handleChange("priority", v)}
                        className="flex gap-4"
                      >
                        {PRIORITIES.map((priority) => (
                          <div key={priority.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={priority.value} id={priority.value} />
                            <Label
                              htmlFor={priority.value}
                              className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer border",
                                priority.color
                              )}
                            >
                              {priority.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Referring Doctor */}
                  <div className="space-y-2">
                    <Label>Referring Doctor/Hospital</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Dr. Name or Hospital"
                        value={formData.referringDoctor}
                        onChange={(e) => handleChange("referringDoctor", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Assign Radiologist */}
                  <div className="space-y-3">
                    <Label>Assign to Radiologist</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search radiologists..."
                          className="pl-9"
                          value={doctorSearch}
                          onChange={(e) => setDoctorSearch(e.target.value)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                        {filteredDoctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                              formData.assignedDoctor === doctor.id
                                ? "bg-primary/5 border-primary/20"
                                : "hover:bg-muted/50"
                            )}
                            onClick={() => handleChange("assignedDoctor", doctor.id)}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{doctor.name}</div>
                              <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                            </div>
                            {doctor.available ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                Available
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                Busy
                              </Badge>
                            )}
                            {formData.assignedDoctor === doctor.id && (
                              <UserCheck className="h-4 w-4 text-primary ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Notes */}
                  <div className="space-y-2">
                    <Label>Clinical Notes</Label>
                    <Textarea
                      placeholder="Enter relevant clinical information, history, or specific instructions..."
                      value={formData.clinicalNotes}
                      onChange={(e) => handleChange("clinicalNotes", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Flags & Tags */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base">Flags</Label>
                      <div className="grid md:grid-cols-3 gap-4">
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
                              Comparison Study
                            </Label>
                          </div>
                          <Switch
                            id="comparison"
                            checked={formData.isComparison || shouldAutoSetComparison}
                            onCheckedChange={(checked) => handleChange("isComparison", checked)}
                            disabled={shouldAutoSetComparison}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-purple-500" />
                            <Label htmlFor="walkin" className="cursor-pointer">
                              Walk-in Patient
                            </Label>
                          </div>
                          <Switch
                            id="walkin"
                            checked={formData.isWalkIn}
                            onCheckedChange={(checked) => handleChange("isWalkIn", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tags (neuro, urgent, follow-up...)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-3 py-1 flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="ml-4 pl-10 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/task-manager")}>
                Cancel
              </Button>
              {currentStep < 2 ? (
                <Button
                  onClick={handleNext}
                  className="gap-2 min-w-[120px]"
                  disabled={!isStepValid()}
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gap-2 min-w-[140px]"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepValid()}
                >
                  {isSubmitting ? (
                    <>Creating Task...</>
                  ) : (
                    <>Create Task <Check className="h-4 w-4" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}