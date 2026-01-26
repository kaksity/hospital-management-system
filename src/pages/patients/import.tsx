"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Database,
  ArrowRight,
  ShieldCheck,
  Search,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Expected system fields for mapping
const SYSTEM_FIELDS = [
  { id: "patientType", label: "Patient Type", required: true },
  { id: "firstName", label: "First Name", required: true },
  { id: "lastName", label: "Last Name", required: true },
  { id: "email", label: "Email Address", required: true },
  { id: "phone", label: "Phone Number", required: false },
  { id: "gender", label: "Gender", required: false },
  { id: "maritalStatus", label: "Marital Status", required: false },
  { id: "dob", label: "Date of Birth", required: false },
  { id: "address", label: "Home Address", required: false },
  { id: "nationality", label: "Nationality", required: false }
];

type Step = "upload" | "map" | "preview";

export default function ImportPatients() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Step 1: Upload ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false
  });

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").filter(row => row.trim() !== "");
      const headers = rows[0].split(",").map(h => h.trim());
      const data = rows.slice(1).map(row => {
        const values = row.split(",").map(v => v.trim());
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {} as any);
      });
      setHeaders(headers);
      setCsvData(data);

      // Auto-mapping attempt
      const newMapping: Record<string, string> = {};
      SYSTEM_FIELDS.forEach(field => {
        const match = headers.find(h =>
          h.toLowerCase().includes(field.label.toLowerCase()) ||
          h.toLowerCase().includes(field.id.toLowerCase())
        );
        if (match) newMapping[field.id] = match;
      });
      setMapping(newMapping);

      setCurrentStep("map");
      toast.success("File parsed successfully");
    };
    reader.readAsText(file);
  };

  // --- Step 2: Mapping ---
  const handleMappingChange = (systemFieldId: string, csvHeader: string) => {
    setMapping(prev => ({ ...prev, [systemFieldId]: csvHeader }));
  };

  const isMappingValid = SYSTEM_FIELDS.filter(f => f.required).every(f => mapping[f.id]);

  // --- Step 3: Preview ---
  const getPreviewData = () => {
    return csvData.slice(0, 5).map(row => {
      const mappedRow: any = {};
      SYSTEM_FIELDS.forEach(field => {
        mappedRow[field.id] = row[mapping[field.id]] || "";
      });
      return mappedRow;
    });
  };

  const handleImport = () => {
    setIsProcessing(true);
    // Simulate API processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Successfully imported ${csvData.length} patients`);
      navigate("/patients");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-light">Import Patients</h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Clean, transmute, and import patient records from CSV.</p>
        </div>
        <div className="flex items-center gap-2">
          {currentStep !== "upload" && (
            <Button variant="ghost" onClick={() => setCurrentStep("upload")} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Start Over
            </Button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: "upload", label: "1. Upload CSV", icon: Upload },
          { id: "map", label: "2. Map Columns", icon: Database },
          { id: "preview", label: "3. Review & Import", icon: ShieldCheck }
        ].map((step, idx) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border transition-all",
              currentStep === step.id
                ? "bg-primary/5 border-primary text-primary shadow-sm"
                : idx < ["upload", "map", "preview"].indexOf(currentStep)
                  ? "bg-muted/50 border-muted text-muted-foreground"
                  : "bg-background border-border text-muted-foreground opacity-50"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <step.icon className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <Card className="border-none bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          {currentStep === "upload" && (
            <div
              {...getRootProps()}
              className={cn(
                "p-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer",
                isDragActive ? "border-primary bg-primary/5" : "border-input/50 hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <input {...getInputProps()} />
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Upload className="h-8 w-8 text-primary animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drop your CSV file here</h3>
              <p className="text-muted-foreground text-[15px] text-center max-w-sm mb-6">
                Upload your existing patient database. We'll help you map the columns to our system.
              </p>
              <Button className="px-8">Select File</Button>
              <p className="mt-4 text-xs text-muted-foreground">Supported format: .CSV (Max 10MB)</p>
            </div>
          )}

          {currentStep === "map" && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">Column Mapping</h3>
                  <p className="text-sm text-muted-foreground">Match your CSV headers to the system patient fields.</p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {headers.length} Columns Found
                </Badge>
              </div>

              <div className="grid gap-4">
                {SYSTEM_FIELDS.map(field => (
                  <div key={field.id} className="flex items-center justify-between p-4 rounded-xl border bg-background/50 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        mapping[field.id] ? "bg-green-500" : field.required ? "bg-red-500" : "bg-muted"
                      )} />
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {field.label}
                          {field.required && <span className="text-red-500 text-xs font-normal">(Required)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={mapping[field.id] || ""}
                        onValueChange={(v) => handleMappingChange(field.id, v)}
                      >
                        <SelectTrigger className="w-[240px] border-none bg-muted/50 focus:ring-1">
                          <SelectValue placeholder="Select CSV Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none_selection">-- Do not map --</SelectItem>
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t gap-3">
                <Button variant="outline" onClick={() => setCurrentStep("upload")}>Back</Button>
                <Button
                  disabled={!isMappingValid}
                  onClick={() => setCurrentStep("preview")}
                  className="gap-2"
                >
                  Confirm Mapping <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "preview" && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Final Review</h3>
                  <p className="text-sm text-muted-foreground">Review a sample of how your data will be imported.</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Check className="h-4 w-4" /> {csvData.length} records ready
                  </div>
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {SYSTEM_FIELDS.filter(f => mapping[f.id]).map(field => (
                        <TableHead key={field.id} className="text-xs uppercase tracking-wider">{field.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPreviewData().map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                        {SYSTEM_FIELDS.filter(f => mapping[f.id]).map(field => (
                          <TableCell key={field.id} className="text-sm py-4">{row[field.id]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Important Note</p>
                  <p>Existing patients with matching email addresses will be skipped to avoid duplicates. Please ensure your CSV data is accurate before finalizing.</p>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Processing import...</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              )}

              <div className="flex justify-end pt-6 border-t gap-3">
                <Button variant="outline" onClick={() => setCurrentStep("map")} disabled={isProcessing}>Back to Mapping</Button>
                <Button
                  onClick={handleImport}
                  className="gap-2 min-w-[160px]"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : <>Finalize Import <Check className="h-4 w-4" /></>}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helper Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Data Transmutation</p>
            <p className="text-xs text-muted-foreground">Column headers don't have to match exactly. Map them manually.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
          <Search className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Validation Check</p>
            <p className="text-xs text-muted-foreground">Required fields are validated. Missing fields will be flagged.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Formatting Guide</p>
            <p className="text-xs text-muted-foreground">Ensure dates are YYYY-MM-DD for best results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
