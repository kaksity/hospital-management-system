/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ambulance,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAmbulanceRequests } from "@/hooks/use-ambulance-requests";
import { RequestAmbulanceModal } from "@/components/Modals/RequestAmbulanceModal";
import { AmbulanceRequest, AmbulanceStatus, AmbulanceUrgency } from "@/data/ambulanceRequests";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 12;

const urgencyConfig: Record<AmbulanceUrgency, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-red-100 text-red-700 border-red-200" },
  high: { label: "High", className: "bg-orange-100 text-orange-700 border-orange-200" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low: { label: "Low", className: "bg-green-100 text-green-700 border-green-200" },
};

const statusConfig: Record<AmbulanceStatus, { label: string; className: string; icon: any }> = {
  pending: { label: "Pending", className: "bg-slate-100 text-slate-700 border-slate-200", icon: Clock },
  dispatched: { label: "Dispatched", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
  "en-route": { label: "En Route", className: "bg-purple-100 text-purple-700 border-purple-200", icon: Ambulance },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function AmbulanceRequests() {
  const { requests, addRequest, updateStatus, cancelRequest } = useAmbulanceRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Filter requests
  const filtered = requests.filter((r) => {
    const matchesSearch =
      !search ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.condition.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || r.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    active: requests.filter((r) => r.status === "dispatched" || r.status === "en-route").length,
    critical: requests.filter((r) => r.urgency === "critical").length,
  };

  const handleNewRequest = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleSubmitRequest = (data: any) => {
    addRequest(data);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-[1600px] mx-auto w-full space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">Ambulance Requests</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{counts.total} total requests</p>
              </div>
            </div>
            <Button
              onClick={handleNewRequest}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white self-start sm:self-auto"
            >
              <Ambulance className="h-4 w-4" />
              New Request
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Total Requests", value: counts.total, color: "text-slate-700" },
              { label: "Pending", value: counts.pending, color: "text-yellow-600" },
              { label: "Active (Dispatched / En Route)", value: counts.active, color: "text-blue-600" },
              { label: "Critical", value: counts.critical, color: "text-red-600" },
            ].map((s) => (
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
                placeholder="Search by patient, ID, or condition..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="en-route">En Route</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={(v) => { setUrgencyFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
                <Ambulance className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="font-semibold text-slate-800">No requests found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || statusFilter !== "all" || urgencyFilter !== "all"
                  ? "Try adjusting your filters."
                  : "No ambulance requests have been made yet."}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Request ID</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Patient</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Condition</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Urgency</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Pickup Location</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Requested</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((req) => {
                    const urgency = urgencyConfig[req.urgency];
                    const status = statusConfig[req.status];
                    const StatusIcon = status.icon;
                    return (
                      <TableRow key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <code className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {req.id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{req.patientName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{req.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-slate-700 truncate" title={req.condition}>
                            {req.condition}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs font-semibold border", urgency.className)}>
                            {urgency.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="truncate" title={req.pickupLocation}>{req.pickupLocation}</span>
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
                            <p>{format(new Date(req.requestedAt), "MMM d, yyyy")}</p>
                            <p>{format(new Date(req.requestedAt), "h:mm a")}</p>
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
                              {req.status === "pending" && (
                                <DropdownMenuItem
                                  className="gap-2 text-sm"
                                  onClick={() => updateStatus(req.id, "dispatched")}
                                >
                                  <Truck className="h-4 w-4 text-blue-500" /> Mark Dispatched
                                </DropdownMenuItem>
                              )}
                              {req.status === "dispatched" && (
                                <DropdownMenuItem
                                  className="gap-2 text-sm"
                                  onClick={() => updateStatus(req.id, "en-route")}
                                >
                                  <Ambulance className="h-4 w-4 text-purple-500" /> Mark En Route
                                </DropdownMenuItem>
                              )}
                              {req.status === "en-route" && (
                                <DropdownMenuItem
                                  className="gap-2 text-sm"
                                  onClick={() => updateStatus(req.id, "completed")}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark Completed
                                </DropdownMenuItem>
                              )}
                              {(req.status === "pending" || req.status === "dispatched") && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="gap-2 text-sm text-destructive focus:text-destructive"
                                    onClick={() => cancelRequest(req.id)}
                                  >
                                    <XCircle className="h-4 w-4" /> Cancel Request
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(req.status === "completed" || req.status === "cancelled") && (
                                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                                  No actions available
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-3">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <RequestAmbulanceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        patient={selectedPatient}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}
