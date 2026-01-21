"use client";

import { useState, useMemo } from "react";
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
    Printer
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        service: "MRI Brain"
    },
    {
        id: "INV-2024-002",
        patientName: "Sarah Phillips",
        patientId: "PAT-211",
        amount: 45000,
        status: "overdue",
        dueDate: "2024-11-18",
        issuedDate: "2024-11-10",
        service: "CT Head"
    },
    {
        id: "INV-2024-003",
        patientName: "Michael Chen",
        patientId: "PAT-094",
        amount: 85000,
        status: "pending",
        dueDate: "2024-11-25",
        issuedDate: "2024-11-20",
        service: "Radiology Consult"
    }
];

export default function Invoices() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch =
                inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab =
                activeTab === "all" ||
                (activeTab === "unpaid" && inv.status !== "paid") ||
                (activeTab === "paid" && inv.status === "paid");

            return matchesSearch && matchesTab;
        });
    }, [activeTab, searchQuery]);

    const getStatusBadge = (status: string) => {
        const variants = {
            paid: "bg-green-100 text-green-800 border-green-200",
            pending: "bg-blue-100 text-blue-800 border-blue-200",
            overdue: "bg-red-100 text-red-800 border-red-200",
        };
        return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Billing & Invoices</h1>
                    <p className="text-muted-foreground text-sm">Manage patient billing, track payments, and issue new invoices</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Receivables", value: 850000, icon: Receipt, color: "text-blue-600", bg: "bg-blue-100" },
                    { label: "Total Collected", value: 620000, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
                    { label: "Pending", value: 180000, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
                    { label: "Overdue", value: 50000, icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-card/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                                <div className={cn("p-1.5 rounded-lg", stat.bg)}>
                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold">{formatCurrency(stat.value)}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <TabsList variant="line" className="justify-start h-auto p-0 bg-transparent w-full gap-8 border-b border-border/50">
                        <TabsTrigger value="all" variant="line" className="px-0 pb-3 text-sm font-medium">All Invoices</TabsTrigger>
                        <TabsTrigger value="unpaid" variant="line" className="px-0 pb-3 text-sm font-medium">Unpaid</TabsTrigger>
                        <TabsTrigger value="paid" variant="line" className="px-0 pb-3 text-sm font-medium">Paid</TabsTrigger>
                    </TabsList>

                    <div className="relative w-full sm:max-w-xs shrink-0 mb-2 sm:mb-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID or Patient..."
                            className="pl-9 h-10 border-muted-foreground/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="border-none shadow-none bg-transparent">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50">
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Patient Details</TableHead>
                                <TableHead>Service / Item</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Issued Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((inv) => (
                                <TableRow key={inv.id} className="hover:bg-muted/50 transition-colors border-b border-border/50">
                                    <TableCell>
                                        <code className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                                            {inv.id}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{inv.patientName}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{inv.patientId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">{inv.service}</span>
                                    </TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(inv.amount)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatDate(inv.issuedDate)}</TableCell>
                                    <TableCell className="text-sm font-medium">{formatDate(inv.dueDate)}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("text-[10px] px-2 py-0.5 font-bold capitalize", getStatusBadge(inv.status))}>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[180px]">
                                                <DropdownMenuItem>
                                                    <FileText className="h-4 w-4 mr-2" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="h-4 w-4 mr-2" /> Email Patient
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Printer className="h-4 w-4 mr-2" /> Print PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <CreditCard className="h-4 w-4 mr-2" /> Record Payment
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Tabs>
        </div>
    );
}
