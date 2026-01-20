/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { isAfter, subDays, startOfWeek, endOfWeek } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  FileDown,
  Upload,
  ReceiptText,
  Calendar,
  MessageSquare,
  Archive,
  RotateCcw,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AddPatientModal } from "@/components/Modals/AddPatientModal";

// Helper functions
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getPatientAvatarPath = (id: string, gender: string) => {
  // Use a hash of the ID to pick a deterministic but seemingly random avatar
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  if (gender.toLowerCase() === "male") {
    const index = (positiveHash % 18) + 1;
    return `/images/svgs/avatars/male/avatar-male-${index}.svg`;
  } else {
    const index = (positiveHash % 23) + 1;
    return `/images/svgs/avatars/female/avatar-female-${index}.svg`;
  }
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
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock patients data
  const patients = [
    {
      id: "CP120456A",
      name: "Alex Turner",
      dob: "1997-05-15",
      email: "alex.turner@email.com",
      phone: "+234 801 234 5678",
      country: "Nigeria",
      status: "active",
      gender: "Male",
      age: 28,
      cases: 2,
      totalValue: 27000,
      lastActivity: "2025-01-15",
      joinedDate: "2024-10-15",
      avatar: ""
    },
    {
      id: "CP238122C",
      name: "Maria Garcia",
      dob: "1991-08-22",
      email: "maria.garcia@email.com",
      phone: "+234 802 345 6789",
      country: "Nigeria",
      status: "active",
      gender: "Female",
      age: 34,
      cases: 1,
      totalValue: 18000,
      lastActivity: "2025-01-10",
      joinedDate: "2024-11-20",
      avatar: ""
    },
    {
      id: "CP349011B",
      name: "James Wilson",
      dob: "1983-11-05",
      email: "james.wilson@email.com",
      phone: "+234 803 456 7890",
      country: "Nigeria",
      status: "inactive",
      gender: "Male",
      age: 42,
      cases: 1,
      totalValue: 12000,
      lastActivity: "2024-12-05",
      joinedDate: "2024-09-10",
      avatar: ""
    },
    {
      id: "CP456789D",
      name: "Lisa Wang",
      dob: "1999-12-01",
      email: "lisa.wang@email.com",
      phone: "+234 804 567 8901",
      country: "Nigeria",
      status: "active",
      gender: "Female",
      age: 25,
      cases: 1,
      totalValue: 14000,
      lastActivity: "2025-01-08",
      joinedDate: "2024-12-01",
      avatar: ""
    },
    {
      id: "CP567890E",
      name: "David Rodriguez",
      dob: "1994-10-01",
      email: "david.rodriguez@email.com",
      phone: "+234 805 678 9012",
      country: "Nigeria",
      status: "archived",
      gender: "Male",
      age: 31,
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

    const matchesTime = () => {
      if (timeFilter === "all") return true;
      const activityDate = new Date(patient.lastActivity);
      const now = new Date();

      if (timeFilter === "this-week") {
        return activityDate >= startOfWeek(now) && activityDate <= endOfWeek(now);
      }
      if (timeFilter === "last-7-days") {
        return isAfter(activityDate, subDays(now, 7));
      }
      if (timeFilter === "last-30-days") {
        return isAfter(activityDate, subDays(now, 30));
      }
      return true;
    };

    return matchesSearch && matchesStatus && matchesTime();
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
      archived: "bg-red-100 text-red-800",
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
              <DropdownMenuItem className="gap-2" onClick={() => navigate("/patients/import")}>
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

      {/* Patients Table Section */}
      <div>
        {patients.length > 0 ? (
          <>
            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 h-10 border-muted-foreground/20 focus-visible:ring-primary/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-auto h-10 px-3 text-sm font-medium bg-background border-muted-foreground/20 gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground border-r pr-2 mr-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium tracking-light">Sort by</span>
                    </div>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-auto h-10 px-3 text-sm font-medium bg-background border-muted-foreground/20 gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground border-r pr-2 mr-1">
                      <Calendar className="h-3.5 w-3.5" />
                    </div>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Patient ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
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
                      <code className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                        {patient.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-muted shadow-sm">
                          <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                          <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(patient.name))}>
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.age} years old</div>
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
                      <div className="text-sm">{patient.gender}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(patient.lastActivity)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
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
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem asChild>
                            <Link to={`/patients/${patient.id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log("Editing Patient...")} className="flex items-center gap-2">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                            Edit Patient
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log("Sending Invoice...")} className="flex items-center gap-2">
                            <ReceiptText className="h-4 w-4 text-muted-foreground" />
                            Send Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log("Scheduling Appointment...")} className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log("Sending Message...")} className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {patient.status === 'archived' ? (
                            <DropdownMenuItem onClick={() => console.log("Unarchiving...")} className="flex items-center gap-2 text-primary">
                              <RotateCcw className="h-4 w-4" />
                              Unarchive Patient
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => console.log("Archiving...")} className="flex items-center gap-2 text-destructive">
                              <Archive className="h-4 w-4" />
                              Archive Patient
                            </DropdownMenuItem>
                          )}
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

            {/* No Patients Found during Search */}
            {filteredPatients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">No patients found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={() => { setGlobalFilter(""); setStatusFilter("all"); setTimeFilter("all"); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        ) : (
          /* System-wide Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-muted-foreground/20">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-medium mb-2">No patients in the system</h2>
            <p className="text-sm text-muted-foreground max-w-lg mb-8 text-balance">
              It appears there are no patient records in the system at the moment.
              To get started, you can add a new patient by clicking the 'Add New Patient' button below.
              If you have existing patient records to import, you can do so using our data import feature.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button size="lg" variant="outline" className="min-w-[160px] gap-2" onClick={() => navigate("/patients/import")}>
                <Upload className="h-4 w-4" />
                Import Records
              </Button>
              <Button size="lg" className="min-w-[160px] gap-2" onClick={() => navigate("/patients/create")}>
                <Plus className="h-4 w-4" />
                Add New Patient
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}