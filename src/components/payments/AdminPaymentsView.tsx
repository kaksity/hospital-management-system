/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payments/AdminPaymentsView.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {  
  Download, 
  CreditCard,
  Send,
  TrendingUp,
  FileText,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Info
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { SendInvoiceModal } from "@/components/Modals/SendInvoiceModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { PaymentDetailsModal } from "@/components/Modals/PaymentDetailsModal";
import { RecordPaymentModal } from "@/components/Modals/RecordPaymentModal";

// Helper functions
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getAvatarBg = (seed: string) => {
  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-indigo-200",
    "bg-teal-200",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function AdminPaymentsView() {
  const [showSendInvoiceModal, setShowSendInvoiceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  // Admin Data
  const paymentOverview = {
    totalRevenue: 125000,
    collected: 98000,
    pending: 27000,
    overdue: 5000,
    activeClients: 24,
    averagePaymentTime: 7.2
  };

  const clients = [
    {
      id: "PAY-001",
      clientId: "CL-001",
      name: "Alex Turner",
      case: "O-1A Visa",
      totalFee: 15000,
      paid: 10000,
      balance: 5000,
      nextPaymentDue: "2025-12-15",
      status: "active",
      lastPayment: "2025-11-01",
      paymentPlan: [
        { name: "Initial Retainer", amount: 5000, status: "paid", date: "2024-01-05" },
        { name: "Document Review", amount: 3000, status: "paid", date: "2024-01-20" },
        { name: "Filing Preparation", amount: 2000, status: "paid", date: "2024-02-01" },
        { name: "USCIS Filing", amount: 5000, status: "pending", dueDate: "2025-03-15" }
      ]
    },
    {
      id: "PAY-002",
      clientId: "CL-002",
      name: "Maria Garcia",
      case: "EB-1A Visa",
      totalFee: 18000,
      paid: 6000,
      balance: 12000,
      nextPaymentDue: "2025-12-01",
      status: "active",
      lastPayment: "2025-08-15",
      paymentPlan: [
        { name: "Initial Retainer", amount: 6000, status: "paid", date: "2024-08-15" },
        { name: "Evidence Compilation", amount: 6000, status: "pending", dueDate: "2024-12-01" },
        { name: "Filing & Review", amount: 6000, status: "pending", dueDate: "2025-02-01" }
      ]
    },
    {
      id: "PAY-003",
      clientId: "CL-003",
      name: "James Wilson",
      case: "O-1B Visa",
      totalFee: 12000,
      paid: 12000,
      balance: 0,
      nextPaymentDue: null,
      status: "completed",
      lastPayment: "2024-09-10",
      paymentPlan: [
        { name: "Initial Retainer", amount: 4000, status: "paid", date: "2024-07-01" },
        { name: "Portfolio Review", amount: 4000, status: "paid", date: "2024-08-15" },
        { name: "Final Filing", amount: 4000, status: "paid", date: "2024-09-10" }
      ]
    },
    {
      id: "PAY-004",
      clientId: "CL-004",
      name: "Lisa Wang",
      case: "EB-2 NIW",
      totalFee: 14000,
      paid: 7000,
      balance: 7000,
      nextPaymentDue: "2024-11-20",
      status: "overdue",
      lastPayment: "2024-06-30",
      paymentPlan: [
        { name: "Initial Retainer", amount: 7000, status: "paid", date: "2024-06-30" },
        { name: "Case Preparation", amount: 7000, status: "overdue", dueDate: "2024-10-20" }
      ]
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      client.case.toLowerCase().includes(globalFilter.toLowerCase()) ||
      client.id.toLowerCase().includes(globalFilter.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleSendInvoice = (client: any) => {
    setSelectedClient(client);
    setShowSendInvoiceModal(true);
  };

  const handleViewPaymentDetails = (client: any) => {
    setSelectedClient(client);
    setShowPaymentDetailsModal(true);
  };

  const handleRecordPayment = (client: any) => {
    setSelectedClient(client);
    setShowRecordPaymentModal(true);
  };

  const handleRecordPaymentSubmit = (paymentData: any) => {
    console.log('Recording payment:', paymentData);
    toast.success(`Payment of ${formatCurrency(paymentData.amount)} recorded successfully`);
  };

  const toggleRowSelection = (clientId: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const toggleAllRows = () => {
    if (Object.keys(selectedRows).length === paginatedClients.length) {
      setSelectedRows({});
    } else {
      const allSelected: Record<string, boolean> = {};
      paginatedClients.forEach(client => {
        allSelected[client.id] = true;
      });
      setSelectedRows(allSelected);
    }
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage payments and send invoices to clients</p>
        </div>
        {/* <Button>
          <TrendingUp className="h-4 w-4" />
          Payment Report
        </Button> */}
      </div>

      {/* Admin Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <CardDescription className="flex items-center gap-1">
                Total Revenue
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>12% increase from last month</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </div>
            <CardTitle className="text-2xl">{formatCurrency(paymentOverview.totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <CardDescription className="flex items-center gap-1">
                Collected
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>78% collection rate this quarter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </div>
            <CardTitle className="text-2xl">{formatCurrency(paymentOverview.collected)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <CardDescription className="flex items-center gap-1">
                Pending
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average 7.2 days to payment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </div>
            <CardTitle className="text-2xl">{formatCurrency(paymentOverview.pending)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <CardDescription className="flex items-center gap-1">
                Overdue
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>3 clients require follow-up</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </div>
            <CardTitle className="text-2xl">{formatCurrency(paymentOverview.overdue)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Client Payments Table */}
      <div>
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search clients..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedCount > 0 && (
          <div className="flex items-center justify-between bg-muted/40 border rounded-md px-3 py-2 mb-4">
            <div className="text-sm text-muted-foreground">
              {selectedCount} payment{selectedCount > 1 ? 's' : ''} selected
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-1" />
                Send Bulk Invoices
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRows({})}>
                <X className="w-4 h-4 text-red-600" />
                Clear
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCount === paginatedClients.length && paginatedClients.length > 0}
                  onCheckedChange={toggleAllRows}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Total Fee</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-transparent transition-colors">
                <TableCell>
                  <Checkbox
                    checked={selectedRows[client.id] || false}
                    onCheckedChange={() => toggleRowSelection(client.id)}
                    aria-label="Select row"
                  />
                </TableCell>
                <TableCell className="font-medium">{client.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(client.name))}>
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">{client.clientId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.case}</TableCell>
                <TableCell className="font-medium">{formatCurrency(client.totalFee)}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(client.paid)}
                </TableCell>
                <TableCell>
                  {client.nextPaymentDue ? (
                    <div className="flex items-center gap-2">
                      <span>{formatDate(client.nextPaymentDue)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Completed</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(client.status)}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {client.status !== 'completed' && (
                        <DropdownMenuItem onClick={() => handleSendInvoice(client)}>
                          <Send className="h-4 w-4" />
                          Send Invoice
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleViewPaymentDetails(client)}>
                        <FileText className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4" />
                        Download Report
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRecordPayment(client)}>
                        <CreditCard className="h-4 w-4" />
                        Record Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredClients.length > 0 && (
          <div className="flex items-center border-t justify-between px-2 py-3">
            <div className="text-sm text-muted-foreground">
              {filteredClients.length} results
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
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

        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No clients found matching your criteria.
          </div>
        )}
      </div>

      {/* Send Invoice Modal */}
      <SendInvoiceModal
        open={showSendInvoiceModal}
        onOpenChange={setShowSendInvoiceModal}
        client={selectedClient}
        onSendInvoice={(amount, dueDate) => {
          console.log('Sending invoice:', { amount, dueDate, client: selectedClient });
          // Handle invoice sending logic
        }}
      />

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        open={showPaymentDetailsModal}
        onOpenChange={setShowPaymentDetailsModal}
        client={selectedClient}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        open={showRecordPaymentModal}
        onOpenChange={setShowRecordPaymentModal}
        client={selectedClient}
        onRecordPayment={handleRecordPaymentSubmit}
      />
    </div>
  );
}