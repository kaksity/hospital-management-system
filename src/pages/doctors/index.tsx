"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Search,
  Filter,
  Download,
  User,
  Building2,
  Phone,
  Briefcase,
  Trash2,
  X,
  Eye,
  Archive,
  MoreHorizontal,
  Ticket
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { EmptyState } from "@/components/ui/empty-state";
import { AddEditDoctorModal } from "@/components/Modals/AddEditDoctorModal";
import { ViewDoctorModal } from "@/components/Modals/ViewDoctorModal";
import { GenerateDiscountCodesModal } from "@/components/Modals/GenerateDiscountCodesModal";

export default function Doctors() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [doctorToInteract, setDoctorToInteract] = useState<any>(null);

  // Mock doctors data
  const doctors = [
    {
      id: "DOC-204",
      name: "Dr. Adeola Williams",
      hospital: "St. Nicholas Hospital",
      phone: "+234 801 222 3333",
      marketer: "Sarah Johnson",
      status: "active",
      createdAt: "2024-11-15",
      accountName: "Adeola Williams",
      bankName: "Zenith Bank",
      accountNumber: "1234567890",
      usedCodes: 25,
      totalCodes: 40
    },
    {
      id: "DOC-311",
      name: "Dr. Chidi Obi",
      hospital: "Reddington Hospital",
      phone: "+234 802 333 4444",
      marketer: "Michael Chen",
      status: "active",
      createdAt: "2024-12-01",
      accountName: "Chidi Obi",
      bankName: "Guaranty Trust Bank (GTB)",
      accountNumber: "0987654321",
      usedCodes: 12,
      totalCodes: 20
    },
    {
      id: "DOC-105",
      name: "Dr. Fatima Musa",
      hospital: "Main Radiology Wing",
      phone: "+234 803 444 5555",
      marketer: "Sarah Johnson",
      status: "inactive",
      createdAt: "2025-01-05",
      accountName: "Fatima Musa",
      bankName: "Access Bank",
      accountNumber: "1122334455",
      usedCodes: 5,
      totalCodes: 5
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(globalFilter.toLowerCase()) ||
      doctor.id.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleAll = () => {
    if (selectedDoctors.length === filteredDoctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(filteredDoctors.map(d => d.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedDoctors(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleAddDoctor = () => {
    setDoctorToInteract(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setDoctorToInteract(doctor);
    setIsAddEditModalOpen(true);
  };

  const handleViewDoctor = (doctor: any) => {
    setDoctorToInteract(doctor);
    setIsViewModalOpen(true);
  };

  const handleGenerateCodes = (doctor: any) => {
    setDoctorToInteract(doctor);
    setIsDiscountModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-light">Referring Doctors</h1>
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold rounded-full">
              {doctors.length}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Manage medical professionals and their financial preferences.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddDoctor}>
            <Plus className="h-4 w-4" />
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-2 w-full max-w-2xl">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              className="pl-9 bg-background"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedDoctors.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              {selectedDoctors.length} doctor{selectedDoctors.length > 1 ? 's' : ''} selected
            </span>
            <div className="h-4 w-px bg-primary/20" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-primary hover:text-primary hover:bg-primary/10 gap-2"
              onClick={() => setSelectedDoctors([])}
            >
              <X className="h-3.5 w-3.5" />
              Clear Selection
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 text-primary hover:bg-primary/5">
              <Download className="h-3.5 w-3.5" />
              Export Selected
            </Button>
            <Button variant="destructive" size="sm" className="h-8 gap-2">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {filteredDoctors.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] px-4">
                <Checkbox
                  checked={selectedDoctors.length === filteredDoctors.length && filteredDoctors.length > 0}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Mobile No.</TableHead>
              <TableHead>Marketer</TableHead>
              <TableHead>Discount Codes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow
                key={doctor.id}
                className={cn(
                  "hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
                  selectedDoctors.includes(doctor.id) && "bg-primary/[0.02]"
                )}
              >
                <TableCell className="px-4">
                  <Checkbox
                    checked={selectedDoctors.includes(doctor.id)}
                    onCheckedChange={() => toggleOne(doctor.id)}
                    aria-label={`Select ${doctor.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{doctor.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{doctor.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {doctor.hospital}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {doctor.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    {doctor.marketer}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
                    <Ticket className="h-3 w-3 text-muted-foreground" />
                    {doctor.usedCodes} / {doctor.totalCodes}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(doctor.status)}>
                    {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={() => handleViewDoctor(doctor)}>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                        Edit Doctor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerateCodes(doctor)}>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        Discount Codes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Archive className="h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={User}
          title={globalFilter ? "No results found" : "No doctors registered"}
          description={
            globalFilter
              ? `We couldn't find any doctors matching "${globalFilter}". Try refining your search.`
              : "Start by registering your first referring doctor to the platform."
          }
          action={
            !globalFilter
              ? {
                label: "Add New Doctor",
                onClick: handleAddDoctor,
                icon: Plus,
              }
              : undefined
          }
        />
      )}

      {/* Modals */}
      <AddEditDoctorModal
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        doctor={doctorToInteract}
        onSuccess={(updatedDoctor) => {
          console.log("Doctor operation successful:", updatedDoctor);
        }}
      />

      <ViewDoctorModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        doctor={doctorToInteract}
      />

      <GenerateDiscountCodesModal
        open={isDiscountModalOpen}
        onOpenChange={setIsDiscountModalOpen}
        doctor={doctorToInteract}
      />
    </div>
  );
}
