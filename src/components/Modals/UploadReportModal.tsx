/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modals/UploadReportModal.tsx
"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, X, FileText, Folder, User } from "lucide-react";

interface UploadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[], metadata: { title: string; type: string; department: string }) => void;
  patientName?: string;
}

export function UploadReportModal({ open, onOpenChange, onUpload, patientName }: UploadReportModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [reportTitle, setReportTitle] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableTypes = [
    "Lab Result",
    "MRI Scan", 
    "CT Scan",
    "X-Ray",
    "Ultrasound",
    "Biopsy",
    "ECG / EKG",
    "General Medical Report"
  ];

  const availableDepartments = [
    "Laboratory",
    "Radiology",
    "Cardiology",
    "Pathology",
    "Neurology",
    "General Medicine"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0 || !reportTitle) return;
    
    onUpload(selectedFiles, {
      title: reportTitle,
      type: selectedType,
      department: selectedDepartment
    });
    
    // Reset form
    setSelectedFiles([]);
    setReportTitle("");
    setSelectedType("");
    setSelectedDepartment("");
    onOpenChange(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Patient Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* Diagnostic Details */}
          <div className="space-y-2">
            <Label htmlFor="title" required>Report Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Complete Blood Count Results, Head CT Scan"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" required>Report Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" required>Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        {dept}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2 pt-2">
            <Label required>Diagnostic Documents</Label>
            <Card 
              className="border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors bg-slate-50/50"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <div>
                  <p className="font-medium text-sm text-slate-700">Drop report files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, JPG, PNG, DOCX (Max 15MB)
                  </p>
                </div>
                <Button variant="outline" type="button" className="mt-4 bg-white" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Select Files
                </Button>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </Card>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0 || !reportTitle || !selectedType || !selectedDepartment}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Report {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}