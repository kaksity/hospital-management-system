"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSliders,
  Check,
  Plus,
  X,
  Search,
  Filter,
  ChevronsUpDown,
  LayoutGrid,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RichEditor } from "@/components/ui/rich-editor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = ["MRI", "CT SCAN", "X-RAY", "ULTRASOUND", "CONSULT"];

const SERVICES_MAP: Record<string, string[]> = {
  "MRI": ["MRI Brain (Contrast)", "MRI Brain (Plain)", "MRI Spine (Lumbar)", "MRI Spine (Cervical)", "MRI Knee", "MRI Shoulder"],
  "CT SCAN": ["CT Head", "CT Chest", "CT Abdomen", "CT Pelvis", "CT Spine"],
  "X-RAY": ["Chest X-Ray", "Pelvis X-Ray", "Spine X-Ray", "Hand/Wrist X-Ray", "Knee X-Ray"],
  "ULTRASOUND": ["Abdominal Ultrasound", "Pelvic Ultrasound", "Obstetric Ultrasound", "Breast Ultrasound"],
  "CONSULT": ["General Consultation", "Cardiology Review", "Neurosurgery Evaluation", "Radiology Second Opinion"],
};

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    service: "",
    status: "Published",
    content: "<h3><strong>Findings:</strong></h3><ul><li></li></ul><h3><strong>Impression:</strong></h3><p></p>",
  });

  const services = useMemo(() => {
    return formData.category ? SERVICES_MAP[formData.category] || [] : [];
  }, [formData.category]);

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.service) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Template created successfully");
      navigate("/templates");
    }, 1500);
  };

  return (
    <div className="min-h-full flex flex-col bg-[#fafafa]">
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="max-w-5xl mx-auto w-full space-y-4">
          {/* Sticky Header Section - Moved inside content but sticky */}
          <div className="py-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-900">Create Reporting Template</h1>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Design standardized diagnostic report structures</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Template Identification */}
            <Card className="lg:col-span-1 border bg-white rounded-xl">
              <CardHeader className="border-b bg-slate-50/50 py-4">
                <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Template Metadata
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="category" required>Medical Modality</Label>
                  <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full h-11 bg-white justify-between border shadow-none rounded-lg font-semibold text-sm"
                      >
                        {formData.category ? formData.category : <span className="text-slate-400 font-medium">Select Category...</span>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search modality..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No modality found.</CommandEmpty>
                          <CommandGroup>
                            {CATEGORIES.map((cat) => (
                              <CommandItem
                                key={cat}
                                onSelect={() => {
                                  setFormData({ ...formData, category: cat, service: "" });
                                  setIsCategoryPopoverOpen(false);
                                }}
                                className="text-sm font-medium"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.category === cat ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {cat}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="service" required>Linked Clinical Service</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(val) => setFormData({ ...formData, service: val })}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="h-11 bg-white shadow-none rounded-lg font-semibold text-sm">
                      <SelectValue placeholder={formData.category ? "Select a service..." : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s} value={s} className="text-sm font-medium">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="name" required>Template Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Normal Brain MRI"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 font-medium bg-white"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">This will be the display name in the report editor.</p>
                </div>
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="lg:col-span-2 border shadow-none bg-white rounded-xl min-h-[600px] flex flex-col overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 py-4 space-y-0">
                <div className="text-sm font-semibold text-slate-700">
                  Report Structure
                </div>
                <div className="text-[13px] font-medium text-slate-500">Define the boilerplate content for this diagnostic protocol</div>
              </CardHeader>
              <CardContent className="p-3 flex-1 flex flex-col">
                <RichEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  className="flex-1 min-h-[500px] border-none focus-visible:ring-0"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate("/templates")}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast.success("Template saved as draft");
                  navigate("/templates");
                }, 1000);
              }}
              disabled={loading}
              className="bg-amber-50 border-[#e7c747] text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <FileText className="h-4 w-4 text-amber-600" />
              Save as Draft
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
