/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Receipt, X, Send, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

interface SendInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
  onSendInvoice: (invoiceData: any) => void;
}

const MOCK_SERVICES = [
  { id: "S-001", name: "MRI Brain (With Contrast)", price: 185000, category: "MRI" },
  { id: "S-002", name: "MRI Spine (Lumbar)", price: 150000, category: "MRI" },
  { id: "S-003", name: "CT Scan Head", price: 85000, category: "CT" },
  { id: "S-004", name: "Chest X-Ray", price: 15000, category: "X-Ray" },
  { id: "S-005", name: "Abdominal Ultrasound", price: 25000, category: "Ultrasound" },
];

export function SendInvoiceModal({ open, onOpenChange, patient, onSendInvoice }: SendInvoiceModalProps) {
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [serviceSearch, setServiceSearch] = useState("");

  const toggleService = (service: any) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(s =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [serviceSearch]);

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const handleSend = () => {
    onSendInvoice({
      patientId: patient.id,
      patientName: patient.name,
      services: selectedServices,
      total: calculateTotal(),
      date: new Date().toISOString()
    });
    onOpenChange(false);
    setSelectedServices([]);
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Send New Invoice</DialogTitle>
          <DialogDescription>
            Generate and send a radiology service invoice to the patient.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6">
          {/* Patient Header - Keep it fairly static but inside the flex-1 to allow it to be part of the layout */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border mb-6 shrink-0">
            <Avatar className="h-10 w-10 border border-muted shadow-sm">
              <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
              <AvatarFallback className={cn("text-base font-semibold", getAvatarBg(patient.name))}>
                {getAvatarInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">{patient.name}</p>
              <p className="text-sm text-muted-foreground font-mono">{patient.id}</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-background capitalize">
              {patient.status}
            </Badge>
          </div>

          {/* Service Selection Search */}
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services by name or category..."
              className="pl-9"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
          </div>

          {/* Scrollable Service List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 px-1 pb-4">
            <div className="flex items-center justify-between sticky top-0 bg-background py-2">
              <h4 className="font-medium text-sm tracking-light text-muted-foreground">Select Services</h4>
              <Badge variant="warning" className="font-mono">
                {selectedServices.length} selected
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                    selectedServices.find(s => s.id === service.id)
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                      selectedServices.find(s => s.id === service.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.category}</p>
                    </div>
                  </div>
                  <p className="font-semibold font-mono">₦{service.price.toLocaleString()}</p>
                </div>
              ))}
              {filteredServices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No services found matching "{serviceSearch}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Static Total Section & Footer */}
        <div className="p-6 pt-2 border-t bg-muted/5 shrink-0">
          <div className="space-y-4">
            <div className="flex justify-between items-center pt-4">
              <span className="text-base font-semibold">Total Amount</span>
              <span className="text-base font-bold text-primary font-mono select-none">₦{calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={selectedServices.length === 0}
              className="gap-2 min-w-[140px]"
            >
              <Send className="h-4 w-4" />
              Send Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}