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
                    <h2 className="text-lg font-semibold text-slate-900">Institutional Data Lifecycle</h2>
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        Manage your organization's clinical and administrative data footprint. Data governance actions require enhanced authorization.
                    </p>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Data Export */}
                    <Card className="border shadow-none bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="border-b bg-slate-50/30 flex-row items-center justify-between space-y-0 py-5">
                            <div className="flex items-center gap-2 text-[#006bff]">
                                <Database className="h-5 w-5" />
                                <CardTitle className="text-sm font-bold uppercase tracking-tight">Clinical Data Portability</CardTitle>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 font-bold border-blue-100 uppercase text-[9px]">Standard Policy</Badge>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex gap-4 p-5 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Download className="h-5 w-5" />
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="text-[13px] font-bold text-slate-800">Export Institutional Dataset</h4>
                                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                        Request a full archive of your clinical data, including diagnostic reports, patient demographics, and audit logs in standardized JSON or CSV formats.
                                    </p>
                                    <Button
                                        className="mt-2 h-9 px-5 text-xs font-bold gap-2 bg-[#006bff]"
                                        onClick={() => handleAction('export')}
                                        disabled={isAuthorizing}
                                    >
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Archive and Download
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Secure Deletion */}
                    <Card className="border border-red-100 shadow-none bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-red-100/50 bg-red-50/30">
                            <div className="flex items-center gap-2 text-red-700">
                                <Trash2 className="h-5 w-5" />
                                <CardTitle className="text-sm font-bold uppercase tracking-tight">Institutional Erasure</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="text-[13px] font-bold text-slate-800">Purge Institutional Data</h4>
                                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                            Permanently delete all patient records and diagnostic data associated with this account. This action is irreversible and subject to 48-hour cool-off period.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-3">
                                        <div className="flex items-center gap-2 text-red-800 text-[11px] font-bold">
                                            <History className="h-3.5 w-3.5" />
                                            Retention Policy Note
                                        </div>
                                        <p className="text-[10px] text-red-700/80 font-medium leading-relaxed italic">
                                            In accordance with radiology regulatory standards, some metadata may be retained for audit trails for up to 7 years.
                                        </p>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        className="h-10 px-8 text-xs font-bold"
                                        onClick={() => handleAction('delete')}
                                        disabled={isAuthorizing}
                                    >
                                        Authorize Deletion Purge
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
