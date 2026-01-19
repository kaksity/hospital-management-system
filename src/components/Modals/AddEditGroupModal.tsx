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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AddEditGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode?: boolean;
  defaultValues?: {
    id?: string;
    name?: string;
    createdAt?: string;
  } | null;
  onSubmit?: (data: { id?: string; name: string }) => void;
}

export function AddEditGroupModal({
  open,
  onOpenChange,
  editMode = false,
  defaultValues = null,
  onSubmit,
}: AddEditGroupModalProps) {
  const { toast } = useToast();
  const [groupName, setGroupName] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  // Prefill if editing
  React.useEffect(() => {
    if (defaultValues?.name) {
      setGroupName(defaultValues.name);
    } else {
      setGroupName("");
    }
  }, [defaultValues, open]);

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter a folder name before saving.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate async save
    setSaving(false);

    toast({
      title: editMode ? "Group updated successfully ✅" : "New group created 🎉",
      description: editMode
        ? `Folder name changed to “${groupName}”.`
        : `“${groupName}” was added successfully.`,
      duration: 4000,
    });

    onSubmit?.({
      id: defaultValues?.id,
      name: groupName.trim(),
    });

    setGroupName("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setGroupName("");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Folder" : "Create New Folder"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update the folder name below."
              : "Add a new group to organize your evidence documents."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Folder Name</Label>
            <Input
              id="groupName"
              placeholder="e.g. Press Coverage"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={saving}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !groupName.trim()}>
            {saving
              ? editMode
                ? "Saving..."
                : "Creating..."
              : editMode
              ? "Save Changes"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
