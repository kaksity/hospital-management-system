/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FlaskConical, ArrowLeft, CheckCircle2, Clock, Loader2, User,
  CalendarDays, Stethoscope, ClipboardList, Save, FlaskRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LabReportStatus } from "@/data/labReports";
import { useLabReports } from "@/hooks/use-lab-reports";

const statusConfig: Record<LabReportStatus, { label: string; className: string; icon: any }> = {
  pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700 border-blue-200",      icon: Loader2 },
  completed:  { label: "Completed",  className: "bg-green-100 text-green-700 border-green-200",   icon: CheckCircle2 },
};

export default function LabReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, updateStatus, updateReport } = useLabReports();

  const report = reports.find(r => r.id === id);

  // Local editable state for results and notes
  const [results, setResults] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (report) {
      const initial: Record<string, string> = {};
      report.tests.forEach(t => { initial[t.definitionId] = t.result; });
      setResults(initial);
      setNotes(report.notes);
      setIsDirty(false);
    }
  }, [report?.id]);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <FlaskConical className="h-8 w-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="font-semibold text-slate-800">Report not found</h3>
        <p className="text-sm text-muted-foreground mt-1">The lab report you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/lab-reports")} className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Lab Reports
        </Button>
      </div>
    );
  }

  const status = statusConfig[report.status];
  const StatusIcon = status.icon;

  const handleResultChange = (definitionId: string, value: string) => {
    setResults(prev => ({ ...prev, [definitionId]: value }));
    setIsDirty(true);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    updateReport(report.id, {
      notes,
      tests: report.tests.map(t => ({ ...t, result: results[t.definitionId] ?? t.result })),
    });
    setIsDirty(false);
  };

  const handleStatusChange = (newStatus: LabReportStatus) => {
    updateStatus(report.id, newStatus);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-[1200px] mx-auto w-full space-y-4">
          {/* Back + title row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 mt-0.5"
                onClick={() => navigate("/lab-reports")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FlaskConical className="h-4 w-4 text-blue-600" />
                  </div>
                  <h1 className="text-lg font-bold text-slate-900">Report {report.id}</h1>
                  <Badge className={cn("text-xs font-semibold border gap-1.5", status.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground ml-11">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {report.patientName} · {report.patientId} · {report.patientGender}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:shrink-0">
              {isDirty && (
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              )}
              {report.status === "pending" && (
                <Button variant="outline" onClick={() => handleStatusChange("processing")} className="gap-2">
                  <Loader2 className="h-4 w-4 text-blue-500" /> Mark Processing
                </Button>
              )}
              {report.status === "processing" && (
                <Button variant="outline" onClick={() => handleStatusChange("completed")} className="gap-2 text-green-700 border-green-300 hover:bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-6 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Tests — main column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <FlaskRound className="h-4 w-4 text-blue-500" />
                  Tests
                  <Badge variant="secondary" className="text-xs">{report.tests.length}</Badge>
                </h2>
                {isDirty && (
                  <Button size="sm" onClick={handleSave} className="gap-1.5 h-8">
                    <Save className="h-3.5 w-3.5" /> Save
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {report.tests.map(test => (
                  <div key={test.definitionId} className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
                    {/* Test header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{test.testName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs py-0">{test.testCategory}</Badge>
                            {test.unit && (
                              <span className="text-xs text-muted-foreground">Unit: {test.unit}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reference range */}
                    {test.referenceRange && (
                      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-slate-600">Reference Range:</span>{" "}
                          {test.referenceRange}
                        </p>
                      </div>
                    )}

                    {/* Result input */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-600">Result</Label>
                      <Input
                        placeholder="Enter result..."
                        value={results[test.definitionId] ?? ""}
                        onChange={e => handleResultChange(test.definitionId, e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar — report details */}
            <div className="space-y-4">
              {/* Request info */}
              <div className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-slate-400" />
                  Report Info
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Requested</p>
                      <p className="text-slate-800">{format(new Date(report.requestedAt), "MMM d, yyyy · h:mm a")}</p>
                    </div>
                  </div>

                  {report.completedAt && (
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Completed</p>
                        <p className="text-slate-800">{format(new Date(report.completedAt), "MMM d, yyyy · h:mm a")}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Requested By</p>
                      <p className="text-slate-800">{report.requestedBy || <span className="italic text-muted-foreground">—</span>}</p>
                    </div>
                  </div>

                  {report.performedBy && (
                    <div className="flex items-start gap-2.5">
                      <FlaskConical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Performed By</p>
                        <p className="text-slate-800">{report.performedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-xl border bg-white shadow-sm p-4 space-y-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Notes</h2>
                <Textarea
                  placeholder="Add notes about this report..."
                  value={notes}
                  onChange={e => handleNotesChange(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>

              {/* Status history */}
              <div className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Status</h2>
                <div className="space-y-2">
                  {(["pending", "processing", "completed"] as LabReportStatus[]).map(s => {
                    const cfg = statusConfig[s];
                    const CfgIcon = cfg.icon;
                    const steps: LabReportStatus[] = ["pending", "processing", "completed"];
                    const currentIndex = steps.indexOf(report.status);
                    const stepIndex = steps.indexOf(s);
                    const isDone = stepIndex <= currentIndex;
                    return (
                      <div key={s} className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm",
                        isDone ? cfg.className : "bg-muted/30 text-muted-foreground border border-transparent"
                      )}>
                        <CfgIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-medium">{cfg.label}</span>
                        {report.status === s && (
                          <Badge className="ml-auto text-[10px] py-0 bg-white/60 text-current border-current/30">
                            Current
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
