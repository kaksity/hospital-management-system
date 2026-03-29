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
  CalendarDays,
  Scan
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { countryCodes } from "@/utils/countryData";
import { emailService } from "@/services/emailService";
import { SendInvoiceModal } from "@/components/Modals/SendInvoiceModal";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Contact Information", icon: User },
  { id: 2, title: "Billing & Invoice", icon: Receipt },
];



const MOCK_SERVICES = [
  { id: "S-001", name: "MRI Brain (With Contrast)", price: 185000, category: "MRI" },
  { id: "S-002", name: "MRI Spine (Lumbar)", price: 150000, category: "MRI" },
  { id: "S-003", name: "CT Scan Head", price: 85000, category: "CT" },
  { id: "S-004", name: "Chest X-Ray", price: 15000, category: "X-Ray" },
  { id: "S-005", name: "Abdominal Ultrasound", price: 25000, category: "Ultrasound" },
];



const COMMUNICATION_METHODS = ["WhatsApp", "Email", "SMS", "Phone Call"];

export default function CreatePatientPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSendInvoiceModalOpen, setIsSendInvoiceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [formData, setFormData] = useState({
    // Step 1: Contact
    patientType: "Private",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    nationality: "NG",
    phone: "",
    countryCode: "NG",
    email: "",
    preferredCommunication: ["WhatsApp"] as string[],
    address: "",

    isAdmitted: false,
    ward: "",
    bedNumber: "",

    // Step 2: Billing
    scans: [] as typeof MOCK_SERVICES
  });

  const isStepValid = () => {
    if (currentStep === 1) {
      if (formData.isAdmitted && (!formData.ward || !formData.bedNumber)) return false;
      return formData.patientType && formData.firstName && formData.lastName && formData.email && formData.phone && formData.preferredCommunication.length > 0;
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
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  };
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleScan = (service: typeof MOCK_SERVICES[0]) => {
    setFormData(prev => {
      const isSelected = prev.scans.some(s => s.id === service.id);
      if (isSelected) {
        return { ...prev, scans: prev.scans.filter(s => s.id !== service.id) };
      } else {
        return { ...prev, scans: [...prev.scans, service] };
      }
    });
  };

  const removeScan = (id: string) => {
    setFormData(prev => ({ ...prev, scans: prev.scans.filter(s => s.id !== id) }));
  };

  const filteredServices = MOCK_SERVICES.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const handleFinalize = async () => {
    // Instead of finishing immediately, we trigger the Send Invoice Modal
    setIsSendInvoiceModalOpen(true);
  };

  const handleCreateAndSendInvoice = async (invoiceData: any) => {
    setIsSubmitting(true);

    try {
      if (invoiceData.recipientEmail) {
        await emailService.sendInvoice({
          to: [invoiceData.recipientEmail],
          patientName: `${formData.firstName} ${formData.lastName}`,
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceDate: invoiceData.invoiceDate,
          totalAmount: invoiceData.total,
          services: invoiceData.services.map((s: any) => ({ name: s.name, price: s.price }))
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Close modal and show success before navigating
      setIsSendInvoiceModalOpen(false);

      toast.success("Registration complete", {
        description: `Patient record created and invoice ${invoiceData.invoiceNumber} dispatched to ${invoiceData.recipientEmail}`,
      });

      setIsSubmitting(false);
      navigate("/patients");
    } catch (error) {
      console.error("Error finalizing registration:", error);
      setIsSubmitting(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  const calculateTotal = () => {
    return formData.scans.reduce((sum, scan) => sum + scan.price, 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-light">Register New Patient</h1>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Follow the steps below to create a comprehensive patient record.</p>
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
                  <div className="space-y-1">
                    <Label required>Patient Type</Label>
                    <Select value={formData.patientType} onValueChange={v => handleChange("patientType", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="HMO">HMO</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label required>First Name</Label>
                      <Input
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={e => handleChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label required>Last Name</Label>
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

                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <Label required>Date of Birth</Label>
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
                      <Label required>Gender</Label>
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
                      <Label required>Marital Status</Label>
                      <Select value={formData.maritalStatus} onValueChange={v => handleChange("maritalStatus", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label required>Nationality</Label>
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
                  </div>

                  <div className="space-y-1">
                    <Label required>Phone Number</Label>
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

                  <div className="space-y-1">
                    <Label required>Contact Address</Label>
                    <Textarea
                      placeholder="Enter contact address"
                      value={formData.address}
                      onChange={e => handleChange("address", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2" required>
                      Preferred Communication
                      <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider">(you can select more than one)</span>
                    </Label>
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
                      disabled={formData.preferredCommunication.length === COMMUNICATION_METHODS.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          formData.preferredCommunication.length === COMMUNICATION_METHODS.length
                            ? "All methods selected"
                            : "Select method"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMUNICATION_METHODS.filter(m => !formData.preferredCommunication.includes(m)).map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.preferredCommunication.map(mode => (
                        <Badge key={mode} className="border bg-muted gap-1 py-1 px-2">
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
                    
                    <div className="space-y-2 pt-4 border-t">
                      <Label required>Admission Status</Label>
                      <Select 
                        value={formData.isAdmitted ? "Yes" : "No"} 
                        onValueChange={v => handleChange("isAdmitted", v === "Yes")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">Outpatient</SelectItem>
                          <SelectItem value="Yes">Admitted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.isAdmitted && (
                      <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1">
                          <Label required>Ward</Label>
                          <Input
                            placeholder="e.g. Surgical Ward, ICU"
                            value={formData.ward}
                            onChange={e => handleChange("ward", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label required>Bed Number</Label>
                          <Input
                            placeholder="e.g. B-12"
                            value={formData.bedNumber}
                            onChange={e => handleChange("bedNumber", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[17px] font-semibold">Scans & Services</h3>
                      <p className="text-sm text-muted-foreground">Add services to be provided for this visit.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsServiceModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Service
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.scans.length === 0 ? (
                      <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        <div className="flex items-center justify-center bg-muted/50 rounded-full w-12 h-12 mx-auto mb-2">
                          <Scan className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="text-[15px] font-semibold antialiased text-muted-foreground">No services added yet. Click 'Add Service' to begin.</span>
                      </div>
                    ) : (
                      formData.scans.map((scan) => (
                        <div key={scan.id} className="flex items-center justify-between p-4 py-3 rounded-lg bg-muted/30 border">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Scan className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-[15px]">{scan.name}</p>
                              <p className="text-xs text-slate-500">Standard Radiology Service</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <p className="font-semibold">₦{scan.price.toLocaleString()}</p>
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
                      <div className="flex gap-12 text-[17px] font-semibold">
                        <span>Total Amount</span>
                        <span className="text-primary font-semibold">₦{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg flex items-center gap-3 text-sm text-primary border bg-[#F0F6FF] text-[#1f61e2] border-[#6291ee] font-semibold antialiased">
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
                  onClick={handleFinalize}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>Finalize & Send Invoice <Check className="h-4 w-4" /></>
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

          <div className="relative my-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by service name or category (e.g. MRI)"
              className="pl-9"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredServices.map((service) => {
              const isSelected = formData.scans.some(s => s.id === service.id);
              return (
                <div
                  key={service.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                    isSelected
                      ? "bg-primary/5 border-primary/20"
                      : "hover:bg-muted/50 hover:border-primary/20"
                  )}
                  onClick={() => toggleScan(service)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center font-semibold text-xs">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.category} Radiology</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">₦{service.price.toLocaleString()}</span>
                    {isSelected ? (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-primary">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="border-t pt-4 mt-2">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {formData.scans.length} service(s) selected
              </div>
              <Button onClick={() => setIsServiceModalOpen(false)}>
                Confirm Selection
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SendInvoiceModal
        open={isSendInvoiceModalOpen}
        onOpenChange={setIsSendInvoiceModalOpen}
        patient={{
          id: "NEW", // Temporary ID
          name: `${formData.firstName} ${formData.lastName}`,
          gender: formData.gender,
          email: formData.email,
          status: "active"
        }}
        initialSelectedServices={formData.scans}
        onSendInvoice={handleCreateAndSendInvoice}
      />
    </div>
  );
}
