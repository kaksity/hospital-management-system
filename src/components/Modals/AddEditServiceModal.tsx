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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Plus,
  Search,
  Check,
  ChevronsUpDown,
  Activity,
  Zap,
  Scan,
  Microscope,
  Stethoscope,
  Clock,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddEditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (service: any) => void;
  service?: any;
}

const EXISTING_CATEGORIES = [
  "MRI",
  "CT SCAN",
  "X-RAY",
  "ULTRASOUND",
  "CONSULTATION",
  "LABORATORY",
];

const CATEGORY_ICONS: Record<string, any> = {
  "MRI": Activity,
  "CT SCAN": Zap,
  "X-RAY": Scan,
  "ULTRASOUND": Microscope,
  "CONSULTATION": Stethoscope,
  "LABORATORY": Microscope,
};

export function AddEditServiceModal({
  open,
  onOpenChange,
  onSuccess,
  service,
}: AddEditServiceModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = React.useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    price: "",
    durationValue: "",
    durationUnit: "mins",
    active: true,
  });

  React.useEffect(() => {
    if (service) {
      // Parse duration like "30 mins" or "2 hours"
      const durationParts = service.duration?.split(" ") || ["", "mins"];
      setFormData({
        name: service.name || "",
        category: service.category || "",
        price: service.price?.toString() || "",
        durationValue: durationParts[0] || "",
        durationUnit: (durationParts[1]?.toLowerCase() === "hours" || durationParts[1]?.toLowerCase() === "hour") ? "hours" : "mins",
        active: service.active ?? true,
      });
      setIsAddingNewCategory(false);
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        durationValue: "",
        durationUnit: "mins",
        active: true,
      });
      setIsAddingNewCategory(false);
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = isAddingNewCategory ? newCategoryName : formData.category;

    if (!finalCategory) {
      setLoading(false);
      return;
    }

    // Combine value and unit for duration
    const formattedDuration = `${formData.durationValue} ${formData.durationUnit === "hours" ? (parseInt(formData.durationValue) === 1 ? "Hour" : "Hours") : "Mins"}`;

    setTimeout(() => {
      setLoading(false);
      onSuccess?.({
        ...service,
        ...formData,
        category: finalCategory,
        price: parseFloat(formData.price),
        duration: formattedDuration,
        id: service?.id || Math.floor(Math.random() * 10000),
        icon: CATEGORY_ICONS[finalCategory] || Activity,
      });
      onOpenChange(false);
    }, 1000);
  };

  const isEdit = !!service;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Clinical Service" : "Add New Medical Service"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify the parameters, pricing and duration for this diagnostic service."
              : "Register a new diagnostic scan or clinical consultation in the system catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-4">
            {/* Service Category Selection */}
            <div className="space-y-1">
              <Label required>Service Category</Label>
              <div className="flex gap-2">
                {isAddingNewCategory ? (
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Enter new category name (e.g. ECG, EEG)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value.toUpperCase())}
                      className="h-10 font-normal text-sm"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingNewCategory(false)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-[10px] font-semibold capitalize text-slate-500"
                    >
                      Use Existing
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isCategoryPopoverOpen}
                          className="w-full justify-between h-10 bg-white hover:bg-slate-50 border-input"
                        >
                          {formData.category ? (
                            <span className="font-semibold text-sm">{formData.category}</span>
                          ) : (
                            <span className="text-slate-400 font-medium">Select a category...</span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search categories..." className="h-9" />
                          <CommandList>
                            <CommandEmpty className="py-2 px-4 text-xs font-medium text-slate-500">
                              Category not found.
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 ml-2 text-primary font-bold"
                                onClick={() => {
                                  setIsAddingNewCategory(true);
                                  setIsCategoryPopoverOpen(false);
                                }}
                              >
                                Create new?
                              </Button>
                            </CommandEmpty>
                            <CommandGroup>
                              {EXISTING_CATEGORIES.map((cat) => (
                                <CommandItem
                                  key={cat}
                                  value={cat}
                                  onSelect={() => {
                                    setFormData({ ...formData, category: cat });
                                    setIsCategoryPopoverOpen(false);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-sm">{cat}</span>
                                    {formData.category === cat && (
                                      <Check className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                {!isAddingNewCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAddingNewCategory(true)}
                    className="h-10 w-10 shrink-0 border-dashed border-2 hover:border-primary hover:text-primary transition-all"
                    title="Add new category"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" required>Service Name</Label>
              <Input
                id="name"
                placeholder="e.g. Brain MRI (Without Contrast)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="price" required>Base Price (₦)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="pl-9 h-10 font-semibold tabular-nums"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="duration" required>Est. Duration</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="duration"
                      type="number"
                      placeholder="0"
                      value={formData.durationValue}
                      onChange={(e) => setFormData({ ...formData, durationValue: e.target.value })}
                      className="pl-9 h-10 font-semibold"
                      required
                    />
                  </div>
                  <Select
                    value={formData.durationUnit}
                    onValueChange={(val) => setFormData({ ...formData, durationUnit: val })}
                  >
                    <SelectTrigger className="w-[100px] h-10 font-semibold">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mins">Mins</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (isAddingNewCategory && !newCategoryName)}
            >
              {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Save Changes" : "Create Service")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
