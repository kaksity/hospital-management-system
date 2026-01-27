// settings/data.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Download, Trash2, ShieldCheck, History, Info } from "lucide-react";
import { toast } from "sonner";

export function DataSettings() {
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAction = (type: 'export' | 'delete') => {
    setIsAuthorizing(true);
    // Simulate security layer
    toast.info(`Please re-authenticate to confirm data ${type}.`, {
      description: "A security verification is required for this sensitive operation."
    });
    setTimeout(() => setIsAuthorizing(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Data Handling</h2>
          <p className="text-[13px] text-slate-500 font-medium">
            To comply with regulation and to ensure customers have primary control over their data, we've added some quick tools to help manage your data.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Data Export */}
          <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0 py-5">
              <div className="flex items-center gap-2 text-slate-700">
                <Database className="h-5 w-5" />
                <div className="font-semibold">Data Management</div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold antialiased border-blue-100 text-[11px]">Standard Policy</Badge>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex gap-8">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-slate-800">Export my Data</h4>
                    <p className="text-[13px] text-slate-600 font-medium">
                      Request a full archive of your data, including diagnostic reports, patient demographics, and audit logs in standardized JSON or CSV formats.
                    </p>
                  </div>
                </div>
                <Button
                  className="h-10 px-8"
                  onClick={() => handleAction('export')}
                  disabled={isAuthorizing}
                >
                  Export my data
                </Button>
              </div>

              <div className="flex gap-8">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-slate-800">Delete my Data</h4>
                    <p className="text-[13px] text-slate-600 font-medium">
                      Deleting your data in Carepak will remove your stored information, including patient records and communication logs. This process does not deactivate your account. This action is irreversible and subject to 48-hour cool-off period.
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    className="h-10 px-8"
                    onClick={() => handleAction('delete')}
                    disabled={isAuthorizing}
                  >
                    Delete my data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple Badge component if not imported
function Badge({ children, className, variant }: any) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${className}`}>
      {children}
    </span>
  );
}
