/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Building2,
  MapPin,
  Trash2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { EmptyState } from "@/components/ui/empty-state";
import { AddEditHospitalModal } from "@/components/Modals/AddEditHospitalModal";

export default function Hospitals() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [hospitalToEdit, setHospitalToEdit] = useState<any>(null);

  // Mock hospitals data
  const hospitals = [
    {
      id: "HOS-001",
      accountCode: "ACC-9921",
      name: "Main Radiology Wing",
      location: "6 Babtunde Street, Lagos, Nigeria",
      status: "active",
      createdAt: "2024-05-15",
    },
    {
      id: "HOS-002",
      accountCode: "ACC-8842",
      name: "St. Nicholas Hospital",
      location: "57 Campbell Street, Lagos Island, Lagos",
      status: "active",
      createdAt: "2024-06-20",
    },
    {
      id: "HOS-003",
      accountCode: "ACC-7753",
      name: "Reddington Hospital",
      location: "39 Isaac John Street, Ikeja, Lagos",
      status: "inactive",
      createdAt: "2024-07-10",
    },
    {
      id: "HOS-004",
      accountCode: "ACC-6634",
      name: "Lagos University Teaching Hospital",
      location: "Idi-Araba, Lagos",
      status: "active",
      createdAt: "2024-08-05",
    },
  ];

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      hospital.accountCode.toLowerCase().includes(globalFilter.toLowerCase()) ||
      hospital.id.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesStatus = statusFilter === "all" || hospital.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleAll = () => {
    if (selectedHospitals.length === filteredHospitals.length) {
      setSelectedHospitals([]);
    } else {
      setSelectedHospitals(filteredHospitals.map(h => h.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedHospitals(prev =>
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

  const handleAddHospital = () => {
    setHospitalToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditHospital = (hospital: any) => {
    setHospitalToEdit(hospital);
    setIsAddEditModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Hospitals</h1>
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold rounded-full">
              {hospitals.length}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Manage the list of hospitals and facilities in the network.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddHospital}>
            <Plus className="h-4 w-4" />
            Add Hospital
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-2 w-full max-w-2xl">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
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
      {selectedHospitals.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              {selectedHospitals.length} hospital{selectedHospitals.length > 1 ? 's' : ''} selected
            </span>
            <div className="h-4 w-px bg-primary/20" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-primary hover:text-primary hover:bg-primary/10 gap-2"
              onClick={() => setSelectedHospitals([])}
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
      {filteredHospitals.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] px-4">
                <Checkbox
                  checked={selectedHospitals.length === filteredHospitals.length && filteredHospitals.length > 0}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[150px]">Account Code</TableHead>
              <TableHead>Hospital Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Registered</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHospitals.map((hospital) => (
              <TableRow
                key={hospital.id}
                className={cn(
                  "hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
                  selectedHospitals.includes(hospital.id) && "bg-primary/[0.02]"
                )}
              >
                <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedHospitals.includes(hospital.id)}
                    onCheckedChange={() => toggleOne(hospital.id)}
                    aria-label={`Select ${hospital.name}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold">{hospital.accountCode}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{hospital.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{hospital.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground truncate max-w-[250px]" title={hospital.location}>
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{hospital.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(hospital.status)}>
                    {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    {formatDate(hospital.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="link" onClick={() => handleEditHospital(hospital)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={Building2}
          title={globalFilter ? "No results found" : "No hospitals registered"}
          description={
            globalFilter
              ? `We couldn't find any hospitals matching "${globalFilter}". Try refining your search.`
              : "Start by adding your first hospital facility to the platform."
          }
          action={
            !globalFilter
              ? {
                label: "Add Hospital",
                onClick: handleAddHospital,
                icon: Plus,
              }
              : undefined
          }
        />
      )}

      {/* Add/Edit Hospital Modal */}
      <AddEditHospitalModal
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        hospital={hospitalToEdit}
        onSuccess={(updatedHospital) => {
          console.log("Hospital operation successful:", updatedHospital);
          // In a real app, this would trigger a refetch or state update
        }}
      />
    </div>
  );
}
