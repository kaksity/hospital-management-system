// components/Modals/UploadAvatarModal.tsx
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarInitials } from "@/utils/avatarUtils"; 

interface UploadAvatarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  currentAvatar?: string;
}

export function UploadAvatarModal({ open, onOpenChange, onUpload, currentAvatar }: UploadAvatarModalProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a JPG, PNG, or WebP image.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onOpenChange(false);
      resetForm();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a JPG, PNG, or WebP image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Avatar Preview */}
          {currentAvatar && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Photo</p>
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarImage src={currentAvatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getAvatarInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* File Upload Area */}
          <Card 
            className="border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={previewUrl} />
                    <AvatarFallback>
                      <Image className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-sm font-medium">Preview</p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile?.name} ({(selectedFile?.size || 0 / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Choose Different
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Drop your photo here or click to browse</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG, WebP • Max 5MB
                  </p>
                </div>
                <Button variant="outline" type="button" size="sm">
                  Select File
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}