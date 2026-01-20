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
  Filter,
  Download,
  FileUp,
  FileDown,
  Upload,
  LayoutPanelTop
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AddPatientModal } from "@/components/Modals/AddPatientModal";

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

export default function Patients() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock patients data
  const patients = [
    {
      id: "PT-001",
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
      id: "PT-002",
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
      id: "PT-003",
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
      id: "PT-004",
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
      id: "PT-005",
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

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      patient.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
      patient.id.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

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

  const handleAddPatient = (patientData: any) => {
    console.log('Adding new patient:', patientData);
    // Handle patient creation logic
  };

  const handleRowClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and clinical information</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Import/Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem className="gap-2" onClick={() => console.log("Exporting CSV...")}>
                <FileDown className="h-4 w-4 text-muted-foreground" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => console.log("Exporting PDF...")}>
                <FileDown className="h-4 w-4 text-muted-foreground" />
                Export to PDF
              </DropdownMenuItem>
              <div className="h-px bg-muted my-1" />
              <DropdownMenuItem className="gap-2" onClick={() => console.log("Importing CSV...")}>
                <Upload className="h-4 w-4 text-muted-foreground" />
                Import from CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => navigate("/patients/create")}>
            <Plus className="h-4 w-4" />
            Add New Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Total Patients</CardDescription>
            <CardTitle className="text-2xl">{patients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Active Patients</CardDescription>
            <CardTitle className="text-2xl">
              {patients.filter(c => c.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Total Cases</CardDescription>
            <CardTitle className="text-2xl">
              {patients.reduce((sum, patient) => sum + patient.cases, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(patients.reduce((sum, patient) => sum + patient.totalValue, 0))}
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
                placeholder="Search patients..."
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
              <TableHead>Patient</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cases</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow
                key={patient.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(patient.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(patient.name))}>
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {patient.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {patient.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(patient.status)}>
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{patient.cases}</div>
                  <div className="text-sm text-muted-foreground">active cases</div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(patient.totalValue)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(patient.lastActivity)}</div>
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
                        <Link to={`/patients/${patient.id}`} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4" />
                        Edit Patient
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
        {filteredPatients.length > 0 && (
          <div className="flex items-center border-t justify-between px-2 py-3">
            <div className="text-sm text-muted-foreground">
              {filteredPatients.length} results
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

        {/* No Patients Empty State */}
        {filteredPatients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-dashed">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">No patients found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={() => { setGlobalFilter(""); setStatusFilter("all"); }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}