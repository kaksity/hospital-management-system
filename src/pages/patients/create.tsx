"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Stethoscope,
  Receipt,
  ChevronRight,
  ChevronLeft,
  Plus,
  Check,
  X,
  Search,
  Calendar as CalendarIcon,
  ShieldCheck,
  CalendarDays
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
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
import { countryCodes } from "@/utils/countryData";

const STEPS = [
  { id: 1, title: "Contact Information", icon: User },
  { id: 2, title: "Clinical Information", icon: Stethoscope },
  { id: 3, title: "Billing & Invoice", icon: Receipt },
];

const MOCK_HOSPITALS = [
  "City General Hospital",
  "Metropolitan Medical Center",
  "St. Jude Specialist Center",
  "Redeemer Health Clinic"
];

const MOCK_DOCTORS = [
  { id: "DOC-001", name: "Dr. Sarah Johnson", hospital: "City General Hospital", specialty: "Radiologist", marketer: "John Doe" },
  { id: "DOC-002", name: "Dr. Michael Chen", hospital: "Metropolitan Medical Center", specialty: "Neurologist", marketer: "Jane Smith" },
  { id: "DOC-003", name: "Dr. Emily Okafor", hospital: "St. Jude Specialist Center", specialty: "General Surgeon", marketer: "Bob Wilson" },
  { id: "DOC-004", name: "Dr. David Smith", hospital: "City General Hospital", specialty: "Cardiologist", marketer: "John Doe" },
  { id: "DOC-005", name: "Dr. Alice Wong", hospital: "Metropolitan Medical Center", specialty: "Pediatrician", marketer: "Jane Smith" },
];

const MOCK_MARKETERS = ["John Doe", "Jane Smith", "Bob Wilson"];

const MOCK_SERVICES = [
  { id: "S-001", name: "MRI Brain (With Contrast)", price: 185000, category: "MRI" },
  { id: "S-002", name: "MRI Spine (Lumbar)", price: 150000, category: "MRI" },
  { id: "S-003", name: "CT Scan Head", price: 85000, category: "CT" },
  { id: "S-004", name: "Chest X-Ray", price: 15000, category: "X-Ray" },
  { id: "S-005", name: "Abdominal Ultrasound", price: 25000, category: "Ultrasound" },
];

const MOCK_INDICATIONS = [
  "MRI Brain",
  "MRI Spine",
  "CT Scan Head",
  "Chest X-Ray",
  "Abdominal Ultrasound",
  "Mammography",
  "Echocardiogram"
];

export default function CreatePatientPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [formData, setFormData] = useState({
    // Step 1: Contact
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "NG",
    phone: "",
    countryCode: "NG",
    email: "",
    preferredCommunication: ["WhatsApp"] as string[],
    address: "",

    // Step 2: Clinical
    indication: "",
    investigationReason: "",
    referringPhysician: "",
    hospital: "",
    physicianId: "",
    marketer: "",

    // Step 3: Billing
    scans: [] as typeof MOCK_SERVICES
  });

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.phone && formData.preferredCommunication.length > 0;
    }
    if (currentStep === 2) {
      return formData.referringPhysician && formData.indication && formData.investigationReason;
    }
    return true;
  };

  const age = useMemo(() => {
    if (!formData.dob) return null;
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [formData.dob]);

  const selectedCountry = useMemo(() =>
    countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0],
    [formData.countryCode]
  );

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addScan = (service: typeof MOCK_SERVICES[0]) => {
    if (formData.scans.some(s => s.id === service.id)) return;
    setFormData(prev => ({ ...prev, scans: [...prev.scans, service] }));
    setIsServiceModalOpen(false);
  };

  const removeScan = (id: string) => {
    setFormData(prev => ({ ...prev, scans: prev.scans.filter(s => s.id !== id) }));
  };

  const handleHospitalSelect = (hospitalName: string) => {
    setFormData(prev => ({
      ...prev,
      hospital: hospitalName,
      referringPhysician: "", // Reset doctor when hospital changes
      physicianId: "",
      marketer: ""
    }));
  };

  const handleDoctorSelect = (docId: string) => {
    const doctor = MOCK_DOCTORS.find(d => d.id === docId);
    if (doctor) {
      setFormData(prev => ({
        ...prev,
        referringPhysician: doctor.name,
        hospital: doctor.hospital,
        physicianId: doctor.id,
        marketer: doctor.marketer
      }));
    }
  };

  const filteredDoctors = useMemo(() => {
    if (!formData.hospital) return [];
    return MOCK_DOCTORS.filter(d => d.hospital === formData.hospital);
  }, [formData.hospital]);

  const filteredServices = MOCK_SERVICES.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const handleFinalize = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/patients");
    }, 1500);
  };

  const calculateTotal = () => {
    return formData.scans.reduce((sum, scan) => sum + scan.price, 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium tracking-light">Register New Patient</h1>
        <p className="text-muted-foreground">Follow the steps below to create a comprehensive patient record.</p>
      </div>

      {/* Timeline Progress Header */}
      <div className="relative space-y-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary border border-2 border-white text-primary-foreground flex items-center justify-center font-medium text-base z-10">
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
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>First Name</Label>
                      <Input
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={e => handleChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Last Name</Label>
                      <Input
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={e => handleChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between space-y-1">
                        <Label>Date of Birth</Label>
                        {age !== null && (
                          <Badge className="bg-primary/10 text-primary border-none pointer-events-none">
                            {age} years old
                          </Badge>
                        )}
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !formData.dob && "text-muted-foreground"
                            )}
                          >
                            {formData.dob ? (
                              format(new Date(formData.dob), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.dob ? new Date(formData.dob) : undefined}
                            onSelect={(date) => handleChange("dob", date?.toISOString() || "")}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <Label>Gender</Label>
                      <Select value={formData.gender} onValueChange={v => handleChange("gender", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Nationality</Label>
                      <Select value={formData.nationality} onValueChange={v => handleChange("nationality", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map(c => (
                            <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Phone Number</Label>
                      <div className="flex gap-2">
                        <Select value={formData.countryCode} onValueChange={v => handleChange("countryCode", v)}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue>{selectedCountry.dialCode}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map(c => (
                              <SelectItem key={c.code} value={c.code}>{c.flag} {c.dialCode}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          className="flex-1"
                          placeholder="801 234 5678"
                          value={formData.phone}
                          onChange={e => handleChange("phone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Home Address</Label>
                    <Textarea
                      placeholder="Enter residential address"
                      value={formData.address}
                      onChange={e => handleChange("address", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Communication</Label>
                    <Select
                      value=""
                      onValueChange={v => {
                        if (v && !formData.preferredCommunication.includes(v)) {
                          setFormData(prev => ({
                            ...prev,
                            preferredCommunication: [...prev.preferredCommunication, v]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {["WhatsApp", "Email", "SMS", "Phone Call"].filter(m => !formData.preferredCommunication.includes(m)).map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.preferredCommunication.map(mode => (
                        <Badge key={mode} variant="outline" className="gap-1 py-1 px-2">
                          {mode}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                preferredCommunication: prev.preferredCommunication.filter(m => m !== mode)
                              }));
                            }}
                            className="hover:text-destructive shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-1">
                    <Label>Preferred Scan (Indication)</Label>
                    <Select value={formData.indication} onValueChange={v => handleChange("indication", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select required scan" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_INDICATIONS.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Reason for Scan / Investigation</Label>
                    <Textarea
                      placeholder="e.g. Chronic headaches, suspected fracture..."
                      className="min-h-[80px]"
                      value={formData.investigationReason}
                      onChange={e => handleChange("investigationReason", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-1">
                      <Label>Hospital / Facility</Label>
                      <Select value={formData.hospital} onValueChange={handleHospitalSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_HOSPITALS.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Referring Physician</Label>
                      <Select
                        value={MOCK_DOCTORS.find(d => d.id === formData.physicianId)?.id || ""}
                        onValueChange={handleDoctorSelect}
                        disabled={!formData.hospital}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.hospital ? "Select a doctor" : "Select hospital first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredDoctors.map(doc => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.name} ({doc.specialty})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label>Physician ID</Label>
                      <Input
                        placeholder="Auto-filled"
                        readOnly
                        value={formData.physicianId}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Attached Marketer</Label>
                      <Input
                        placeholder="Auto-filled"
                        readOnly
                        value={formData.marketer}
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Scans & Services</h3>
                      <p className="text-sm text-muted-foreground">Add services to be provided for this visit.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsServiceModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Service
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.scans.length === 0 ? (
                      <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        No services added yet. Click 'Add Service' to begin.
                      </div>
                    ) : (
                      formData.scans.map((scan) => (
                        <div key={scan.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Receipt className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{scan.name}</p>
                              <p className="text-xs text-muted-foreground">Standard Radiology Service</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <p className="font-semibold font-mono">₦{scan.price.toLocaleString()}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => removeScan(scan.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {formData.scans.length > 0 && (
                    <div className="pt-6 border-t flex flex-col items-end gap-2">
                      <div className="flex gap-12 text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₦{calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex gap-12 text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary font-mono">₦{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/5 p-4 rounded-lg flex items-center gap-4 text-sm text-primary border border-primary/10">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <p>Invoices will be automatically generated and sent to the patient's preferred communication ({formData.preferredCommunication.join(", ")}) upon submission.</p>
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
              <Button variant="outline" onClick={() => navigate("/patients")}>
                Cancel
              </Button>
              {currentStep < 3 ? (
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
                  onClick={handleFinalize}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>Finalize Registration <Check className="h-4 w-4" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection Dialog */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Service</DialogTitle>
            <DialogDescription>
              Choose from available radiology services to add to this patient's visit.
            </DialogDescription>
          </DialogHeader>

          <div className="relative my-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by service name or category (e.g. MRI)"
              className="pl-9"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group",
                  formData.scans.some(s => s.id === service.id)
                    ? "bg-primary/5 border-primary/20 pointer-events-none opacity-60"
                    : "hover:bg-muted/50 hover:border-primary/20"
                )}
                onClick={() => addScan(service)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
                    {service.category}
                  </div>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.category} Radiology</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-semibold">₦{service.price.toLocaleString()}</span>
                  {formData.scans.some(s => s.id === service.id) ? (
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Add
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
