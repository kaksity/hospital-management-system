/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  CreditCard,
  Send,
  TrendingUp,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Info,
  Search,
  Filter,
  Eye,
  Receipt,
  User,
  Ticket,
  Archive,
  Calendar as CalendarIcon
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { SendInvoiceModal } from "@/components/Modals/SendInvoiceModal";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { PaymentDetailsModal } from "@/components/Modals/PaymentDetailsModal";
import { RecordPaymentModal } from "@/components/Modals/RecordPaymentModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormatter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export function AdminPaymentsView() {
  const [showSendInvoiceModal, setShowSendInvoiceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Mock Data
  const payments = useMemo(() => [
    {
      id: "TXN-001",
      patientId: "PAT-105",
      patientName: "John Adebayo",
      patientType: "Regular",
      totalCost: 150000,
      amountPaid: 100000,
      balance: 50000,
      status: "partial",
      date: "2024-11-15",
      invoiceNo: "INV-2024-101",
      services: [
        { name: "MRI Brain (With Contrast)", price: 150000 }
      ]
    },
    {
      id: "TXN-002",
      patientId: "PAT-211",
      patientName: "Sarah Phillips",
      patientType: "Regular",
      totalCost: 45000,
      amountPaid: 45000,
      balance: 0,
      status: "paid",
      date: "2024-12-01",
      invoiceNo: "INV-2024-102",
      services: [
        { name: "CT Scan Head", price: 45000 }
      ]
    },
    {
      id: "TXN-003",
      patientId: "PAT-094",
      patientName: "Michael Chen",
      patientType: "Regular",
      totalCost: 85000,
      amountPaid: 0,
      balance: 85000,
      status: "unpaid",
      date: "2025-01-05",
      invoiceNo: "INV-2025-001",
      services: [
        { name: "Emergency Radiology Consult", price: 35000 },
        { name: "Chest X-Ray", price: 50000 }
      ]
    },
    {
      id: "TXN-004",
      patientId: "PAT-302",
      patientName: "Elena Rodriguez",
      patientType: "Regular",
      totalCost: 250000,
      amountPaid: 250000,
      balance: 0,
      status: "paid",
      date: "2025-01-10",
      invoiceNo: "INV-2025-002",
      services: [
        { name: "MRI Spine (Lumbar)", price: 250000 }
      ]
    },
    {
      id: "TXN-005",
      patientId: "PAT-118",
      patientName: "David Wilson",
      patientType: "Regular",
      totalCost: 12000,
      amountPaid: 4000,
      balance: 8000,
      status: "partial",
      date: "2025-01-12",
      invoiceNo: "INV-2025-003",
      services: [
        { name: "Abdominal Ultrasound", price: 12000 }
      ]
    }
  ], []);

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

    // Tab filtering
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unpaid" && payment.status !== "paid") ||
      (activeTab === "paid" && payment.status === "paid");

    return matchesSearch && matchesTab && matchesStartDate && matchesEndDate;
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
      paid: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      unpaid: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleRecordPayment = (payment: any) => {
    // Mapping format for the modal
    setSelectedClient({
      id: payment.id,
      name: payment.patientName,
      balance: payment.balance,
      case: payment.patientType
    });
    setShowRecordPaymentModal(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between font-light">
        <div>
          <h1 className="text-xl font-semibold tracking-light">Payments</h1>
          <p className="text-muted-foreground text-sm">Monitor transactions and manage patient billing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={() => setShowSendInvoiceModal(true)} className="gap-2">
            <Send className="h-4 w-4" />
            Send New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Revenue", value: stats.totalRevenue, color: "bg-blue-500", trend: "+12%" },
          { label: "Collected", value: stats.collected, color: "bg-green-500", trend: "74%" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-500", trend: "26%" },
          { label: "Overdue", value: stats.overdue, color: "bg-red-500", trend: "4.6%" }
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 rounded-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className={cn("w-1.5 h-1.5 rounded-full", stat.color)} />
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight">{formatCurrency(stat.value)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>{stat.trend} from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="space-y-6">
          <TabsList variant="line" className="justify-start h-auto p-0 bg-transparent w-full gap-8 border-b border-border/50">
            <TabsTrigger
              value="all"
              variant="line"
              className="px-0 pb-3 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              All Payments
            </TabsTrigger>
            <TabsTrigger
              value="unpaid"
              variant="line"
              className="px-0 pb-3 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Unpaid
            </TabsTrigger>
            <TabsTrigger
              value="paid"
              variant="line"
              className="px-0 pb-3 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Paid
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, patients..."
                className="pl-9 h-11 border-muted-foreground/20 focus-visible:ring-primary/20"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-11 px-4 justify-start text-left font-normal gap-2 border-muted-foreground/20", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <span className="text-muted-foreground text-sm font-medium">to</span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-11 px-4 justify-start text-left font-normal gap-2 border-muted-foreground/20", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:text-foreground" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <span>{selectedIds.length} items selected</span>
              <div className="h-4 w-px bg-primary/20" />
              <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" onClick={() => setSelectedIds([])}>
                <X className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 border-primary/20 text-primary">
                <Send className="h-3.5 w-3.5 mr-1.5" /> Bulk Invoice
              </Button>
              <Button size="sm" variant="destructive" className="h-8">
                <Archive className="h-3.5 w-3.5 mr-1.5" /> Archive
              </Button>
            </div>
          </div>
        )}

        <Card className="border-none shadow-none bg-transparent">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-[40px] px-4">
                  <Checkbox
                    checked={selectedIds.length === paginatedPayments.length && paginatedPayments.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Txn ID</TableHead>
                <TableHead>Patient Details</TableHead>
                {activeTab === "unpaid" && (
                  <TableHead>Invoice No.</TableHead>
                )}
                <TableHead>Type</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0"
                  onClick={() => {
                    setSelectedClient({ ...payment, name: payment.patientName });
                    setShowPaymentDetailsModal(true);
                  }}
                >
                  <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(payment.id)}
                      onCheckedChange={() => toggleOne(payment.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                      {payment.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{payment.patientName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{payment.patientId}</span>
                    </div>
                  </TableCell>
                  {activeTab === "unpaid" && (
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono font-medium border-primary/20 bg-primary/[0.02]">
                        {payment.invoiceNo}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <span className="text-xs font-medium text-muted-foreground">{payment.patientType}</span>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{formatCurrency(payment.totalCost)}</TableCell>
                  <TableCell className="font-semibold text-sm">{formatCurrency(payment.amountPaid)}</TableCell>
                  <TableCell className="font-semibold text-sm">{formatCurrency(payment.balance)}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px] px-2 py-0.5 font-bold capitalize", getStatusBadge(payment.status))}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">{formatDate(payment.date)}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem onClick={() => handleRecordPayment(payment)}>
                          <CreditCard className="h-4 w-4 mr-2" /> Record Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedClient({ ...payment, name: payment.patientName });
                          setShowPaymentDetailsModal(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="h-4 w-4 mr-2" /> View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Archive className="h-4 w-4 mr-2" /> Archive Txn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedPayments.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">No payments found</h3>
              <p className="text-sm text-muted-foreground max-w-[300px] mt-1">
                We couldn't find any transactions for the current filter. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </Card>

        {/* Pagination Controls - Aligned with patients table */}
        {filteredPayments.length > 0 && (
          <div className="flex items-center border-t justify-between px-2 py-3">
            <div className="text-sm text-muted-foreground">
              {filteredPayments.length} results
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rows per page:</span>
              <Select
                value={`${itemsPerPage}`}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 text-sm font-medium">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Tabs>

      {/* Modals */}
      <SendInvoiceModal
        open={showSendInvoiceModal}
        onOpenChange={setShowSendInvoiceModal}
        patient={selectedClient}
        onSendInvoice={(invoiceData) => {
          console.log("Invoice data:", invoiceData);
          toast.success("Invoice sent successfully");
        }}
      />

      <PaymentDetailsModal
        open={showPaymentDetailsModal}
        onOpenChange={setShowPaymentDetailsModal}
        client={selectedClient}
      />

      <RecordPaymentModal
        open={showRecordPaymentModal}
        onOpenChange={setShowRecordPaymentModal}
        client={selectedClient}
        onRecordPayment={(data) => {
          console.log("Recorded:", data);
          toast.success(`Payment recorded successfully`);
        }}
      />
    </div>
  );
}