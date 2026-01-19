/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Modals/UploadDocumentsModal.tsx
"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, X, FileText, Folder, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UploadDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[], metadata: { caseId?: string; group?: string; criterion?: string }) => void;
  cases?: Array<{ id: string; clientName: string; visaType: string }>;
}

export function UploadDocumentsModal({ open, onOpenChange, onUpload, cases = [] }: UploadDocumentsModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedCriterion, setSelectedCriterion] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample groups and criteria for demonstration
  const availableGroups = [
    "Awards Certificates",
    "Press Coverage", 
    "Association Letters",
    "Expert Letters",
    "Employment Contracts",
    "Educational Documents",
    "Patent Files",
    "Research Papers"
  ];

  const availableCriteria = [
    "National or International Awards",
    "Membership in Associations",
    "Published Material",
    "Judging Experience",
    "Original Contributions",
    "Academic Articles",
    "High Salary",
    "Recommendation Letters"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    onUpload(selectedFiles, {
      caseId: selectedCase,
      group: selectedGroup,
      criterion: selectedCriterion
    });
    
    // Reset form
    setSelectedFiles([]);
    setSelectedCase("");
    setSelectedGroup("");
    setSelectedCriterion("");
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
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Case Selection */}
          <div className="space-y-1">
            <Label htmlFor="case">Assign to Case (Optional)</Label>
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger>
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific case</SelectItem>
                {cases.map(caseItem => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {caseItem.clientName} - {caseItem.visaType}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Organization */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="criterion">Criterion (Optional)</Label>
              <Select value={selectedCriterion} onValueChange={setSelectedCriterion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select criterion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific criterion</SelectItem>
                  {availableCriteria.map(criterion => (
                    <SelectItem key={criterion} value={criterion}>
                      {criterion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="group">Group (Optional)</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific group</SelectItem>
                  {availableGroups.map(group => (
                    <SelectItem key={group} value={group}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        {group}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-1">
            <Label>Documents</Label>
            <Card 
              className="border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, JPG, PNG, DOC, DOCX files
                  </p>
                </div>
                <Button variant="outline" type="button">
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
            <div className="space-y-1">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
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
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {(selectedCase || selectedGroup || selectedCriterion) && (
            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium text-sm mb-2">Upload Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {selectedCase && selectedCase !== "none" && (
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Case: {cases.find(c => c.id === selectedCase)?.clientName}</span>
                  </div>
                )}
                {selectedCriterion && selectedCriterion !== "none" && (
                  <div>
                    <span>Criterion: {selectedCriterion}</span>
                  </div>
                )}
                {selectedGroup && selectedGroup !== "none" && (
                  <div className="flex items-center gap-2">
                    <Folder className="h-3 w-3" />
                    <span>Group: {selectedGroup}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}