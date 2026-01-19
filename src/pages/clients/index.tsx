/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AddClientModal } from "@/components/Modals/AddClientModal";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function Clients() {
  const navigate = useNavigate();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock clients data
  const clients = [
    {
      id: "CL-001",
      name: "Alex Turner",
      email: "alex.turner@email.com",
      phone: "+1 (555) 123-4567",
      country: "United Kingdom",
      status: "active",
      cases: 2,
      totalValue: 27000,
      lastActivity: "2025-01-15",
      joinedDate: "2024-10-15",
      avatar: ""
    },
    {
      id: "CL-002",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1 (555) 234-5678",
      country: "Spain",
      status: "active",
      cases: 1,
      totalValue: 18000,
      lastActivity: "2025-01-10",
      joinedDate: "2024-11-20",
      avatar: ""
    },
    {
      id: "CL-003",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 345-6789",
      country: "United States",
      status: "completed",
      cases: 1,
      totalValue: 12000,
      lastActivity: "2024-12-05",
      joinedDate: "2024-09-10",
      avatar: ""
    },
    {
      id: "CL-004",
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      phone: "+1 (555) 456-7890",
      country: "China",
      status: "active",
      cases: 1,
      totalValue: 14000,
      lastActivity: "2025-01-08",
      joinedDate: "2024-12-01",
      avatar: ""
    },
    {
      id: "CL-005",
      name: "David Rodriguez",
      email: "david.rodriguez@email.com",
      phone: "+1 (555) 567-8901",
      country: "Mexico",
      status: "inactive",
      cases: 0,
      totalValue: 0,
      lastActivity: "2024-11-15",
      joinedDate: "2024-10-01",
      avatar: ""
    }
  ];

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      client.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
      client.id.toLowerCase().includes(globalFilter.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleAddClient = (clientData: any) => {
    console.log('Adding new client:', clientData);
    // Handle client creation logic
  };

  const handleRowClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and information</p>
        </div>
        <Button onClick={() => setShowAddClientModal(true)}>
          <Plus className="h-4 w-4" />
          Add New Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Total Clients</CardDescription>
            <CardTitle className="text-2xl">{clients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Active Clients</CardDescription>
            <CardTitle className="text-2xl">
              {clients.filter(c => c.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Total Cases</CardDescription>
            <CardTitle className="text-2xl">
              {clients.reduce((sum, client) => sum + client.cases, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(clients.reduce((sum, client) => sum + client.totalValue, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Clients Table */}
      <div>
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cases</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client) => (
              <TableRow 
                key={client.id} 
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(client.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(client.name))}>
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(client.status)}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{client.cases}</div>
                  <div className="text-sm text-muted-foreground">active cases</div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(client.totalValue)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(client.lastActivity)}</div>
                </TableCell>
                <TableCell 
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/clients/${client.id}`} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4" />
                        Send Email
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

      {/* Add Client Modal */}
      <AddClientModal
        open={showAddClientModal}
        onOpenChange={setShowAddClientModal}
        onAddClient={handleAddClient}
      />
    </div>
  );
}