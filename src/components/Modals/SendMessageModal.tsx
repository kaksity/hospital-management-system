/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, MessageSquare, MessageCircle, Send, User, Smartphone, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { RichEditor } from "@/components/ui/rich-editor";

interface SendMessageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient: any;
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

export function SendMessageModal({ open, onOpenChange, patient, onSendMessage }: SendMessageModalProps) {
    const [means, setMeans] = useState<"whatsapp" | "sms" | "email">("whatsapp");
    const [templateId, setTemplateId] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [recipient, setRecipient] = useState("");

    useEffect(() => {
        if (patient) {
            if (means === "email") {
                setRecipient(patient.email || "");
            } else {
                setRecipient(patient.phone || "");
            }
        }
    }, [patient, means, open]);

    const handleTemplateChange = (id: string) => {
        setTemplateId(id);
        const template = WHATSAPP_TEMPLATES.find(t => t.id === id);
        if (template && patient) {
            let content = template.content
                .replace("{{name}}", patient.name)
                .replace("{{id}}", patient.id)
                .replace("{{date}}", "Tomorrow") // Mock date
                .replace("{{time}}", "10:00 AM"); // Mock time
            setMessage(content);
        }
    };

    const handleSend = () => {
        onSendMessage({
            patientId: patient.id,
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
    };

    if (!patient) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>
                        Communicate with the patient via WhatsApp, SMS, or Email.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-6">
                    {/* Patient Header */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border shrink-0">
                        <Avatar className="h-10 w-10 border border-muted shadow-sm">
                            <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                            <AvatarFallback className={cn("text-base font-semibold", getAvatarBg(patient.name))}>
                                {getAvatarInitials(patient.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold text-base">{patient.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-mono">{patient.id}</span>
                                <span>•</span>
                                <span>{patient.phone}</span>
                                <span>•</span>
                                <span>{patient.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Communication Means Selection */}
                    <div className="space-y-3">
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
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <MessageCircle className="mb-2 h-6 w-6 text-green-500" />
                                    <span className="text-sm font-medium">WhatsApp</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="sms" id="sms" className="peer sr-only" />
                                <Label
                                    htmlFor="sms"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <Smartphone className="mb-2 h-6 w-6 text-blue-500" />
                                    <span className="text-sm font-medium">SMS</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="email" id="email" className="peer sr-only" />
                                <Label
                                    htmlFor="email"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <Mail className="mb-2 h-6 w-6 text-orange-500" />
                                    <span className="text-sm font-medium">Email</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4 animate-in fade-in duration-300">
                        {/* Recipient Display */}
                        <div className="space-y-2">
                            <Label htmlFor="recipient">
                                {means === "email" ? "Email Address" : "Phone Number"}
                            </Label>
                            <Input
                                id="recipient"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder={means === "email" ? "patient@example.com" : "+234..."}
                                className="bg-muted/30"
                            />
                        </div>

                        {/* WhatsApp Specific: Template Selection */}
                        {means === "whatsapp" && (
                            <div className="space-y-2">
                                <Label>WhatsApp Template</Label>
                                <Select value={templateId} onValueChange={handleTemplateChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WHATSAPP_TEMPLATES.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                <div className="flex items-center gap-2">
                                                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                                                    {t.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground px-1 uppercase tracking-wider font-medium font-mono">
                                    WhatsApp messages must use verified templates.
                                </p>
                            </div>
                        )}

                        {/* Email Specific: Subject */}
                        {means === "email" && (
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter email subject"
                                />
                            </div>
                        )}

                        {/* Message Body */}
                        <div className="space-y-2 pb-6">
                            <Label>Message Content</Label>
                            {means === "email" ? (
                                <RichEditor
                                    content={message}
                                    onChange={setMessage}
                                />
                            ) : (
                                <div className="space-y-2">
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        rows={8}
                                        className={cn(
                                            "resize-none custom-scrollbar",
                                            means === "whatsapp" && "bg-muted/20"
                                        )}
                                        readOnly={means === "whatsapp" && !!templateId}
                                    />
                                    {means === "whatsapp" && templateId && (
                                        <p className="text-xs text-primary font-medium">
                                            Note: You are using a verified template. Manual edits may cause delivery failure.
                                        </p>
                                    )}
                                    {means === "sms" && (
                                        <div className="flex justify-between px-1">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                Characters: {message.length}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                Segments: {Math.ceil(message.length / 160)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-4 border-t bg-muted/5 shrink-0">
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={!message || (means === "email" && !subject)}
                            className="gap-2 min-w-[150px]"
                        >
                            <Send className="h-4 w-4" />
                            Send {means.charAt(0).toUpperCase() + means.slice(1)}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
