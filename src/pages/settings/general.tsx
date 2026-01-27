// settings/general.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Upload,
  Trash2,
  Image as ImageIcon,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GeneralSettings() {
  const [logo, setLogo] = useState<string>("");

  const handleLogoUpload = () => {
    // In a real app, this would open a file picker
    toast.info("Logo upload process initialized");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      {/* Organization Header */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Logo</h2>
          <p className="text-[13px] text-slate-500 font-medium">
            Define your organization's brand identity. This logo will appear on diagnostic reports, dispatches, and invoices.
          </p>
        </div>

        <Card className="lg:col-span-2 border shadow-none bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-input/50 flex flex-col items-center justify-center gap-2 group hover:border-[#006bff]/50 hover:bg-blue-50/30 transition-all cursor-pointer overflow-hidden relative" onClick={handleLogoUpload}>
                {logo ? (
                  <img src={logo} alt="Org Logo" className="w-full h-full object-contain" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-[#006bff] group-hover:scale-110 transition-all" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Add Logo</span>
                  </>
                )}
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">Business Logo</h3>
                  <p className="text-[13px] text-slate-500 font-medium">Use a high-resolution PNG or SVG with a transparent background for best results on diagnostic reports.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button size="sm" variant="outline" className="h-9 px-4 gap-2 border" onClick={handleLogoUpload}>
                    <Upload className="h-3.5 w-3.5" />
                    Upload Logo
                  </Button>
                  {logo && (
                    <Button size="sm" variant="ghost" className="h-9 px-4 gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setLogo("")}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <hr className="border-input/50" />

      {/* Business Information Form */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Business Information</h2>
          <p className="text-[13px] text-slate-500 font-medium">
            Legal information used for regulatory compliance and institutional documentation.
          </p>
        </div>

        <Card className="lg:col-span-2 border shadow-none bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-8 space-y-8 border-b">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label required>Legal Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="orgName" className="pl-10" defaultValue="Broad Places Radiology Diagnostic Center" />
                </div>
              </div>

              <div className="space-y-1">
                <Label required>Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="street" className="pl-8" defaultValue="15 Babatunde Street Off Ogunlana Drive" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label required>City / District</Label>
                  <Input id="city" defaultValue="Surulere" />
                </div>
                <div className="space-y-1">
                  <Label required>State / Province</Label>
                  <Input id="state" defaultValue="Lagos" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-1">
                  <Label required>Postal Code</Label>
                  <Input id="postal" defaultValue="101211" />
                </div>
                <div className="space-y-1">
                  <Label required>Country</Label>
                  <Input id="country" defaultValue="Nigeria" disabled />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <Label required htmlFor="businessType">Business Type</Label>
                  <Select defaultValue="sole">
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <SelectValue placeholder="Select type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="corp">Corporation</SelectItem>
                      <SelectItem value="llc">LLC (Limited Liability Company)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label required htmlFor="companyType">Company Type</Label>
                  <Select defaultValue="private">
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private Enterprise</SelectItem>
                      <SelectItem value="public">Publicly Traded</SelectItem>
                      <SelectItem value="non-profit">Non-Profit Organization</SelectItem>
                      <SelectItem value="government">Government Integrated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Business Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="website" className="pl-10" placeholder="https://broadplacesradiology.com" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-8">
            <div className="pt-4 flex justify-end">
              <Button>
                <Check className="h-4 w-4" />
                Update Business Information
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}