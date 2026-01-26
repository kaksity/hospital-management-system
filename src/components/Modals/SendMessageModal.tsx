/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, MessageSquare, MessageCircle, Send, Search, Smartphone, BadgeCheck, X, ChevronDown, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { RichEditor } from "@/components/ui/rich-editor";
import { patients } from "@/data/patients";

interface SendMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: any;
  onSendMessage: (messageData: any) => void;
}

const WHATSAPP_TEMPLATES = [
  {
    id: "wt-1",
    name: "Appointment Reminder",
    content: "Hello {{name}}, this is a reminder for your radiology appointment scheduled for {{date}} at {{time}}. Please arrive 15 minutes early."
  },
  {
    id: "wt-2",
    name: "Results Ready",
    content: "Dear {{name}}, your radiology results (ID: {{id}}) are now ready. You can view them in the portal or visit our facility during working hours."
  },
  {
    id: "wt-3",
    name: "Registration Welcome",
    content: "Welcome to CarePak, {{name}}! Your patient account has been successfully created. Your Patient ID is {{id}}. Thank you for choosing us."
  }
];

export function SendMessageModal({ open, onOpenChange, patient: initialPatient, onSendMessage }: SendMessageModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isPatientPopoverOpen, setIsPatientPopoverOpen] = useState(false);
  const [means, setMeans] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [templateId, setTemplateId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    if (initialPatient) {
      setSelectedPatient(initialPatient);
    } else {
      setSelectedPatient(null);
    }
  }, [initialPatient, open]);

  useEffect(() => {
    if (selectedPatient) {
      if (means === "email") {
        setRecipient(selectedPatient.email || "");
      } else {
        setRecipient(selectedPatient.phone || "");
      }
    }
  }, [selectedPatient, means]);

  const filteredPatients = useMemo(() => {
    return patients;
  }, []);

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const template = WHATSAPP_TEMPLATES.find(t => t.id === id);
    if (template && selectedPatient) {
      let content = template.content
        .replace("{{name}}", selectedPatient.name)
        .replace("{{id}}", selectedPatient.id)
        .replace("{{date}}", "Tomorrow") // Mock date
        .replace("{{time}}", "10:00 AM"); // Mock time
      setMessage(content);
    }
  };

  const handleSend = () => {
    if (!selectedPatient) return;

    onSendMessage({
      patientId: selectedPatient.id,
      means,
      recipient,
      subject: means === "email" ? subject : undefined,
      message,
      templateId: means === "whatsapp" ? templateId : undefined,
      timestamp: new Date().toISOString()
    });
    onOpenChange(false);
    // Reset state
    setTemplateId("");
    setMessage("");
    setSubject("");
    if (!initialPatient) setSelectedPatient(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (!v && !initialPatient) {
        setSelectedPatient(null);
      }
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{initialPatient ? "Send Message" : "New Communication"}</DialogTitle>
          <DialogDescription>
            Communicate with the patient via WhatsApp, SMS, or Email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-6">
          {/* Patient Selector or Header */}
          {!selectedPatient ? (
            <div className="space-y-1">
              <Label>Select Patient</Label>
              <Popover open={isPatientPopoverOpen} onOpenChange={setIsPatientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPatientPopoverOpen}
                    className="w-full justify-between h-11 px-4 bg-muted/20 border hover:bg-muted/30 text-slate-500 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <span>Search by name or Patient ID...</span>
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command className="w-full">
                    <CommandInput placeholder="Search patient..." className="h-10" />
                    <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      <CommandEmpty>No patient records found.</CommandEmpty>
                      <CommandGroup heading="Verified Patient Records">
                        {filteredPatients.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={`${p.name} ${p.id}`}
                            onSelect={() => {
                              setSelectedPatient(p);
                              setIsPatientPopoverOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="h-8 w-8 border shrink-0">
                              <AvatarImage src={getPatientAvatarPath(p.id, p.gender)} />
                              <AvatarFallback className={cn("text-[10px] font-bold", getAvatarBg(p.name))}>
                                {getAvatarInitials(p.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{p.name}</p>
                              <p className="text-[10px] font-mono font-semibold text-slate-500 uppercase">{p.id}</p>
                            </div>
                            <Badge variant="outline" className="text-[9px] font-bold uppercase shrink-0">{p.patientType}</Badge>
                            {selectedPatient?.id === p.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border shrink-0 relative group">
              <Avatar className="h-10 w-10 border border-muted shadow-sm">
                <AvatarImage src={getPatientAvatarPath(selectedPatient.id, selectedPatient.gender)} alt={selectedPatient.name} />
                <AvatarFallback className={cn("text-base font-semibold", getAvatarBg(selectedPatient.name))}>
                  {getAvatarInitials(selectedPatient.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-base truncate">{selectedPatient.name}</p>
                  <span className="font-mono bg-slate-100 text-[11px] px-1 rounded border">{selectedPatient.id}</span>
                  <Badge className={cn("px-1.5 py-0 h-4 text-[11px] font-semibold capitalize", selectedPatient.patientType === 'hmo' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>
                    {selectedPatient.patientType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                  <span>{selectedPatient.phone}</span>
                  <span>•</span>
                  <span className="truncate font-semibold">{selectedPatient.email}</span>
                </div>
              </div>
              {!initialPatient && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white text-muted-foreground"
                  onClick={() => {
                    setSelectedPatient(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {selectedPatient && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-6">
              {/* Communication Means Selection */}
              <div className="space-y-1">
                <Label>Select Communication Channel</Label>
                <RadioGroup
                  value={means}
                  onValueChange={(v: any) => setMeans(v)}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="whatsapp" id="whatsapp" className="peer sr-only" />
                    <Label
                      htmlFor="whatsapp"
                      className="flex flex-col items-center justify-between rounded-xl border border-input/50 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#006bff] peer-data-[state=checked]:bg-[#006bff]/[0.02] cursor-pointer transition-all"
                    >
                      <MessageCircle className="mb-2 h-6 w-6 text-green-500" />
                      <span className="text-[13px] font-semibold uppercase tracking-wider">WhatsApp</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="sms" id="sms" className="peer sr-only" />
                    <Label
                      htmlFor="sms"
                      className="flex flex-col items-center justify-between rounded-xl border border-input/50 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#006bff] peer-data-[state=checked]:bg-[#006bff]/[0.02] cursor-pointer transition-all"
                    >
                      <Smartphone className="mb-2 h-6 w-6 text-blue-500" />
                      <span className="text-[13px] font-semibold uppercase tracking-wider">SMS</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="email" id="email" className="peer sr-only" />
                    <Label
                      htmlFor="email"
                      className="flex flex-col items-center justify-between rounded-xl border border-input/50 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#006bff] peer-data-[state=checked]:bg-[#006bff]/[0.02] cursor-pointer transition-all"
                    >
                      <Mail className="mb-2 h-6 w-6 text-orange-500" />
                      <span className="text-[13px] font-semibold uppercase tracking-wider">Email</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                {/* Recipient Display */}
                <div className="space-y-2">
                  <Label htmlFor="recipient">
                    {means === "email" ? "Email Address" : "Phone Number"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      value={recipient}
                      readOnly={!!selectedPatient}
                      className="bg-muted/30 font-semibold text-slate-700"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border">
                      <BadgeCheck className="h-3 w-3 text-emerald-500" />
                      Linked
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground px-1">
                    Contact information is automatically retrieved from the verified patient record.
                  </p>
                </div>

                {/* WhatsApp Specific: Template Selection */}
                {means === "whatsapp" && (
                  <div className="space-y-1">
                    <Label>WhatsApp Template</Label>
                    <Select value={templateId} onValueChange={handleTemplateChange}>
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {WHATSAPP_TEMPLATES.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="flex items-center gap-2 font-medium">
                              <BadgeCheck className="h-4 w-4 text-blue-500" />
                              {t.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground px-1 uppercase tracking-widest font-bold">
                      WhatsApp messages must use verified templates.
                    </p>
                  </div>
                )}

                {/* Email Specific: Subject */}
                {means === "email" && (
                  <div className="space-y-1">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject"
                      className="h-11 font-medium"
                    />
                  </div>
                )}

                {/* Message Body */}
                <div className="space-y-1">
                  <Label>Message Content</Label>
                  {means === "email" ? (
                    <RichEditor
                      content={message}
                      onChange={setMessage}
                    />
                  ) : (
                    <div className="space-y-1">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={6}
                        className={cn(
                          "resize-none custom-scrollbar font-medium",
                          means === "whatsapp" && "bg-muted/20"
                        )}
                        readOnly={means === "whatsapp" && !!templateId}
                      />
                      {means === "whatsapp" && templateId && (
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                          Note: Variable injection completed. Manual edits disabled for template integrity.
                        </p>
                      )}
                      {means === "sms" && (
                        <div className="flex justify-between px-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            Chars: {message.length}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            SMS Segments: {Math.ceil(message.length / 160)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t bg-muted/5 shrink-0">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!selectedPatient || !message || (means === "email" && !subject)}
            >
              {selectedPatient ? (
                <>
                  <Send className="h-4 w-4" />
                  Dispatch {means.charAt(0).toUpperCase() + means.slice(1)}
                </>
              ) : (
                "Select a patient to continue"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
