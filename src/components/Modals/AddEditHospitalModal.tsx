"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Hash } from "lucide-react";

interface AddEditHospitalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (hospital: any) => void;
  hospital?: any; // If provided, we are in edit mode
}

export function AddEditHospitalModal({
  open,
  onOpenChange,
  onSuccess,
  hospital,
}: AddEditHospitalModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    accountCode: "",
    name: "",
    location: "",
  });

  // Reset form when modal opens or hospital changes
  React.useEffect(() => {
    if (hospital) {
      setFormData({
        accountCode: hospital.accountCode || "",
        name: hospital.name || "",
        location: hospital.location || "",
      });
    } else {
      setFormData({
        accountCode: "",
        name: "",
        location: "",
      });
    }
  }, [hospital, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess?.({
        ...hospital,
        ...formData,
        id: hospital?.id || `HOS-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
        status: hospital?.status || "active",
        createdAt: hospital?.createdAt || new Date().toISOString().split("T")[0],
      });
      onOpenChange(false);
    }, 1000);
  };

  const isEdit = !!hospital;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the clinical facility details in the system."
              : "Register a new clinical facility or hospital wing in the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-1">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="accountCode" required>Account Code</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="accountCode"
                  placeholder="e.g. ACC-1234"
                  className="pl-9"
                  value={formData.accountCode}
                  onChange={(e) =>
                    setFormData({ ...formData, accountCode: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" required>Hospital Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="e.g. City General Radiology"
                  className="pl-9"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="location" required>Location / Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. 12 Plot Road, Lekki, Lagos"
                  className="pl-9"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (isEdit ? "Updating..." : "Registering...") : (isEdit ? "Save Changes" : "Add Hospital")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
