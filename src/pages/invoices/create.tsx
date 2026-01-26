"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Plus,
  Check,
  Search,
  Calendar as CalendarIcon,
  Scan,
  HeartPulse,
  Trash2,
  DollarSign
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
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

const MOCK_SERVICES = [
  { id: "S-001", name: "MRI Brain (With Contrast)", price: 185000, category: "MRI" },
  { id: "S-002", name: "MRI Spine (Lumbar)", price: 150000, category: "MRI" },
  { id: "S-003", name: "CT Scan Head", price: 85000, category: "CT" },
  { id: "S-004", name: "Chest X-Ray", price: 15000, category: "X-Ray" },
  { id: "S-005", name: "Abdominal Ultrasound", price: 25000, category: "Ultrasound" },
];

const MOCK_PATIENTS = [
  { id: "PAT-105", name: "John Adebayo", email: "john@example.com", gender: "Male" },
  { id: "PAT-211", name: "Sarah Phillips", email: "sarah@example.com", gender: "Female" },
  { id: "PAT-094", name: "Michael Chen", email: "michael@example.com", gender: "Male" },
];

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [modalSelectedServices, setModalSelectedServices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: "",
    issuedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    services: [] as any[]
  });

  const selectedPatient = useMemo(() =>
    MOCK_PATIENTS.find(p => p.id === formData.patientId),
    [formData.patientId]
  );

  const calculateTotal = () => {
    return formData.services.reduce((sum, s) => sum + s.price, 0);
  };

  const handleFinalize = () => {
    if (!formData.patientId) {
      toast.error("Please select a patient");
      return;
    }
    if (formData.services.length === 0) {
      toast.error("Please add at least one service");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Invoice created successfully");
      navigate("/invoices");
    }, 1500);
  };

  const removeService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  const openServiceModal = () => {
    setModalSelectedServices([...formData.services]);
    setIsServiceModalOpen(true);
  };

  const toggleModalService = (service: any) => {
    if (modalSelectedServices.find(s => s.id === service.id)) {
      setModalSelectedServices(modalSelectedServices.filter(s => s.id !== service.id));
    } else {
      setModalSelectedServices([...modalSelectedServices, service]);
    }
  };

  const confirmModalServices = () => {
    setFormData(prev => ({ ...prev, services: modalSelectedServices }));
    setIsServiceModalOpen(false);
  };

  const filteredServices = MOCK_SERVICES.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <div className="min-h-full flex flex-col">
      <div className="max-w-3xl mx-auto w-full p-6 pb-20 space-y-8">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Create New Invoice</h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Billing & Diagnostic Records</p>
        </div>
        <div className="grid gap-8">
          {/* Patient Information Section */}
          <Card className="rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-0 border-t-4 border-primary">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-800 tracking-light">Patient Selection</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Search Patient</Label>
                    <Select value={formData.patientId} onValueChange={(v) => setFormData(prev => ({ ...prev, patientId: v }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a patient..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_PATIENTS.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={getPatientAvatarPath(p.id, p.gender)} />
                                <AvatarFallback className={cn("text-[8px] text-white", getAvatarBg(p.name))}>{getAvatarInitials(p.name)}</AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-sm">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono tracking-tighter">({p.id})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Patient Email</Label>
                    <Input
                      disabled
                      value={selectedPatient?.email || ""}
                      placeholder="Select patient to view email"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Issued Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 justify-start text-left font-semibold",
                            !formData.issuedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 text-slate-500" />
                          {formData.issuedDate ? format(formData.issuedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.issuedDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, issuedDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 justify-start text-left font-semibold",
                            !formData.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 text-slate-500" />
                          {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, dueDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services & Line Items Section */}
          <Card className="rounded-2xl bg-white overflow-hidden min-h-[400px] flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Scan className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold tracking-light text-slate-800">Diagnostic Services</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Line Items</p>
                  </div>
                </div>
                <Button onClick={openServiceModal} size="sm" className="h-9">
                  <Plus className="h-4 w-4" /> Add Service
                </Button>
              </div>

              <ScrollArea className="flex-1 max-h-[350px]">
                <div className="p-0">
                  {formData.services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-12">
                      <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                        <Scan className="h-8 w-8 text-slate-300" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">No Services Added</h3>
                      <p className="text-[13px] text-slate-500 max-w-[250px] mt-1 font-medium">Click 'Add Service' to start adding diagnostic services to this invoice.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      <div className="grid grid-cols-12 px-6 py-3 bg-slate-50/50">
                        <div className="col-span-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Service Description</div>
                        <div className="col-span-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500 text-right">Unit Price</div>
                        <div className="col-span-1"></div>
                      </div>
                      {formData.services.map((service) => (
                        <div key={service.id} className="grid grid-cols-12 px-6 py-4 items-center group hover:bg-slate-50/30 transition-colors">
                          <div className="col-span-8 flex items-center gap-4">
                            <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                              <HeartPulse className="h-4 w-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{service.name}</p>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                {service.category}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm font-black text-slate-900 tabular-nums">₦{service.price.toLocaleString()}</span>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeService(service.id)}
                              className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 py-5 bg-slate-50/50 border-t mt-auto">
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex gap-12 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="tabular-nums">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex gap-12 text-lg font-black text-slate-900 leading-none pt-2">
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Total Due
                    </span>
                    <span className="text-primary tabular-nums">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-12">
            <Button variant="outline" onClick={() => navigate("/invoices")}>
              Cancel
            </Button>
            <Button
              className="min-w-[180px]"
              onClick={handleFinalize}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Finalizing..." : (
                <>Generate Invoice <Check className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>

        {/* Multi-Service Selection Modal */}
        <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col h-[600px] border-none shadow-2xl">
            <DialogHeader className="p-6 bg-white border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Scan className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">Clinical Service Catalog</DialogTitle>
                  <DialogDescription className="text-sm font-medium">Select procedures to add to the patient invoice.</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search procedures by name or modality (e.g. MRI, CT)..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="pl-10 h-11 border-input bg-slate-50/50 focus:bg-white transition-all rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 pb-2">
              <div className="space-y-2 py-2">
                {filteredServices.map((service) => {
                  const isSelected = modalSelectedServices.some(s => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      className={cn(
                        "flex items-center justify-between p-4 py-3 rounded-xl border transition-all cursor-pointer group",
                        isSelected
                          ? "bg-primary/[0.03] border-input shadow-[0_0_0_1px_rgba(var(--primary),0.1)]"
                          : "hover:bg-slate-50 hover:border-input bg-white border-input/50"
                      )}
                      onClick={() => toggleModalService(service)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center transition-all",
                          isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white"
                        )}>
                          {isSelected ? <Check className="h-5 w-5" /> : <HeartPulse className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">{service.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{service.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "font-black tabular-nums transition-colors",
                          isSelected ? "text-primary" : "text-slate-900"
                        )}>₦{service.price.toLocaleString()}</span>
                        <div className={cn(
                          "h-6 w-6 rounded-lg flex items-center justify-center transition-all",
                          isSelected ? "bg-primary/20 text-primary" : "bg-[#e6f0ff] text-[#006bff] opacity-0 group-hover:opacity-100"
                        )}>
                          <Plus className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 pt-4 border-t bg-slate-50/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Procedures</span>
                  <span className="text-sm font-black text-slate-700">{modalSelectedServices.length} Items</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setIsServiceModalOpen(false)} className="font-bold border-transparent hover:bg-slate-200/50">
                    Cancel
                  </Button>
                  <Button onClick={confirmModalServices}>
                    Add Procedures <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
