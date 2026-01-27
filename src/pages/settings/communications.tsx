2// settings/communications.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, MessageCircle, Mail, Settings2, BellRing } from "lucide-react";
import { toast } from "sonner";

export function CommunicationsSettings() {
  const [channels, setChannels] = useState({
    whatsapp: true,
    email: true,
    sms: false,
    autoResults: true,
    paymentReminders: true
  });

  const handleToggle = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`Communication preference updated`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Communication Channels</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Configure how your organization interacts with patients through automated messaging and templates.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Automated Message Settings */}
          <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-slate-700">
                <Settings2 className="h-5 w-5" />
                <div className="font-semibold">Automated Message Configuration</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 text-[15px]">Auto-Dispatch Results</div>
                  <p className="text-[13px] text-slate-500 font-medium">Automatically dispatch approved diagnostic reports to patients via chosen channels.</p>
                </div>
                <Switch checked={channels.autoResults} onCheckedChange={() => handleToggle('autoResults')} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 text-[15px]">Smart Payment Reminders</div>
                  <p className="text-[13px] text-slate-500 font-medium">Trigger automated reminders for partial payments 48 hours before review.</p>
                </div>
                <Switch checked={channels.paymentReminders} onCheckedChange={() => handleToggle('paymentReminders')} />
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp & Email Templates */}
          <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-slate-700">
                <MessageCircle className="h-5 w-5" />
                <div className="text-[15px] font-semibold">WhatsApp & SMS Integration</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-center">
              <div className="py-6 space-y-4">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[15px] font-semibold text-slate-800">WhatsApp Templates</h4>
                  <p className="text-[13px] text-slate-500 font-medium max-w-[300px] mx-auto">Configure pre-approved Meta templates for patient notifications and appointment confirmations.</p>
                </div>
                <Button variant="outline" className="h-10 px-6 font-semibold">
                  Manage Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
