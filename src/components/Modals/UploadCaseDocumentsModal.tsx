"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, FileText, UploadCloud, RefreshCw } from "lucide-react";
import { formatFileSize } from "@/utils/formatFileSize";
import { useToast } from "@/components/ui/use-toast";

interface UploadCaseDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
  multiple?: boolean;
}

interface FilePreview {
  file: File;
  preview: string | null;
  progress: number;
  status: "pending" | "uploading" | "success" | "failed";
}

export function UploadCaseDocumentsModal({
  open,
  onOpenChange,
  onUpload,
  multiple = true,
}: UploadCaseDocumentsModalProps) {
  const { toast } = useToast();
  const [files, setFiles] = React.useState<FilePreview[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      progress: 0,
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
  });

  const handleRemove = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const simulateUpload = (file: FilePreview): Promise<"success" | "failed"> => {
    return new Promise((resolve) => {
      // Randomized success or fail (90% success rate)
      const willFail = Math.random() < 0.1;
      setTimeout(() => resolve(willFail ? "failed" : "success"), 2000);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    // simulate individual uploads
    for (const f of files) {
      setFiles((prev) =>
        prev.map((file) =>
          file.file === f.file
            ? { ...file, status: "uploading", progress: 0 }
            : file
        )
      );

      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 150));
        setFiles((prev) =>
          prev.map((file) =>
            file.file === f.file ? { ...file, progress: i } : file
          )
        );
      }

      const result = await simulateUpload(f);
      setFiles((prev) =>
        prev.map((file) =>
          file.file === f.file ? { ...file, status: result } : file
        )
      );
    }

    const successFiles = files.filter((f) => f.status !== "failed");
    const failedFiles = files.filter((f) => f.status === "failed");

    if (failedFiles.length > 0) {
      toast({
        title: "Some uploads failed ❌",
        description: `${failedFiles.length} ${
          failedFiles.length === 1 ? "file" : "files"
        } couldn’t be uploaded. Please retry.`,
        variant: "destructive",
        duration: 5000,
      });
    }

    if (successFiles.length > 0) {
      toast({
        title: "Upload complete ✅",
        description: `${successFiles.length} ${
          successFiles.length === 1 ? "file" : "files"
        } uploaded successfully.`,
        duration: 4000,
      });
      onUpload(successFiles.map((f) => f.file));
    }

    setUploading(false);
  };

  const handleRetry = async (file: FilePreview) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file === file.file ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file.file ? { ...f, progress: i } : f
        )
      );
    }

    const result = await simulateUpload(file);
    setFiles((prev) =>
      prev.map((f) =>
        f.file === file.file ? { ...f, status: result } : f
      )
    );

    if (result === "success") {
      toast({
        title: "File uploaded successfully 🎉",
        description: `${file.file.name} has been uploaded.`,
        duration: 4000,
      });
    } else {
      toast({
        title: "Upload failed ❌",
        description: `${file.file.name} could not be uploaded.`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  React.useEffect(() => {
    return () => {
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Drag & drop your files below or click to select them.
          </DialogDescription>
        </DialogHeader>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-muted"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop files here..."
              : "Drag files here or click to browse"}
          </p>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mt-4 border rounded-md divide-y bg-muted/30 max-h-64 overflow-y-auto">
            {files.map((filePreview, index) => {
              const { file, preview, progress, status } = filePreview;
              const isImage = !!preview;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 flex items-center justify-center bg-background border rounded-md overflow-hidden">
                      {isImage ? (
                        <img
                          src={preview!}
                          alt={file.name}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-medium">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === "uploading" ? (
                      <Progress value={progress} className="w-20 h-1.5" />
                    ) : status === "failed" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRetry(filePreview)}
                        className="h-6 w-6 text-yellow-600 hover:text-yellow-800"
                        title="Retry"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(file)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            disabled={files.length === 0 || uploading}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
