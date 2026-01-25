"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  Mic,
  FileText,
  Check,
  Volume2,
  Square,
  Pause,
  MicOff,
  Edit,
  Send,
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
import { formatDateOnly } from "@/utils/dateFormatter";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { toast } from "sonner";
import { pdfService } from "@/services/pdfService";
import { EmailPreviewModal } from "@/components/diagnostic-reports/EmailPreviewModal";

// Mock Pre-filled Request Data (Simulating creating a report for a pending request)
const mockPendingRequest = {
  requestNo: "REQ-90210",
  requestDate: "2024-11-15",
  patientName: "John Adebayo",
  patientType: "hmo",
  gender: "Male",
  email: "john.adebayo@email.com",
  hospital: "Evercare Hospital",
  physician: "Dr. Ope Adeyemi",
  dispatchStatus: "pending",
  totalCost: 150000,
  amountPaid: 150000,
  balance: 0,
  examType: "MRI",
  examName: "MRI Brain (Contrast)",
};

const templates = [
  {
    id: "t1",
    name: "Normal MRI Brain",
    content: `
      <h3><strong>MRI BRAIN WITH AND WITHOUT CONTRAST</strong></h3>
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
      <h3><strong>MRI BRAIN WITH DIFFUSION</strong></h3>
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
  {
    id: "t3",
    name: "Glioblastoma Follow-up",
    content: `
      <h3><strong>MRI BRAIN WITH AND WITHOUT CONTRAST</strong></h3>
      <p><strong>CLINICAL INDICATION:</strong> 45-year-old female with history of right frontal glioblastoma, status post resection and chemoradiation 3 months ago. Follow-up surveillance.</p>
      <p><strong>TECHNIQUE:</strong> Multiplanar MRI brain with and without contrast, including perfusion and spectroscopy sequences.</p>
      <p><strong>COMPARISON:</strong> MRI brain dated 3 months ago.</p>
      <p><strong>FINDINGS:</strong></p>
      <ul>
        <li>Postsurgical changes in the right frontal lobe are stable. The resection cavity measures 3.2 x 2.8 cm, unchanged from prior.</li>
        <li>There is a new 8 mm nodular area of enhancement along the anterior margin of the resection cavity. This was not present on the prior study.</li>
        <li>The new enhancing nodule shows elevated rCBV (relative cerebral blood volume) on perfusion imaging, measuring 2.4 (normal < 1.5).</li>
        <li>MR spectroscopy demonstrates elevated choline/NAA ratio of 3.2 in the region of the new enhancement.</li>
        <li>No significant vasogenic edema in the surrounding white matter.</li>
        <li>No new areas of restricted diffusion to suggest acute infarction.</li>
        <li>The remainder of the brain parenchyma is unremarkable.</li>
        <li>The ventricular system is normal in size and configuration.</li>
      </ul>
      <p><strong>IMPRESSION:</strong></p>
      <p><strong>1. New nodular enhancement along the anterior margin of the right frontal resection cavity, with elevated rCBV and abnormal MR spectroscopy, suspicious for recurrent/progressive disease.</strong></p>
      <p><strong>2. Otherwise stable post-surgical changes.</strong></p>
      <p><strong>RECOMMENDATION:</strong></p>
      <ol>
        <li>Recommend multidisciplinary tumor board review.</li>
        <li>Consider PET-MRI for further metabolic characterization.</li>
        <li>Follow-up MRI in 6-8 weeks to assess progression if no immediate intervention planned.</li>
      </ol>
    `
  },
  {
    id: "t4",
    name: "Traumatic Brain Injury",
    content: `
      <h3><strong>CT BRAIN WITHOUT CONTRAST</strong></h3>
      <p><strong>CLINICAL INDICATION:</strong> 32-year-old male, motorcycle accident, loss of consciousness at scene, GCS 13 on arrival.</p>
      <p><strong>TECHNIQUE:</strong> Non-contrast CT brain with axial 5 mm sections.</p>
      <p><strong>COMPARISON:</strong> None.</p>
      <p><strong>FINDINGS:</strong></p>
      <ul>
        <li>There is a 15 mm x 8 mm acute hyperdense extra-axial collection in the right frontal region consistent with an acute epidural hematoma.</li>
        <li>Midline shift of 5 mm to the left is noted.</li>
        <li>Associated effacement of the right lateral ventricle.</li>
        <li>Small foci of petechial hemorrhage in the right temporal lobe consistent with contusions.</li>
        <li>No evidence of skull fracture on bone windows.</li>
        <li>No intraventricular hemorrhage.</li>
        <li>The basal cisterns are patent.</li>
      </ul>
      <p><strong>IMPRESSION:</strong></p>
      <p><strong>1. Acute right frontal epidural hematoma with 5 mm midline shift.</strong></p>
      <p><strong>2. Right temporal lobe contusions.</strong></p>
      <p><strong>RECOMMENDATION:</strong></p>
      <ol>
        <li>Urgent Neurosurgery consultation.</li>
        <li>Consider stat repeat CT if neurological deterioration.</li>
        <li>Admit to Neuro-ICU for close monitoring.</li>
      </ol>
    `
  }
];

export default function CreateDiagnosticReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const taskData = location.state?.task;

  // Map task data if available, otherwise use mock
  const initialData = useMemo(() => {
    if (taskData) {
      return {
        requestNo: taskData.id,
        requestDate: taskData.date || "2024-11-20",
        patientName: taskData.patient,
        patientType: taskData.patientType,
        gender: taskData.gender || "Male",
        email: taskData.email || "patient@example.com",
        hospital: taskData.hospital || "Evercare Hospital",
        physician: taskData.referringDoctor || "N/A",
        dispatchStatus: "pending",
        totalCost: 150000,
        amountPaid: 150000,
        balance: 0,
        examType: taskData.service,
        examName: taskData.subService,
      };
    }
    return mockPendingRequest;
  }, [taskData]);

  const [reportData] = useState(initialData);
  const [editorContent, setEditorContent] = useState("<p>Start typing your report here...</p>");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMode, setActiveMode] = useState<'template' | 'manual'>('manual');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [pdfBase64, setPdfBase64] = useState("");

  const {
    isListening,
    isPaused,
    isTranscribing,
    transcript,
    recordingTime,
    audioLevel,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    clearTranscript,
    clearError,
  } = useSpeechRecognition({
    language: 'en-US',
    medicalContext: true,
    onResult: (newTranscript) => {
      setLivePreview(newTranscript);
    },
    onEnd: (finalTranscript) => {
      const processedText = finalTranscript.trim();
      if (processedText) {
        setEditorContent(prev => {
          const base = prev === "<p>Start typing your report here...</p>" ? "" : prev;
          if (base.endsWith('</p>')) {
            return base.replace(/<\/p>$/, ` ${processedText}</p>`);
          }
          return `${base}<p>${processedText}</p>`;
        });
        toast.success("Transcription complete", {
          description: "Advanced AI has processed your audio for maximum accuracy.",
        });
      }
    },
  });

  const [livePreview, setLivePreview] = useState("");

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsBrowserSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    if (!isBrowserSupported) {
      toast.warning("Audio recording not supported", {
        description: "Please use Chrome or Edge for record and transcribe features.",
        duration: 8000,
      });
    }
  }, [isBrowserSupported]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setActiveMode('template');
      setEditorContent(template.content);
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

  const handleCreate = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Report created successfully");
      navigate("/diagnostic-reports");
    }, 1500);
  };

  const handleCreateAndSend = async () => {
    try {
      setIsSubmitting(true);
      toast.info("Saving and preparing report...");

      // 1. Simulate saving (In a real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Generate PDF for the preview
      const base64 = await pdfService.generateFromElement('report-pdf-content', {
        filename: `Report_${reportData.requestNo}.pdf`
      });

      setPdfBase64(base64);
      setIsPreviewModalOpen(true);
    } catch (error: any) {
      toast.error("Failed to prepare report", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-800">
              New Diagnostic Report
            </h1>
            <Badge className="bg-slate-100 text-slate-600 border-slate-200">
              Draft
            </Badge>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Request ID: {reportData.requestNo}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white" onClick={() => navigate("/diagnostic-reports")}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateAndSend}
            disabled={isSubmitting}
            variant="outline"
            className="gap-2 border-primary text-primary hover:bg-primary/5"
          >
            {isSubmitting ? "Processing..." : (
              <>
                <Send className="h-4 w-4" />
                Save & Send Email
              </>
            )}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : (
              <>
                <Check className="h-4 w-4" />
                Create Report
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
                  className="h-8 gap-2 font-semibold"
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
                <div className="space-y-1">
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
                    <div className="flex items-center gap-3">
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
                <RichEditor
                  content={editorContent}
                  onChange={setEditorContent}
                  className="flex-1 min-h-[300px] !p-4"
                />
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
                  <span className="text-[13px] font-semibold text-slate-800">Pending</span>
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
                  <Badge className="text-[10px] bg-slate-50 text-slate-500 border-slate-200">
                    Pending
                  </Badge>
                </div>
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
        onClose={() => {
          setIsPreviewModalOpen(false);
          navigate("/diagnostic-reports");
        }}
        reportData={{
          ...reportData,
          reportNo: reportData.requestNo, // Use requestNo as placeholder for new report
          reportContent: editorContent
        }}
        pdfBase64={pdfBase64}
      />
    </div>
  );
}
