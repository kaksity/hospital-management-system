// pages/applications/new-visa.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FolderPlus, 
  Upload, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Download,
  User,
  Building,
  FileCheck,
  ArrowLeft
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { 
  getVisaSchema, 
  type VisaSchema, 
  type VisaSection,
  type VisaField,
  type VisaCriterion 
} from "@/services/visaSchemaService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatDate } from "@/utils/dateFormatter";

// Types for our enhanced state
type FormData = Record<string, any>;
type UploadedFile = {
  id: string;
  file: File;
  uploadedAt: Date;
  size: string;
};

type Folder = {
  id: string;
  name: string;
  files: UploadedFile[];
  createdAt: Date;
};

type CriterionState = {
  [criterionKey: string]: Folder[];
};

type Step = "background" | "criteria" | "review";

export default function NewApplication() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get("type");

  const [selectedVisaType, setSelectedVisaType] = useState<string | null>(preselectedType);
  const [selectedSchema, setSelectedSchema] = useState<VisaSchema | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({});
  const [step, setStep] = useState<Step>("background");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({});
  const [folders, setFolders] = useState<CriterionState>({});
  const [sectionCompletion, setSectionCompletion] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (preselectedType) {
      const schema = getVisaSchema(preselectedType);
      setSelectedSchema(schema);
      // Initialize folders structure
      if (schema) {
        const initialFolders: CriterionState = {};
        Object.keys(schema.criteria).forEach(key => {
          initialFolders[key] = [];
        });
        setFolders(initialFolders);
      }
    }
  }, [preselectedType]);

  // Progress calculation
  const calculateProgress = (): number => {
    if (!selectedSchema) return 0;

    let completedSections = 0;
    const totalSections = selectedSchema.caseBackground.sections.length + Object.keys(selectedSchema.criteria).length;

    // Check background sections
    selectedSchema.caseBackground.sections.forEach(section => {
      if (section.type === 'fields') {
        const allRequiredFilled = section.fields?.every(field => 
          !field.required || formData[field.name]
        );
        if (allRequiredFilled) completedSections++;
      } else {
        // For file upload sections, consider complete if we have the section completion
        if (sectionCompletion.has(section.title)) completedSections++;
      }
    });

    // Check criteria sections (at least one folder created)
    Object.keys(selectedSchema.criteria).forEach(criterionKey => {
      if (folders[criterionKey]?.length > 0) completedSections++;
    });

    return Math.round((completedSections / totalSections) * 100);
  };

  const handleFieldChange = (fieldName: string, value: any, sectionTitle: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Check if section is complete
    if (selectedSchema) {
      const section = selectedSchema.caseBackground.sections.find(s => s.title === sectionTitle);
      if (section?.type === 'fields') {
        const allRequiredFilled = section.fields?.every(field => 
          !field.required || (field.name === fieldName ? value : formData[field.name])
        );
        if (allRequiredFilled) {
          setSectionCompletion(prev => new Set(prev).add(sectionTitle));
        } else {
          setSectionCompletion(prev => {
            const newSet = new Set(prev);
            newSet.delete(sectionTitle);
            return newSet;
          });
        }
      }
    }
  };

  const handleCreateFolder = (criterionKey: string) => {
    const folderName = `Evidence Group ${folders[criterionKey]?.length + 1 || 1}`;
    const newFolder: Folder = {
      id: `${criterionKey}-${Date.now()}`,
      name: folderName,
      files: [],
      createdAt: new Date()
    };

    setFolders(prev => ({
      ...prev,
      [criterionKey]: [...(prev[criterionKey] || []), newFolder]
    }));
  };

  const handleRenameFolder = (criterionKey: string, folderId: string, newName: string) => {
    setFolders(prev => ({
      ...prev,
      [criterionKey]: prev[criterionKey].map(folder => 
        folder.id === folderId ? { ...folder, name: newName } : folder
      )
    }));
  };

  const handleDeleteFolder = (criterionKey: string, folderId: string) => {
    setFolders(prev => ({
      ...prev,
      [criterionKey]: prev[criterionKey].filter(folder => folder.id !== folderId)
    }));
  };

  const handleFileUpload = (criterionKey: string, folderId: string, acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${folderId}-${file.name}-${Date.now()}`,
      file,
      uploadedAt: new Date(),
      size: formatFileSize(file.size)
    }));

    setFolders(prev => ({
      ...prev,
      [criterionKey]: prev[criterionKey].map(folder => 
        folder.id === folderId 
          ? { ...folder, files: [...folder.files, ...newFiles] }
          : folder
      )
    }));
  };

  const handleRemoveFile = (criterionKey: string, folderId: string, fileId: string) => {
    setFolders(prev => ({
      ...prev,
      [criterionKey]: prev[criterionKey].map(folder => 
        folder.id === folderId 
          ? { ...folder, files: folder.files.filter(f => f.id !== fileId) }
          : folder
      )
    }));
  };

  const handleBackgroundFileUpload = (sectionTitle: string, acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${sectionTitle}-${file.name}-${Date.now()}`,
      file,
      uploadedAt: new Date(),
      size: formatFileSize(file.size)
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [sectionTitle]: [...(prev[sectionTitle] || []), ...newFiles]
    }));

    // Mark section as complete when files are uploaded
    if (acceptedFiles.length > 0) {
      setSectionCompletion(prev => new Set(prev).add(sectionTitle));
    }
  };

  const handleRemoveBackgroundFile = (sectionTitle: string, fileId: string) => {
    setUploadedFiles(prev => {
      const newFiles = (prev[sectionTitle] || []).filter(f => f.id !== fileId);
      const updated = { ...prev, [sectionTitle]: newFiles };
      
      // Unmark section as complete if no files left
      if (newFiles.length === 0) {
        setSectionCompletion(prev => {
          const newSet = new Set(prev);
          newSet.delete(sectionTitle);
          return newSet;
        });
      }
      
      return updated;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationData = {
        visaType: selectedVisaType,
        background: formData,
        folders: folders,
        createdAt: new Date().toISOString(),
        status: 'draft',
        progress: calculateProgress()
      };

      console.log('Application created:', applicationData);
      
      toast.success("Application submitted successfully!");
      
      // Navigate to APPLICATIONS page (not cases)
      navigate('/applications');
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStepIcon = (stepName: Step, currentStep: Step) => {
    if (stepName === currentStep) {
      return <Circle className="h-4 w-4 text-primary" />;
    }
    const stepOrder: Step[] = ["background", "criteria", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepName);
    
    return stepIndex < currentIndex 
      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
      : <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  if (!selectedSchema) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold mb-2">No Visa Type Selected</h2>
        <p>Please select a visa category to continue.</p>
        <Button onClick={() => navigate('/applications')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-none">
                New {selectedSchema.title} Application
              </h1>
              <p className="text-muted-foreground">
                Complete your visa application step by step
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {step === "background" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/applications')}>
              Save as Draft
            </Button>
            <Button onClick={() => setStep("criteria")} disabled={progress < 30}>
              Continue to Evidence
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        
        {step === "criteria" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStep("background")}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Background
            </Button>
            <Button onClick={() => setStep("review")}>
              Review Application
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        
        {step === "review" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStep("criteria")}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Evidence
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="min-w-32"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-1" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Step Indicator */}
        <div className="flex items-center gap-6 pt-4">
          {(["background", "criteria", "review"] as Step[]).map((stepName) => (
            <div key={stepName} className="flex items-center gap-2">
              {getStepIcon(stepName, step)}
              <span className={`text-sm font-medium ${
                stepName === step ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {stepName === 'background' ? 'Background Info' :
                stepName === 'criteria' ? 'Evidence' : 'Review & Submit'}
              </span>
              {stepName !== "review" && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center gap-2 justify-end">
            <Badge variant={
              progress === 0 ? "default" :
              progress <= 35 ? "destructive" :
              progress <= 65 ? "secondary" :
              "default"
            } className={
              progress === 0 ? "" :
              progress <= 35 ? "bg-red-100 text-red-800 hover:bg-red-100" :
              progress <= 65 ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
              "bg-green-100 text-green-800 hover:bg-green-100"
            }>
              {progress}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="w-40 h-2" />
        </div>
      </div>

      <Separator />

      {/* Step 1: Background Information */}
      {step === "background" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Application Information</h3>
            <p className="text-sm text-muted-foreground">
              Provide your background information and application details
            </p>
          </div>
          <div className="space-y-6">
            {selectedSchema.caseBackground.sections.map((section, index) => (
              <SectionCard
                key={section.title}
                section={section}
                formData={formData}
                onFieldChange={handleFieldChange}
                isComplete={sectionCompletion.has(section.title)}
                uploadedFiles={uploadedFiles[section.title]}
                onFileUpload={handleBackgroundFileUpload}
                onRemoveFile={handleRemoveBackgroundFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Criteria Evidence */}
      {step === "criteria" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Evidence</CardTitle>
              <CardDescription>
                Upload and organize documents to support your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {Object.entries(selectedSchema.criteria).map(([key, criterion]) => (
                  <CriterionSection
                    key={key}
                    criterionKey={key}
                    criterion={criterion}
                    folders={folders[key] || []}
                    onCreateFolder={handleCreateFolder}
                    onRenameFolder={handleRenameFolder}
                    onDeleteFolder={handleDeleteFolder}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={handleRemoveFile}
                  />
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === "review" && (
        <div className="space-y-6">
          <ReviewSection
            schema={selectedSchema}
            formData={formData}
            folders={folders}
          />
        </div>
      )}
    </div>
  );
}

function SectionCard({ 
  section, 
  formData, 
  onFieldChange, 
  isComplete,
  uploadedFiles = [],
  onFileUpload,
  onRemoveFile
}: { 
  section: VisaSection;
  formData: FormData;
  onFieldChange: (fieldName: string, value: any, sectionTitle: string) => void;
  isComplete: boolean;
  uploadedFiles?: UploadedFile[];
  onFileUpload?: (sectionTitle: string, files: File[]) => void;
  onRemoveFile?: (sectionTitle: string, fileId: string) => void;
}) {
  const renderField = (field: VisaField) => {
    const commonProps = {
      id: field.name,
      value: formData[field.name] || '',
      onChange: (e: any) => onFieldChange(field.name, e.target.value, section.title),
      required: field.required,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} />;
      
      case 'select':
        return (
          <Select 
            value={formData[field.name] || ''} 
            onValueChange={(value) => onFieldChange(field.name, value, section.title)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return <Input type={field.type} {...commonProps} />;
    }
  };

  // Update the file upload section in SectionCard component
  if (section.type === 'file_upload') {
    const sectionFiles = uploadedFiles || [];

    return (
      <div className="flex flex-col bg-sidebar rounded-lg px-8 py-6">
        <div className="flex flex-col md:flex-row gap-[80px]">
          {/* LEFT TEXT */}
          <div className="flex flex-col md:w-1/3">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base text-foreground">
                {section.title}
              </h3>
              {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-sm text-muted-foreground">
              {section.description || "Upload supporting documents for this section."}
            </p>
          </div>

          {/* RIGHT UPLOAD AREA */}
          <div className="md:w-2/3 p-6 pr-0">
            {/* File List */}
            {sectionFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                {sectionFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size} • {formatDate(file.uploadedAt.toLocaleDateString())}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveFile?.(section.title, file.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone */}
            <FileUploadZone
              onFileUpload={(files) => onFileUpload?.(section.title, files)}
              multiple={section.multiple}
              sectionTitle={section.title}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-sidebar rounded-lg px-8 py-6">
      <div className="flex flex-col md:flex-row gap-[80px]">
        {/* LEFT TEXT */}
        <div className="flex flex-col md:w-1/3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base text-foreground">
              {section.title}
            </h3>
            {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-sm text-muted-foreground">
            Provide the required information for this section.
          </p>
        </div>

        {/* RIGHT FORM FIELDS */}
        <div className="md:w-2/3 p-6 pr-0 space-y-6">
          {section.fields && section.fields.length > 1 ? (
            // Use 2-column grid for multiple fields
            <div className="grid gap-6 md:grid-cols-2">
              {section.fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderField(field)}
                  {field.conditional && (
                    <p className="text-xs text-muted-foreground">
                      This field is conditional and may only appear under specific circumstances.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Use single column for one field (or no grid wrapper)
            <div className="space-y-6">
              {section.fields?.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderField(field)}
                  {field.conditional && (
                    <p className="text-xs text-muted-foreground">
                      This field is conditional and may only appear under specific circumstances.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for criterion sections with folder management
function CriterionSection({
  criterionKey,
  criterion,
  folders,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onFileUpload,
  onRemoveFile
}: {
  criterionKey: string;
  criterion: VisaCriterion;
  folders: Folder[];
  onCreateFolder: (criterionKey: string) => void;
  onRenameFolder: (criterionKey: string, folderId: string, newName: string) => void;
  onDeleteFolder: (criterionKey: string, folderId: string) => void;
  onFileUpload: (criterionKey: string, folderId: string, files: File[]) => void;
  onRemoveFile: (criterionKey: string, folderId: string, fileId: string) => void;
}) {
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (folder: Folder) => {
    setEditingFolder(folder.id);
    setEditName(folder.name);
  };

  const handleSaveEdit = (folderId: string) => {
    if (editName.trim()) {
      onRenameFolder(criterionKey, folderId, editName.trim());
    }
    setEditingFolder(null);
    setEditName('');
  };

  const totalFiles = folders.reduce((sum, folder) => sum + folder.files.length, 0);

  return (
    <AccordionItem value={criterionKey} className="border rounded-lg">
      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="text-left">
            <h3 className="font-semibold text-base">{criterion.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{folders.length} Groups</span>
            <span>{totalFiles} Files</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <div className="space-y-4">
          {/* Folder List */}
          {folders.map(folder => (
            <Card key={folder.id} className="border bg-muted/30">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderPlus className="h-5 w-5 text-blue-600" />
                    {editingFolder === folder.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 w-64"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(folder.id);
                            if (e.key === 'Escape') setEditingFolder(null);
                          }}
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(folder.id)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{folder.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleStartEdit(folder)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <UploadZone
                      onUpload={(files) => onFileUpload(criterionKey, folder.id, files)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteFolder(criterionKey, folder.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-4 pb-3">
                {folder.files.length > 0 ? (
                  <div className="space-y-2">
                    {folder.files.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.size} • {formatDate(file.uploadedAt.toLocaleDateString())}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemoveFile(criterionKey, folder.id, file.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4 border rounded-md bg-background/50">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No files uploaded yet</p>
                    <p className="text-xs">Drag and drop files or use the upload button</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Create Folder Button */}
          <Button
            variant="outline"
            onClick={() => onCreateFolder(criterionKey)}
            className="w-full gap-2 py-6 border-dashed"
          >
            <Plus className="h-4 w-4" />
            Create New Evidence Group
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Enhanced Upload Zone Component
function UploadZone({ onUpload }: { onUpload: (files: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border px-3 py-1.5 rounded-md text-sm cursor-pointer transition-all
        ${isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-300 hover:bg-muted/40'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        <span>Upload</span>
      </div>
    </div>
  );
}

// FileUploadZone component
function FileUploadZone({ 
  onFileUpload, 
  multiple = true,
  sectionTitle 
}: { 
  onFileUpload: (files: File[]) => void;
  multiple?: boolean;
  sectionTitle: string;
}) {
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFileUpload(acceptedFiles);
      setIsDragActive(false);
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    multiple,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
        ${isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-muted-foreground/25 bg-background/50 hover:bg-muted/40'
        }
      `}
      onClick={(e) => {
        e.stopPropagation();
        open();
      }}
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-2">
        {isDragActive ? 'Drop files here...' : 'Drag & drop files here or click to browse'}
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        {multiple ? 'Multiple files allowed' : 'Single file upload'} • 
        Supports PDF, Images, Word, Excel
      </p>
      <Button variant="outline" size="sm" type="button">
        <Upload className="h-4 w-4 mr-2" />
        Browse Files
      </Button>
    </div>
  );
}

// Review Section Component
function ReviewSection({ 
  schema, 
  formData, 
  folders 
}: { 
  schema: VisaSchema;
  formData: FormData;
  folders: CriterionState;
}) {
  const totalFiles = Object.values(folders).flat().reduce((sum, folder) => sum + folder.files.length, 0);
  const totalFolders = Object.values(folders).flat().length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Case Summary</CardTitle>
          <CardDescription>Overview of your visa case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Visa Type</p>
              <p className="font-medium">{schema.title}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Evidence</p>
              <p className="font-medium">{totalFiles} files in {totalFolders} groups</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Background Information</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">{value || 'Not provided'}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Summary</CardTitle>
          <CardDescription>Documents organized by criterion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(schema.criteria).map(([key, criterion]) => {
              const criterionFolders = folders[key] || [];
              const criterionFiles = criterionFolders.reduce((sum, folder) => sum + folder.files.length, 0);
              
              return (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{criterion.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {criterionFolders.length} groups • {criterionFiles} files
                    </p>
                  </div>
                  <Badge variant={criterionFiles > 0 ? "default" : "outline"}>
                    {criterionFiles > 0 ? 'Evidence Added' : 'No Evidence'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}