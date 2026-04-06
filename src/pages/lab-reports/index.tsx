/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  FlaskConical, Search, Plus, MoreHorizontal, CheckCircle2, Clock, Loader2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, X, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LabReportStatus, LabTestItem, TEST_CATEGORIES } from "@/data/labReports";
import { patients as allPatients } from "@/data/patients";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { useLabCatalog } from "@/hooks/use-lab-catalog";
import { useLabReports } from "@/hooks/use-lab-reports";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const statusConfig: Record<LabReportStatus, { label: string; className: string; icon: any }> = {
  pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700 border-blue-200",      icon: Loader2 },
  completed:  { label: "Completed",  className: "bg-green-100 text-green-700 border-green-200",   icon: CheckCircle2 },
};

interface FormState {
  patientSearch: string;
  selectedPatient: any;
  patientDropdownOpen: boolean;
  testSearch: string;
  testDropdownOpen: boolean;
  selectedTests: LabTestItem[];
  requestedBy: string;
  notes: string;
}

const emptyForm: FormState = {
  patientSearch: "",
  selectedPatient: null,
  patientDropdownOpen: false,
  testSearch: "",
  testDropdownOpen: false,
  selectedTests: [],
  requestedBy: "",
  notes: "",
};

export default function LabReports() {
  const { reports, addReport, updateStatus } = useLabReports();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { catalog } = useLabCatalog();

  const filtered = reports.filter(r => {
    const matchesSearch =
      !search ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.tests.some(t => t.testName.toLowerCase().includes(search.toLowerCase())) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || r.tests.some(t => t.testCategory === categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    processing: reports.filter(r => r.status === "processing").length,
    completed: reports.filter(r => r.status === "completed").length,
  };

  const filteredPatients = allPatients.filter(p => {
    const q = form.patientSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const selectedIds = new Set(form.selectedTests.map(t => t.definitionId));
  const filteredCatalog = catalog.filter(t => {
    if (selectedIds.has(t.id)) return false;
    const q = form.testSearch.toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  const handleAddTest = (def: typeof catalog[0]) => {
    setForm(f => ({
      ...f,
      testSearch: "",
      testDropdownOpen: false,
      selectedTests: [
        ...f.selectedTests,
        {
          definitionId: def.id,
          testName: def.name,
          testCategory: def.category,
          result: "",
          unit: def.unit,
          referenceRange: def.referenceRange,
        },
      ],
    }));
  };

  const handleRemoveTest = (definitionId: string) => {
    setForm(f => ({ ...f, selectedTests: f.selectedTests.filter(t => t.definitionId !== definitionId) }));
  };

  const handleTestResultChange = (definitionId: string, result: string) => {
    setForm(f => ({
      ...f,
      selectedTests: f.selectedTests.map(t =>
        t.definitionId === definitionId ? { ...t, result } : t
      ),
    }));
  };


  const handleOpenModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const isFormValid = form.selectedPatient && form.selectedTests.length > 0 && form.requestedBy.trim();

  const handleSubmit = () => {
    if (!isFormValid) return;
    addReport({
      patientId: form.selectedPatient.id,
      patientName: form.selectedPatient.name,
      patientGender: form.selectedPatient.gender,
      tests: form.selectedTests,
      status: "pending",
      requestedBy: form.requestedBy.trim(),
      performedBy: "Laboratory Services",
      requestedAt: new Date().toISOString(),
      notes: form.notes.trim(),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-[1600px] mx-auto w-full space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">Lab Reports</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{counts.total} total reports</p>
              </div>
            </div>
            <Button onClick={handleOpenModal} className="gap-2 self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              Add Lab Report
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Total",      value: counts.total,      color: "text-slate-700"  },
              { label: "Pending",    value: counts.pending,    color: "text-yellow-600" },
              { label: "Processing", value: counts.processing, color: "text-blue-600"   },
              { label: "Completed",  value: counts.completed,  color: "text-green-600"  },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1.5">
                <span className={cn("text-sm font-bold", s.color)}>{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, test, or ID..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TEST_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-6 py-6 bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto w-full">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <FlaskConical className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="font-semibold text-slate-800">No lab reports found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters."
                  : "No lab reports have been added yet."}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Report ID</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Patient</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Tests</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Requested</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(report => {
                    const status = statusConfig[report.status];
                    const StatusIcon = status.icon;
                    const testNames = report.tests.map(t => t.testName).join(", ");
                    return (
                      <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <code className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {report.id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{report.patientName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{report.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[280px]">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {report.tests.length} {report.tests.length === 1 ? "test" : "tests"}
                            </Badge>
                            <span className="text-xs text-slate-500 truncate" title={testNames}>
                              {testNames}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs font-semibold border gap-1.5", status.className)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            <p>{format(new Date(report.requestedAt), "MMM d, yyyy")}</p>
                            <p className="text-slate-400">{report.requestedBy}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuItem className="gap-2 text-sm" onClick={() => navigate(`/lab-reports/${report.id}`)}>
                                <Eye className="h-4 w-4 text-muted-foreground" /> View Details
                              </DropdownMenuItem>
                              {report.status !== "completed" && (
                                <DropdownMenuSeparator />
                              )}
                              {report.status === "pending" && (
                                <DropdownMenuItem className="gap-2 text-sm" onClick={() => updateStatus(report.id, "processing")}>
                                  <Loader2 className="h-4 w-4 text-blue-500" /> Mark Processing
                                </DropdownMenuItem>
                              )}
                              {report.status === "processing" && (
                                <DropdownMenuItem className="gap-2 text-sm" onClick={() => updateStatus(report.id, "completed")}>
                                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark Completed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm px-3">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Report Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FlaskConical className="h-4 w-4 text-blue-600" />
              </div>
              Add Lab Report
            </DialogTitle>
            <DialogDescription>
              Select a patient and add one or more tests from the catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* Patient picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-semibold">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Patient <span className="text-red-500">*</span>
              </Label>
              {form.selectedPatient ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                  <Avatar className="h-9 w-9 border border-muted shadow-sm">
                    <AvatarImage src={getPatientAvatarPath(form.selectedPatient.id, form.selectedPatient.gender)} alt={form.selectedPatient.name} />
                    <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(form.selectedPatient.name))}>
                      {getAvatarInitials(form.selectedPatient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{form.selectedPatient.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{form.selectedPatient.id}</p>
                  </div>
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 text-muted-foreground shrink-0"
                    onClick={() => setForm(f => ({ ...f, selectedPatient: null, patientSearch: "" }))}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={form.patientSearch}
                    onChange={e => setForm(f => ({ ...f, patientSearch: e.target.value, patientDropdownOpen: true }))}
                    onFocus={() => setForm(f => ({ ...f, patientDropdownOpen: true }))}
                    className="pl-9"
                  />
                  {form.patientDropdownOpen && form.patientSearch && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
                      <ScrollArea className="max-h-[200px]">
                        {filteredPatients.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No patients found</p>
                        ) : filteredPatients.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left border-b last:border-none"
                            onMouseDown={e => {
                              e.preventDefault();
                              setForm(f => ({ ...f, selectedPatient: p, patientSearch: "", patientDropdownOpen: false }));
                            }}
                          >
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={getPatientAvatarPath(p.id, p.gender)} alt={p.name} />
                              <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(p.name))}>
                                {getAvatarInitials(p.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{p.id}</p>
                            </div>
                          </button>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tests section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-1.5 text-sm font-semibold">
                <FlaskConical className="h-3.5 w-3.5 text-muted-foreground" />
                Tests <span className="text-red-500">*</span>
                {form.selectedTests.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{form.selectedTests.length} added</Badge>
                )}
              </Label>

              {/* Test search picker */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search catalog to add tests..."
                  value={form.testSearch}
                  onChange={e => setForm(f => ({ ...f, testSearch: e.target.value, testDropdownOpen: true }))}
                  onFocus={() => setForm(f => ({ ...f, testDropdownOpen: true }))}
                  className="pl-9"
                />
                {form.testDropdownOpen && form.testSearch && filteredCatalog.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
                    <ScrollArea className="max-h-[200px]">
                      {filteredCatalog.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left border-b last:border-none"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleAddTest(t);
                          }}
                        >
                          <FlaskConical className="h-4 w-4 text-blue-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{t.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {t.category}{t.unit ? ` · ${t.unit}` : ""}
                            </p>
                          </div>
                          <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </ScrollArea>
                  </div>
                )}
                {form.testDropdownOpen && form.testSearch && filteredCatalog.length === 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
                    <p className="text-sm text-muted-foreground text-center py-4">No tests found</p>
                  </div>
                )}
              </div>

              {/* Added tests list */}
              {form.selectedTests.length > 0 && (
                <div className="space-y-2">
                  {form.selectedTests.map(test => (
                    <div key={test.definitionId} className="rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FlaskConical className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{test.testName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Badge variant="outline" className="text-xs py-0">{test.testCategory}</Badge>
                              {test.unit && <span className="text-xs text-muted-foreground">{test.unit}</span>}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost" size="icon"
                          className="h-6 w-6 text-muted-foreground shrink-0"
                          onClick={() => handleRemoveTest(test.definitionId)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Result (optional — can be filled in later)"
                        value={test.result}
                        onChange={e => handleTestResultChange(test.definitionId, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requested By */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Requested By <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. Dr. Sarah Johnson"
                value={form.requestedBy}
                onChange={e => setForm(f => ({ ...f, requestedBy: e.target.value }))}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Notes</Label>
              <Textarea
                placeholder="Any additional notes..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isFormValid} className="gap-2 min-w-[130px]">
              <FlaskConical className="h-4 w-4" />
              Add Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
