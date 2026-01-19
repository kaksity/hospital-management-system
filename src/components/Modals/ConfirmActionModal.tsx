"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive" | "outline";
  onConfirm: () => void;
  multipleItems?: string[]; // 👈 NEW: for bulk mode (list of case IDs)
}

export function ConfirmActionModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "default",
  onConfirm,
  multipleItems,
}: ConfirmActionModalProps) {
  const isBulk = multipleItems && multipleItems.length > 1;
  const displayList = multipleItems?.slice(0, 3); // show first 3 only for brevity
  const remaining = multipleItems && multipleItems.length > 3
    ? multipleItems.length - 3
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {isBulk ? `${title} (${multipleItems.length})` : title}
          </DialogTitle>
          <DialogDescription>
            {description}
            {isBulk && (
              <div className="mt-3 space-y-1 text-sm text-foreground/80 border-t pt-2">
                {displayList?.map((id) => (
                  <div key={id}>• {id}</div>
                ))}
                {remaining > 0 && (
                  <div className="text-muted-foreground italic">
                    + {remaining} more…
                  </div>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {isBulk
              ? `${confirmLabel} ${multipleItems?.length} Cases`
              : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
