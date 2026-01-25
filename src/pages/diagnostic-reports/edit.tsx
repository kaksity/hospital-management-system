"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Clock,
    AlertCircle,
    Mic,
    MicOff,
    Pause,
    Square,
    FileText,
    Save,
    Printer,
    Send,
    Volume2,
    Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RichEditor } from "@/components/ui/rich-editor";
import { cn } from "@/lib/utils";
import { formatDateOnly, formatDateTime } from "@/utils/dateFormatter";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { toast } from "sonner";
import { pdfService } from "@/services/pdfService";
import { EmailPreviewModal } from "@/components/diagnostic-reports/EmailPreviewModal";

// Mock Report Data (In a real app, this would be fetched based on ID)
const mockReport = {
    id: "RAD-2024-5401",
    requestNo: "REQ-90210",
    requestDate: "2024-11-15",
    reportNo: "RAD-2024-5401",
    reportId: "REP-001",
    patientName: "John Adebayo",
    patientType: "hmo",
    gender: "Male",
    email: "john.adebayo@email.com",
    hospital: "Evercare Hospital",
    physician: "Dr. Ope Adeyemi",
    dispatchStatus: "sent_to_hospital",
    dispatchedDate: "2024-11-21 14:30",
    dispatchedBy: "Sarah Johnson",
    totalCost: 150000,
    amountPaid: 150000,
    balance: 0,
    status: "approved",
    examType: "MRI",
    examName: "MRI Brain (Contrast)",
};

const templates = [
    {
        id: "t1",
        name: "Normal MRI Brain",
        content: `
      <p><strong>MRI BRAIN WITH AND WITHOUT CONTRAST</strong></p>
      <p><strong>CLINICAL INDICATION:</strong> Headache and dizziness.</p>
      <p><strong>TECHNIQUE:</strong> Multiplanar, multisequence MRI of the brain was performed on a 3 Tesla scanner. Pre- and post-contrast sequences were obtained including T1, T2, FLAIR, DWI, and ADC.</p>
      <p><strong>COMPARISON:</strong> None.</p>
      <p><strong>FINDINGS:</strong></p>
      <ul>
        <li>The brain parenchyma demonstrates normal signal intensity. There is normal gray-white matter differentiation.</li>
        <li>No evidence of acute infarct, hemorrhage, or mass lesion is identified.</li>
        <li>The ventricular system and subarachnoid spaces are within normal limits. No midline shift.</li>
        <li>The basal ganglia, thalamus, brainstem, and cerebellum appear unremarkable.</li>
        <li>No abnormal enhancement is noted following administration of gadolinium-based contrast.</li>
        <li>The visualized portions of the skull base and calvarium are intact.</li>
        <li>The major intracranial vessels show normal flow voids.</li>
      </ul>
      <p><strong>IMPRESSION:</strong></p>
      <p><strong>1. Normal MRI of the brain.</strong></p>
      <p><strong>RECOMMENDATION:</strong> None.</p>
    `
    },
    {
        id: "t2",
        name: "Acute Ischemic Stroke",
        content: `
      <p><strong>MRI BRAIN WITH DIFFUSION</strong></p>
      <p><strong>CLINICAL INDICATION:</strong> 68-year-old male with acute onset left-sided weakness and facial droop, presenting 4 hours after symptom onset.</p>
      <p><strong>TECHNIQUE:</strong> MRI brain with DWI/ADC sequences, T2, FLAIR, and MRA.</p>
      <p><strong>COMPARISON:</strong> CT head from today shows subtle early ischemic changes.</p>
      <p><strong>FINDINGS:</strong></p>
      <ul>
        <li>There is restricted diffusion involving the right middle cerebral artery (MCA) territory, involving the right basal ganglia, insular cortex, and frontal operculum.</li>
        <li>The ADC map confirms true restricted diffusion with corresponding low ADC values.</li>
        <li>MRA demonstrates an occlusion of the proximal right M1 segment of the MCA.</li>
        <li>There is mild sulcal effacement in the right hemisphere but no significant midline shift.</li>
        <li>The remainder of the brain parenchyma shows age-appropriate volume loss without acute abnormality.</li>
        <li>No intracranial hemorrhage is identified on susceptibility-weighted imaging (SWI).</li>
        <li>The posterior circulation territories are patent and unremarkable.</li>
      </ul>
      <p><strong>IMPRESSION:</strong></p>
      <p><strong>1. Acute right MCA territory infarction, consistent with the patient's clinical presentation.</strong></p>
      <p><strong>2. Right M1 segment MCA occlusion.</strong></p>
      <p><strong>RECOMMENDATION:</strong></p>
      <ol>
        <li>Urgent Neurology consultation for consideration of thrombolysis/thrombectomy.</li>
        <li>Consider stat CT perfusion if thrombectomy is being considered.</li>
        <li>Follow-up imaging in 24-48 hours to evaluate for hemorrhagic transformation.</li>
      </ol>
    `
    },
];

export default function EditDiagnosticReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(mockReport);
    const [editorContent, setEditorContent] = useState(`
    <p><strong>MRI BRAIN WITH AND WITHOUT CONTRAST</strong></p>
    <p><strong>CLINICAL INDICATION:</strong> ${reportData.patientName} presents with persistent headaches and dizziness for evaluation.</p>
    <p><strong>TECHNIQUE:</strong> Multiplanar, multisequence MRI of the brain was performed with pre- and post-contrast administration.</p>
    <p><strong>COMPARISON:</strong> None available.</p>
    <p><strong>FINDINGS:</strong></p>
    <ul>
      <li>The cerebral hemispheres are symmetric with preserved gray-white matter differentiation.</li>
      <li>No mass lesion, hemorrhage, or acute territorial infarction is identified.</li>
      <li>The ventricular system and subarachnoid spaces are within normal limits for patient's age.</li>
      <li>The brainstem and cerebellum appear unremarkable.</li>
      <li>No abnormal parenchymal or meningeal enhancement following contrast administration.</li>
    </ul>
    <p><strong>IMPRESSION:</strong></p>
    <p><strong>1. Normal MRI brain examination.</strong></p>
    <p><strong>RECOMMENDATION:</strong> Clinical correlation recommended.</p>
  `);
    const [activeMode, setActiveMode] = useState<'template' | 'manual'>('manual');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [isBrowserSupported, setIsBrowserSupported] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [pdfBase64, setPdfBase64] = useState("");

    const {
        isListening,
        isPaused,
        isTranscribing,
        transcript,
        recordingTime,
        audioLevel,
        startRecording,
        stopRecording,
        pauseRecording,
        clearTranscript,
    } = useSpeechRecognition({
        onResult: (newTranscript) => {
            setLivePreview(newTranscript);
        },
        onEnd: (finalTranscript) => {
            const processedText = finalTranscript.trim();
            if (processedText) {
                setEditorContent(prev => {
                    if (prev.endsWith('</p>')) {
                        return prev.replace(/<\/p>$/, ` ${processedText}</p>`);
                    }
                    return `${prev}<p>${processedText}</p>`;
                });
                toast.success("Advanced transcription applied", {
                    description: "AI processing complete.",
                });
            }
        }
    });

    const [livePreview, setLivePreview] = useState("");

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setIsBrowserSupported(!!SpeechRecognition);
    }, []);

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            setActiveMode('template');
            setEditorContent(template.content);
            toast.success("Template applied", {
                description: `"${template.name}" template loaded`,
            });
        }
    };

    const handleVoiceMode = () => {
        if (isListening) {
            stopRecording();
        } else {
            setSelectedTemplate('');
            startRecording();
        }
    };

    const toggleMode = () => {
        const nextMode = activeMode === 'manual' ? 'template' : 'manual';
        setActiveMode(nextMode);
        if (isListening) stopRecording();
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Report updated successfully", {
                description: `Report ${reportData.reportNo} has been saved`,
                duration: 3000,
            });
        }, 1500);
    };

    const handlePrint = async () => {
        try {
            toast.info("Preparing PDF...");
            const base64 = await pdfService.generateFromElement('report-pdf-content', {
                filename: `Report_${reportData.reportNo}.pdf`
            });

            const blob = await fetch(`data:application/pdf;base64,${base64}`).then(r => r.blob());
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error: any) {
            toast.error("Print failed", { description: error.message });
        }
    };

    const handleSendReport = async () => {
        try {
            setIsSendingEmail(true);
            toast.info("Preparing dispatch...");

            const base64 = await pdfService.generateFromElement('report-pdf-content', {
                filename: `Report_${reportData.reportNo}.pdf`
            });

            setPdfBase64(base64);
            setIsPreviewModalOpen(true);
        } catch (error: any) {
            toast.error("Failed to prepare email", { description: error.message });
        } finally {
            setIsSendingEmail(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-light text-slate-800">
                            Diagnostic Report: {reportData.reportNo}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-100 text-green-800 capitalize">
                                {reportData.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                                Request ID: {reportData.requestNo}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2 bg-white"
                        onClick={handleSendReport}
                        disabled={isSendingEmail}
                    >
                        {isSendingEmail ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        Send
                    </Button>
                    <Button
                        className="gap-2"
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-full min-h-0">
                {/* Left Side: Form & Editor */}
                <div className="lg:col-span-2 space-y-6 h-full flex flex-col">
                    <Card className="border overflow-hidden bg-white">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-sm tracking-normal font-semibold text-[#476788]">
                                Examination Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-4 grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label>Exam Type</Label>
                                <Input value={reportData.examType} readOnly className="bg-slate-50" />
                            </div>
                            <div className="space-y-1">
                                <Label>Exam Name</Label>
                                <Input value={reportData.examName} readOnly className="bg-slate-50" />
                            </div>
                            <div className="space-y-1">
                                <Label>Exam Cost</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₦</span>
                                    <Input value={reportData.totalCost.toLocaleString()} readOnly className="pl-7 bg-slate-50 font-semibold" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card id="report-pdf-content" className="border overflow-hidden bg-white flex-1 flex flex-col">
                        <CardHeader className="border-b bg-slate-50/50 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold tracking-normal text-[#476788]">
                                Report Editor
                            </CardTitle>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleMode}
                                    className="h-8 gap-2 font-bold border-slate-200"
                                >
                                    {activeMode === 'manual' ? (
                                        <>
                                            <FileText className="h-3.5 w-3.5 text-primary" />
                                            Use Template
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-3.5 w-3.5 text-primary" />
                                            Use Manual Mode
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant={isListening ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={handleVoiceMode}
                                    disabled={!isBrowserSupported || isTranscribing}
                                    className={cn("h-8 gap-2 font-semibold", isListening && "animate-pulse")}
                                >
                                    {isListening ? (
                                        <>
                                            <Square className="h-3.5 w-3.5" />
                                            Stop Recording
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-3.5 w-3.5 text-primary" />
                                            Record Audio
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                            {/* Mode-specific controls */}
                            {activeMode === 'template' && (
                                <div className="space-y-2">
                                    <Label>Select Template</Label>
                                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose a template..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Selecting a template will replace current content
                                    </p>
                                </div>
                            )}

                            {(isListening || isTranscribing) && (
                                <div className="p-3 bg-[#fafafa] rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center",
                                                isListening
                                                    ? isPaused
                                                        ? "bg-amber-100 text-amber-600"
                                                        : "bg-red-100 text-red-600 animate-pulse"
                                                    : "bg-primary/10 text-primary"
                                            )}>
                                                {isListening ? (
                                                    isPaused ? <Pause className="h-4 w-4" /> : <Mic className="h-4 w-4" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-700 leading-none">
                                                    {isListening ? (isPaused ? "Paused" : "Recording...") : "AI Transcribing..."}
                                                </div>
                                                {isListening && (
                                                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        {recordingTime}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isListening && !isPaused && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-[2px] h-4 w-12 pt-1">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <div
                                                            key={i}
                                                            className="w-1 bg-primary rounded-full transition-all duration-150"
                                                            style={{
                                                                height: `${Math.max(15, Math.min(100, (audioLevel * (0.4 + (i * 0.15)))))}%`,
                                                                opacity: 0.3 + (audioLevel / 100)
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-primary tabular-nums">
                                                    Live
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {livePreview && isListening && (
                                        <div className="p-3 bg-[#e6f0ff] border border-[#006bff] rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Live Preview</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearTranscript}
                                                    className="h-5 text-[10px] font-bold hover:bg-[#d9e8ff] text-[#006bff] px-2"
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                            <p className="text-sm text-slate-800 leading-relaxed font-medium">
                                                {livePreview}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Editor */}
                            <div className="flex-1 flex flex-col">
                                <div className="mb-2 flex items-center justify-between">
                                    <Label>Report Content</Label>
                                    {isListening && (
                                        <Badge variant="outline" className="text-[10px] animate-pulse bg-red-50 text-red-700 border-red-200 font-bold uppercase tracking-wider">
                                            <Volume2 className="h-3 w-3 mr-1.5" />
                                            Recording Audio...
                                        </Badge>
                                    )}
                                    {isTranscribing && (
                                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-wider">
                                            <div className="h-2 w-2 rounded-full border border-primary border-t-transparent animate-spin mr-1.5" />
                                            AI Transcribing...
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex-1 min-h-[400px]">
                                    <RichEditor
                                        content={editorContent}
                                        onChange={setEditorContent}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Summary */}
                <div className="space-y-6">
                    <Card className="border overflow-hidden bg-white">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <CardTitle className="text-sm font-semibold tracking-normal text-[#476788]">
                                Patient & Request Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-4 pb-4 border-b">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-slate-500">Patient Name</span>
                                    <span className="text-[13px] font-semibold text-slate-800">{reportData.patientName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500">Gender / Type</span>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[10px] bg-slate-50">
                                            {reportData.gender}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100">
                                            {reportData.patientType.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500">Email Address</span>
                                    <span className="text-[13px] font-semibold text-slate-600">
                                        {reportData.email}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 pb-4 border-b">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-slate-500">Report No</span>
                                    <span className="text-[13px] font-semibold text-slate-800">{reportData.reportNo}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-slate-500">Request No</span>
                                    <span className="text-[13px] font-semibold text-slate-800">{reportData.requestNo}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-slate-500">Request Date</span>
                                    <span className="text-[13px] font-semibold text-slate-800">{formatDateOnly(reportData.requestDate)}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-slate-500">Clinic / Hospital</span>
                                    <span className="text-[13px] font-semibold text-slate-800">{reportData.hospital}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-slate-500">Physician</span>
                                    <span className="text-[13px] font-semibold text-slate-800">{reportData.physician}</span>
                                </div>
                            </div>

                            <div className="space-y-2 pb-4 border-b">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500">Dispatch Status</span>
                                    <Badge className="text-[10px] bg-blue-50 text-blue-700 border-blue-100">
                                        {reportData.dispatchStatus.replace(/_/g, " ")}
                                    </Badge>
                                </div>
                                {reportData.dispatchStatus !== "pending" && (
                                    <div className="mt-2 p-3 bg-slate-50 rounded-lg space-y-1">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500">Dispatched:</span>
                                            <span className="font-bold text-slate-700">{formatDateTime(reportData.dispatchedDate)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500">By:</span>
                                            <span className="font-bold text-slate-700">{reportData.dispatchedBy}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500">Total Cost</span>
                                    <span className="text-[13px] font-bold text-slate-800">₦{reportData.totalCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500">Amount Paid</span>
                                    <span className="text-[13px] font-bold text-green-600">₦{reportData.amountPaid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Balance</span>
                                    <span className="text-[13px] font-extrabold text-slate-700">₦{reportData.balance.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <EmailPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                reportData={{
                    ...reportData,
                    reportContent: editorContent // Use current editor content
                }}
                pdfBase64={pdfBase64}
            />
        </div>
    );
}