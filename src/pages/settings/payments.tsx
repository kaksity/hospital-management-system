// settings/payments.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Wallet, Landmark, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PaymentsSettings() {
  const [activeGateway, setActiveGateway] = useState<string>("paystack");

  const gateways = [
    {
      id: "paystack",
      name: "Paystack",
      description: "Modern online and offline payments for Africa.",
      logo: "https://paystack.com/assets/img/login/paystack-logo.png",
      status: "connected"
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      description: "End-to-end payment solutions for global business.",
      logo: "https://flutterwave.com/images/logo/logo-blue.svg",
      status: "disconnected"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Payment Infrastructure</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Configure institutional payment gateways to accept online settlements for radiology services.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 text-slate-700">
                <CreditCard className="h-5 w-5" />
                <div className="font-semibold">Active Payment Gateways</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-2 space-y-4">
              <div className="grid gap-4">
                {gateways.map((gateway) => (
                  <div
                    key={gateway.id}
                    className={cn(
                      "group relative flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer",
                      activeGateway === gateway.id
                        ? "border-[#006bff] bg-blue-50/20"
                        : "bg-white hover:border-input/70"
                    )}
                    onClick={() => setActiveGateway(gateway.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center border transition-colors",
                        activeGateway === gateway.id ? "bg-white border-blue-200" : "bg-slate-50"
                      )}>
                        {gateway.id === 'paystack' ? <Zap className="h-6 w-6 text-blue-600" /> : <Wallet className="h-6 w-6 text-slate-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{gateway.name}</span>
                          {activeGateway === gateway.id && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-600 text-white">Active</span>
                          )}
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-[320px]">{gateway.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-8 font-bold text-xs">Configure</Button>
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center transition-all",
                        activeGateway === gateway.id ? "bg-[#006bff] scale-100" : "bg-slate-100 scale-90"
                      )}>
                        <ShieldCheck className={cn("h-3.5 w-3.5", activeGateway === gateway.id ? "text-white" : "text-slate-400")} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 p-5 bg-slate-50 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[15px] font-semibold text-slate-800">Bank Transfer Verification</h4>
                  <p className="text-[13px] text-slate-500 font-medium">Automatic verification for direct deposits and bank settlements.</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-6 font-semibold shadow-none bg-white">
                  Add Bank Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center gap-5 px-2">
            <p className="text-xs text-slate-500 font-medium flex items-center max-w-[300px] gap-1.5 antialiased">
              <ShieldCheck className="h-4 w-4 min-w-4 text-emerald-500" />
              All payment configurations are PCI-DSS compliant and secured by 256-bit encryption.
            </p>
            <Button className="h-11 px-8 font-bold shadow-sm">Save Payment Configuration</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
