"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  entityName: string;
  actionLabel: string;
  type: "archive" | "delete";
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  entityName,
  actionLabel,
  type,
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const isMatch = confirmationInput.trim().toLowerCase() === entityName.trim().toLowerCase();

  // Reset input when modal closes or opens with a new entity
  useEffect(() => {
    if (!open) {
      setConfirmationInput("");
    }
  }, [open, entityName]);

  const isDelete = type === "delete";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <div className={cn(
          "h-2 w-full",
          isDelete ? "bg-destructive" : "bg-amber-500"
        )} />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
              isDelete ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            )}>
              {isDelete ? <Trash2 className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">{title}</DialogTitle>
            </DialogHeader>
          </div>

          <DialogDescription className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
            {description}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Type the name to confirm:</p>
              <p className="text-sm font-black text-slate-700 select-none">"{entityName}"</p>
            </div>
          </DialogDescription>

          <div className="space-y-4">
            <Input
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={`Enter "${entityName}"`}
              className={cn(
                "h-11 font-medium focus-visible:ring-offset-0",
                isMatch ? "border-emerald-500 focus-visible:ring-emerald-500/20 bg-emerald-50/20" : "focus-visible:ring-slate-200"
              )}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="p-4 bg-slate-50 gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="font-bold text-slate-500 hover:bg-slate-200/50"
          >
            Cancel
          </Button>
          <Button
            variant={isDelete ? "destructive" : "default"}
            disabled={!isMatch || isLoading}
            onClick={onConfirm}
            className={cn(
              "px-6 h-10",
              !isDelete && "bg-amber-600 hover:bg-amber-700 text-white border-none"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              actionLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
