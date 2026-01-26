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
  Download,
  User,
  Building2,
  Briefcase,
  Trash2,
  X,
  Eye,
  Archive,
  MoreHorizontal,
  Ticket,
  CheckCircle2,
  Clock,
  Stethoscope,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { AddEditDoctorModal } from "@/components/Modals/AddEditDoctorModal";
import { ViewDoctorModal } from "@/components/Modals/ViewDoctorModal";
import { GenerateDiscountCodesModal } from "@/components/Modals/GenerateDiscountCodesModal";
import { doctors as initialDoctors } from "@/data/doctors";

export default function Doctors() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [doctorToInteract, setDoctorToInteract] = useState<any>(null);
  const [doctors] = useState(initialDoctors);

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

  const activeCount = doctors.filter(d => d.status === 'active').length;
  const inactiveCount = doctors.filter(d => d.status === 'inactive').length;
  const totalCodes = doctors.reduce((acc, d) => acc + d.totalCodes, 0);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Referring Doctors</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {doctors.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Manage medical professionals and their financial preferences.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 h-9 font-bold bg-white">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={handleAddDoctor} size="sm" className="gap-2 h-9 font-bold shadow-sm px-4">
                <Plus className="h-4 w-4" />
                Add New Doctor
              </Button>
            </div>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Doctors", value: doctors.length, icon: User, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Active Referral", value: activeCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Inactive", value: inactiveCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Total App Discount", value: totalCodes, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
                    <h3 className="text-lg font-bold text-slate-800 tabular-nums leading-none pt-1">{stat.value}</h3>
                  </div>
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-2">
            <div className="flex flex-1 items-center gap-3 w-full max-w-2xl">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search doctors by name, hospital or ID..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-10 bg-white border shadow-none font-semibold text-sm">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Bulk Actions Toolbar */}
        {selectedDoctors.length > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">
                {selectedDoctors.length} doctor{selectedDoctors.length > 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary hover:bg-primary/10 gap-2 px-3"
                onClick={() => setSelectedDoctors([])}
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/20 text-slate-600 hover:bg-primary/5 font-semibold">
                <Download className="h-4 w-4" />
                Export Selected
              </Button>
              <Button variant="destructive" size="sm" className="h-9 gap-2 font-bold px-4">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {filteredDoctors.length > 0 ? (
          <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent transition-none">
                  <TableHead className="w-[48px] pl-6">
                    <Checkbox
                      checked={selectedDoctors.length === filteredDoctors.length && filteredDoctors.length > 0}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                      className="border-slate-400"
                    />
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Doctor Name</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Hospital</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Mobile No.</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Marketer</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Discount Codes</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow
                    key={doctor.id}
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors group h-16 border-b last:border-0",
                      selectedDoctors.includes(doctor.id) && "bg-primary/[0.02]"
                    )}
                  >
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedDoctors.includes(doctor.id)}
                        onCheckedChange={() => toggleOne(doctor.id)}
                        aria-label={`Select ${doctor.name}`}
                        className="border-slate-400"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 border border-slate-100 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                          <Stethoscope className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-slate-800 truncate">{doctor.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{doctor.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-semibold truncate max-w-[200px]" title={doctor.hospital}>
                        <div className="p-2 bg-slate-100 border border-slate-100 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                          <Building2 className="h-4 w-4 text-slate-500" />
                        </div>
                        <span className="truncate text-slate-700">{doctor.hospital}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-slate-700">
                        {doctor.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        {doctor.marketer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Ticket className="h-3.5 w-3.5 text-slate-500" />
                        <span className="tabular-nums">{doctor.usedCodes} / {doctor.totalCodes}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className={cn("capitalize px-2 py-0.5 text-[11px] font-semibold",
                        doctor.status === 'active' ? "bg-emerald-100 text-emerald-800 border-none" : "bg-slate-100 text-slate-700 border-none"
                      )}>
                        {doctor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem onClick={() => handleViewDoctor(doctor)} className="gap-2 font-medium text-sm">
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDoctor(doctor)} className="gap-2 font-medium text-sm">
                            <Edit className="h-3.5 w-3.5 text-slate-500" />
                            Edit Doctor
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateCodes(doctor)} className="gap-2 font-medium text-sm">
                            <Ticket className="h-3.5 w-3.5 text-slate-500" />
                            Discount Codes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 gap-2 font-medium text-sm">
                            <Archive className="h-3.5 w-3.5" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-20 text-center">
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
          </div>
        )}
      </div>

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
