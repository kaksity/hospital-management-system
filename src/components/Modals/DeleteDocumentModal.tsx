// components/Modals/DeleteDocumentModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, FileText } from "lucide-react";

interface DeleteDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: {
    id: string;
    name: string;
    size?: string;
    uploadedBy?: string;
  };
  multiple?: boolean;
  count?: number;
  onConfirm: () => void;
}

export function DeleteDocumentModal({ 
  open, 
  onOpenChange, 
  document, 
  multiple = false, 
  count = 0, 
  onConfirm 
}: DeleteDocumentModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>
              {multiple ? `Delete ${count} Documents` : 'Delete Document'}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            {multiple ? (
              <div className="space-y-3">
                <p>You are about to permanently delete {count} documents. This action cannot be undone.</p>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium">This will:</p>
                  <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                    <li>Permanently remove all selected documents</li>
                    <li>Delete files from storage</li>
                    <li>Remove document references from cases</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p>You are about to permanently delete this document:</p>
                
                {document && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{document.name}</p>
                        {document.size && (
                          <p className="text-xs text-muted-foreground">{document.size}</p>
                        )}
                        {document.uploadedBy && (
                          <p className="text-xs text-muted-foreground">Uploaded by {document.uploadedBy}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-destructive">Warning: This action cannot be undone</p>
                  <ul className="text-sm list-disc list-inside mt-2 space-y-1 text-destructive/80">
                    <li>Document will be permanently deleted</li>
                    <li>File will be removed from storage</li>
                    <li>Any case references will be lost</li>
                  </ul>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {multiple ? `Delete ${count} Documents` : 'Delete Document'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}