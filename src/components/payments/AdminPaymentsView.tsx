/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  CreditCard,
  Send,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Search,
  Eye,
  Receipt,
  Archive,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  ListFilter,
  ChevronDown
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { PaymentDetailsModal } from "@/components/Modals/PaymentDetailsModal";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormatter";
import { payments } from "@/data/payments";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

export function AdminPaymentsView() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  // Mock Data is now imported from @/data/payments

  const stats = {
    totalRevenue: 542000,
    collected: 399000,
    pending: 143000,
    overdue: 25000
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(globalFilter.toLowerCase()) ||
      payment.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
      payment.patientId.toLowerCase().includes(globalFilter.toLowerCase());

    // Date filtering
    const paymentDate = new Date(payment.date);
    const matchesStartDate = !startDate || paymentDate >= startDate;
    const matchesEndDate = !endDate || paymentDate <= endDate;

    // Status filtering
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unpaid" && payment.status !== "paid") ||
      (statusFilter === "paid" && payment.status === "paid");

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  // Table Logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const toggleAll = () => {
    if (selectedIds.length === paginatedPayments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedPayments.map(p => p.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-emerald-100 text-emerald-800 border-none",
      partial: "bg-amber-100 text-amber-800 border-none",
      unpaid: "bg-red-100 text-red-800 border-none",
    };
    return (
      <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-bold border", variants[status as keyof typeof variants])}>
        {status}
      </Badge>
    );
  };

  const handleRecordPayment = (payment: any) => {
    navigate(`/payments/record/${payment.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Payments & Transactions</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {payments.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Monitor transactions and manage patient billing across the facility.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 h-9 font-bold bg-white">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Revenue", value: stats.totalRevenue, trend: "+12%", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Collected", value: stats.collected, trend: "74%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending", value: stats.pending, trend: "26%", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Overdue", value: stats.overdue, trend: "4.6%", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">{stat.label}</p>
                    <div className="flex items-end gap-2 pt-1">
                      <h3 className="text-lg font-bold text-slate-800 tabular-nums leading-none">{formatCurrency(stat.value)}</h3>
                      <span className="text-[10px] font-bold text-slate-400 leading-none mb-0.5">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Filters Area */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search patients, TXN ID or invoice..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-0 border border-input rounded-lg overflow-hidden bg-white h-10">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-full px-4 justify-start text-left font-semibold text-sm gap-2 rounded-none border-none", !startDate && "text-slate-600")}>
                      <CalendarIcon className="h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <div className="w-px h-4 bg-slate-200 shrink-0" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-full px-4 justify-start text-left font-semibold text-sm gap-2 bg-white rounded-none border-none", !endDate && "text-slate-600")}>
                      <CalendarIcon className="h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
                {(startDate || endDate) && (
                  <>
                    <div className="w-px h-4 bg-slate-200 shrink-0" />
                    <Button variant="ghost" size="icon" className="h-full w-10 text-slate-400 hover:text-slate-600 rounded-none" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 px-3 text-sm font-medium bg-white border gap-2 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-700 border-r border-slate-200 pr-2 mr-1">
                      <ListFilter className="h-4 w-4" />
                      <span className="text-sm font-semibold">Filter by</span>
                    </div>
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="mr-1 h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-bold">
                        1
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] p-2">
                  <div className="space-y-4 p-2">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Status</p>
                      <div className="flex flex-col gap-1">
                        {["all", "unpaid", "paid"].map((status) => (
                          <div
                            key={status}
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-semibold capitalize",
                              statusFilter === status && "bg-primary/5 text-primary"
                            )}
                            onClick={() => setStatusFilter(status)}
                          >
                            {status}
                            {statusFilter === status && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setStatusFilter("all");
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                    >
                      <X className="h-3.5 w-3.5 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4 text-sm font-bold text-primary">
              <span>{selectedIds.length} payments selected</span>
              <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary hover:bg-primary/10 gap-2 px-3" onClick={() => setSelectedIds([])}>
                <X className="h-3.5 w-3.5" /> Clear
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="h-9 gap-2 border-primary/20 text-primary font-bold">
                <Send className="h-4 w-4" /> Bulk Invoice
              </Button>
              <Button size="sm" variant="destructive" className="h-9 gap-2 font-bold px-4">
                <Archive className="h-4 w-4" /> Archive
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent transition-none">
                <TableHead className="w-[48px] pl-6">
                  <Checkbox
                    checked={selectedIds.length === paginatedPayments.length && paginatedPayments.length > 0}
                    onCheckedChange={toggleAll}
                    className="border-slate-400"
                  />
                </TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Txn ID</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Patient Details</TableHead>
                {statusFilter === "unpaid" && (
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Invoice No.</TableHead>
                )}
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Type</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Account Code</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Method</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Cost</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Status</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className={cn(
                    "hover:bg-slate-50/50 cursor-pointer transition-colors group h-16 border-b last:border-0",
                    selectedIds.includes(payment.id) && "bg-primary/[0.02]"
                  )}
                  onClick={() => {
                    setSelectedClient({ ...payment, name: payment.patientName });
                    setShowPaymentDetailsModal(true);
                  }}
                >
                  <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(payment.id)}
                      onCheckedChange={() => toggleOne(payment.id)}
                      className="border-slate-400"
                    />
                  </TableCell>
                  <TableCell>
                    <code className="text-[11px] font-semibold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200/50">
                      {payment.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage src={getPatientAvatarPath(payment.patientId, (payment as any).gender)} alt={payment.patientName} />
                        <AvatarFallback className={cn("text-[10px] font-bold text-slate-600", getAvatarBg(payment.patientName))}>
                          {getAvatarInitials(payment.patientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-slate-800 truncate">{payment.patientName}</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{payment.patientId}</span>
                      </div>
                    </div>
                  </TableCell>
                  {statusFilter === "unpaid" && (
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold font-mono border-slate-100 bg-slate-50 text-slate-600">
                        {payment.invoiceNo}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold bg-slate-50 text-slate-500 border-slate-200 py-0 h-6">
                      {payment.patientType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-[11px] font-semibold text-primary bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100">
                      {(payment as any).accountCode || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-semibold text-slate-700">{(payment as any).method || "N/A"}</span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 tabular-nums">{formatCurrency(payment.totalCost)}</TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="text-[13px] font-semibold text-slate-600 whitespace-nowrap">{formatDate(payment.date)}</TableCell>
                  <TableCell className="pr-6" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        {payment.status !== 'paid' && (
                          <DropdownMenuItem className="gap-2 font-medium text-sm" onClick={() => handleRecordPayment(payment)}>
                            <CreditCard className="h-3.5 w-3.5 text-slate-500" /> Record Payment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 font-medium text-sm" onClick={() => {
                          setSelectedClient({ ...payment, name: payment.patientName });
                          setShowPaymentDetailsModal(true);
                        }}>
                          <Eye className="h-3.5 w-3.5 text-slate-500" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <Receipt className="h-3.5 w-3.5 text-slate-500" /> View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 gap-2 font-medium text-sm">
                          <Archive className="h-3.5 w-3.5" /> Archive Txn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedPayments.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <Receipt className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No payments found</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">
                We couldn't find any transactions for the current filter.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredPayments.length > 15 && (
          <div className="flex items-center justify-between px-2 py-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden lg:flex bg-white shadow-sm border-slate-200"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white shadow-sm border-slate-200"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-[13px] font-bold text-slate-700 px-3 whitespace-nowrap">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white shadow-sm border-slate-200"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden lg:flex bg-white shadow-sm border-slate-200"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm text-center">
                Showing <span className="text-slate-800">{startIndex + 1}</span> - <span className="text-slate-800">{Math.min(startIndex + itemsPerPage, filteredPayments.length)}</span> of <span className="text-slate-800">{filteredPayments.length}</span> Entries
              </div>

              <div className="flex items-center gap-3 bg-white p-1 pl-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter text-[10px]">Show</span>
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[60px] h-7 border-none shadow-none font-bold text-xs ring-0 focus:ring-0">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs font-bold">
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PaymentDetailsModal
        open={showPaymentDetailsModal}
        onOpenChange={setShowPaymentDetailsModal}
        client={selectedClient}
        onRecordPayment={(client) => {
          setShowPaymentDetailsModal(false);
          navigate(`/payments/record/${client.id}`);
        }}
      />
    </div>
  );
}