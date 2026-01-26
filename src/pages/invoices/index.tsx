"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  FileText,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Mail,
  Printer,
  Eye,
  ListFilter,
  ChevronDown,
  Calendar as CalendarIcon,
  X
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormatter";

const invoices = [
  {
    id: "INV-2024-001",
    patientName: "John Adebayo",
    patientId: "PAT-105",
    amount: 150000,
    status: "paid",
    dueDate: "2024-11-20",
    issuedDate: "2024-11-15",
    service: "MRI Brain",
    gender: "Male"
  },
  {
    id: "INV-2024-002",
    patientName: "Sarah Phillips",
    patientId: "PAT-211",
    amount: 45000,
    status: "overdue",
    dueDate: "2024-11-18",
    issuedDate: "2024-11-10",
    service: "CT Head",
    gender: "Female"
  },
  {
    id: "INV-2024-003",
    patientName: "Michael Chen",
    patientId: "PAT-094",
    amount: 85000,
    status: "pending",
    dueDate: "2024-11-25",
    issuedDate: "2024-11-20",
    service: "Radiology Consult",
    gender: "Male"
  }
];

export default function Invoices() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const statuses = ["paid", "pending", "overdue"];

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || inv.status === selectedStatus;

      // Date filtering
      const invDate = new Date(inv.issuedDate);
      const matchesStartDate = !startDate || invDate >= startDate;
      const matchesEndDate = !endDate || invDate <= endDate;

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [selectedStatus, searchQuery, startDate, endDate]);

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-emerald-100 text-emerald-800 border-none",
      pending: "bg-amber-100 text-amber-800 border-none",
      overdue: "bg-red-100 text-red-800 border-none",
    };
    return (
      <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-bold border", variants[status as keyof typeof variants])}>
        {status}
      </Badge>
    );
  };

  const receivables = 850000;
  const collected = 620000;
  const pending = 180000;
  const overdue = 50000;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Billing & Invoices</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {invoices.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Manage patient billing, track payments, and issue new invoices.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/invoices/create")} size="sm" className="gap-2 h-9 font-bold shadow-sm px-4">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Receivables", value: receivables, icon: Receipt, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Total Collected", value: collected, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Overdue", value: overdue, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">{stat.label}</p>
                    <h3 className="text-lg font-bold text-slate-800 tabular-nums leading-none pt-1">{formatCurrency(stat.value)}</h3>
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
                placeholder="Search invoices by ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Date Filters */}
              <div className="flex items-center gap-0 border border-input rounded-lg overflow-hidden bg-white h-10">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-semibold text-[13px] gap-2 rounded-none border-none", !startDate && "text-slate-700")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <div className="w-px h-4 bg-slate-200 shrink-0" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-semibold text-[13px] gap-2 rounded-none border-none", !endDate && "text-slate-700")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <>
                    <div className="w-px h-4 bg-slate-200 shrink-0" />
                    <Button variant="ghost" size="icon" className="h-full w-10 text-slate-400 hover:text-slate-600 rounded-none font-bold" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 px-3 text-sm font-medium bg-white border gap-2 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-700 border-r border-slate-200 pr-2 mr-1">
                      <ListFilter className="h-4 w-4" />
                      <span className="text-sm font-semibold">Filter by</span>
                    </div>
                    {selectedStatus !== "all" && (
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
                        {["all", ...statuses].map((status) => (
                          <div
                            key={status}
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-semibold capitalize",
                              selectedStatus === status && "bg-primary/5 text-primary"
                            )}
                            onClick={() => setSelectedStatus(status)}
                          >
                            {status}
                            {selectedStatus === status && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedStatus("all");
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

      {/* Main Content Area */}
      <div className="p-6">
        <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent transition-none">
                <TableHead className="pl-6 text-[11px] font-bold uppercase tracking-wider text-slate-600">Invoice ID</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Patient Details</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Service / Item</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Amount</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Issued Date</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Due Date</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors group cursor-default h-16">
                  <TableCell className="pl-6">
                    <code className="text-[11px] font-semibold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200/50">
                      {inv.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getPatientAvatarPath(inv.patientId, inv.gender)} alt={inv.patientName} />
                        <AvatarFallback className={cn("text-[12px] font-semibold text-white", getAvatarBg(inv.patientName))}>
                          {getAvatarInitials(inv.patientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-slate-800 truncate">{inv.patientName}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold">{inv.patientId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{inv.service}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 tabular-nums">{formatCurrency(inv.amount)}</TableCell>
                  <TableCell className="text-[13px] font-semibold text-slate-700">{formatDate(inv.issuedDate)}</TableCell>
                  <TableCell className="text-[13px] font-semibold text-slate-700">{formatDate(inv.dueDate)}</TableCell>
                  <TableCell>
                    {getStatusBadge(inv.status)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 font-medium text-sm"
                          onClick={() => {
                            // Map INV-xxx to TXN-xxx based on index or simple mapping for demo
                            const txnId = inv.id.replace('INV-2024-', 'TXN-').replace('INV-2025-', 'TXN-');
                            navigate(`/payments/record/${txnId}`);
                          }}
                        >
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" /> Record Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center p-8 bg-white">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border-slate-100 border">
                        <Receipt className="h-8 w-8 text-slate-200" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No invoices found</h3>
                      <p className="text-slate-400 text-sm font-medium mt-1">Try adjusting your search query or filters.</p>
                      <Button variant="outline" className="mt-6 font-bold" onClick={() => setSearchQuery("")}>Reset Dashboard</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
