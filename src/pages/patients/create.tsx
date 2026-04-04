"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  CalendarDays,
  Skull,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { countryCodes } from "@/utils/countryData";
import { toast } from "sonner";

const COMMUNICATION_METHODS = ["WhatsApp", "Email", "SMS", "Phone Call"];

export default function CreatePatientPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    admissionStatus: "outpatient" as "outpatient" | "admitted" | "deceased",
    ward: "",
    bedNumber: "",
    // Mortuary fields
    dateOfDeath: "",
    timeOfDeath: "",
    causeOfDeath: "",
    certifyingDoctor: "",
    mortuaryBay: "",
    mortuaryNotes: "",
  });

  const isFormValid = () => {
    if (formData.admissionStatus === "admitted" && (!formData.ward || !formData.bedNumber)) return false;
    if (formData.admissionStatus === "deceased" && (!formData.dateOfDeath || !formData.causeOfDeath)) return false;
    return (
      formData.patientType &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.preferredCommunication.length > 0
    );
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

  const selectedCountry = useMemo(
    () => countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0],
    [formData.countryCode]
  );

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success("Patient registered", {
      description: `Record created for ${formData.firstName} ${formData.lastName}.`,
    });
    setIsSubmitting(false);
    navigate("/patients");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-light">Register New Patient</h1>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
          Fill in the patient's contact and admission information below.
        </p>
      </div>

      {/* Form */}
      <div className="relative ml-4 pl-10">
        <div className="absolute left-0 top-[-16px] bottom-0 w-[2px] bg-border" />

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-5">
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
                    {formData.dob ? format(new Date(formData.dob), "PPP") : <span>Pick a date</span>}
                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dob ? new Date(formData.dob) : undefined}
                    onSelect={(date) => handleChange("dob", date?.toISOString() || "")}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label required>Admission Status</Label>
            <Select
              value={formData.admissionStatus}
              onValueChange={v => handleChange("admissionStatus", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outpatient">Outpatient</SelectItem>
                <SelectItem value="admitted">Admitted</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.admissionStatus === "admitted" && (
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

          {formData.admissionStatus === "deceased" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Skull className="h-4 w-4 text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Mortuary Information</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label required>Date of Death</Label>
                  <Input
                    type="date"
                    value={formData.dateOfDeath}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={e => handleChange("dateOfDeath", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Time of Death</Label>
                  <Input
                    type="time"
                    value={formData.timeOfDeath}
                    onChange={e => handleChange("timeOfDeath", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label required>Cause of Death</Label>
                <Input
                  placeholder="e.g. Cardiac arrest, Respiratory failure"
                  value={formData.causeOfDeath}
                  onChange={e => handleChange("causeOfDeath", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Certifying Doctor</Label>
                  <Input
                    placeholder="e.g. Dr. Sarah Johnson"
                    value={formData.certifyingDoctor}
                    onChange={e => handleChange("certifyingDoctor", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Mortuary Bay</Label>
                  <Input
                    placeholder="e.g. Bay 3, Refrigeration Unit A"
                    value={formData.mortuaryBay}
                    onChange={e => handleChange("mortuaryBay", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any additional notes regarding the deceased..."
                  value={formData.mortuaryNotes}
                  onChange={e => handleChange("mortuaryNotes", e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="ml-4 pl-10 pt-2 pb-6">
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/patients")}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>Register Patient <Check className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
