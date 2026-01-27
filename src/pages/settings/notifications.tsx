// settings/notifications.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, ShieldAlert, FileCheck, CreditCard, Activity } from "lucide-react";
import { toast } from "sonner";

export function NotificationsSettings() {
  const [notifs, setNotifs] = useState({
    system: true,
    clinical: true,
    billing: false,
    security: true,
  });

  const handleToggle = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification preferences updated");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">System Notifications</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Manage how you receive alerts regarding clinical activities, security events, and platform updates.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-slate-700">
                <Bell className="h-5 w-5" />
                <div className="text-[15px] font-semibold">Alert Preferences</div>
              </div>
            </CardHeader>
            <CardContent className="p-0 pb-5">
              <div className="flex items-center justify-between p-6 py-3">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[15px] font-semibold text-slate-800">Clinical Report Ready</div>
                    <p className="text-[13px] text-slate-500 font-medium max-w-[350px]">Notify me when a diagnostic report is finalized and ready for clinical review.</p>
                  </div>
                </div>
                <Switch checked={notifs.clinical} onCheckedChange={() => handleToggle('clinical')} />
              </div>

              <div className="flex items-center justify-between p-6 py-3">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[15px] font-semibold text-slate-800">Billing & Payment Alerts</div>
                    <p className="text-[13px] text-slate-500 font-medium max-w-[350px]">Receive alerts for new invoices, partial payments, and overdue accounts.</p>
                  </div>
                </div>
                <Switch checked={notifs.billing} onCheckedChange={() => handleToggle('billing')} />
              </div>

              <div className="flex items-center justify-between p-6 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[15px] font-semibold text-slate-800">Security & Sign-in Activity</div>
                    <p className="text-[13px] text-slate-500 font-medium max-w-[350px]">Immediate notification for new device logins or critical account changes.</p>
                  </div>
                </div>
                <Switch checked={notifs.security} onCheckedChange={() => handleToggle('security')} />
              </div>

              <div className="flex items-center justify-between p-6 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[15px] font-semibold text-slate-800">Platform Performance</div>
                    <p className="text-[13px] text-slate-500 font-medium max-w-[350px]">Receive updates regarding system maintenance and performance reports.</p>
                  </div>
                </div>
                <Switch checked={notifs.system} onCheckedChange={() => handleToggle('system')} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end p-2">
            <Button className="h-11">
              Update Notification Strategy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
