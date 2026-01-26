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
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Search,
  Download,
  Building2,
  MapPin,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Scan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { EmptyState } from "@/components/ui/empty-state";
import { AddEditHospitalModal } from "@/components/Modals/AddEditHospitalModal";
import { hospitals as initialHospitals } from "@/data/hospitals";

export default function Hospitals() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [hospitalToEdit, setHospitalToEdit] = useState<any>(null);
  const [hospitals] = useState(initialHospitals);

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

  const activeCount = hospitals.filter(h => h.status === 'active').length;
  const inactiveCount = hospitals.filter(h => h.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Hospitals & Facilities</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {hospitals.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Manage the list of hospitals and facilities in the network.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddHospital} size="sm" className="h-9 font-medium px-4">
                <Plus className="h-4 w-4" />
                Add Hospital
              </Button>
            </div>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Facilities", value: hospitals.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Active Nodes", value: activeCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Inactive", value: inactiveCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Network Coverage", value: "94%", icon: Scan, color: "text-indigo-600", bg: "bg-indigo-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">{stat.label}</p>
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
                  placeholder="Search hospitals by name or code..."
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
        {selectedHospitals.length > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-primary">
                {selectedHospitals.length} hospital{selectedHospitals.length > 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary hover:bg-primary/10 gap-2 px-3"
                onClick={() => setSelectedHospitals([])}
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/20 text-primary hover:bg-primary/5 font-bold">
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

        {filteredHospitals.length > 0 ? (
          <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent transition-none">
                  <TableHead className="w-[48px] pl-6">
                    <Checkbox
                      checked={selectedHospitals.length === filteredHospitals.length && filteredHospitals.length > 0}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                      className="border-slate-400"
                    />
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Account Code</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Hospital Name</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Location</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Status</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Date Registered</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHospitals.map((hospital) => (
                  <TableRow
                    key={hospital.id}
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors group h-16 border-b last:border-0",
                      selectedHospitals.includes(hospital.id) && "bg-primary/[0.02]"
                    )}
                  >
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedHospitals.includes(hospital.id)}
                        onCheckedChange={() => toggleOne(hospital.id)}
                        aria-label={`Select ${hospital.name}`}
                        className="border-slate-400"
                      />
                    </TableCell>
                    <TableCell>
                      <code className="text-[11px] font-semibold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200/50">
                        {hospital.accountCode}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 border border-slate-100 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                          <Building2 className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-slate-800 truncate">{hospital.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{hospital.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 truncate max-w-[250px]" title={hospital.location}>
                        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-40" />
                        <span className="truncate">{hospital.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-bold border",
                        hospital.status === 'active' ? "bg-emerald-100 text-emerald-800 border-none" : "bg-slate-100 text-slate-700 border-none"
                      )}>
                        {hospital.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[13px] font-semibold text-slate-700">
                      {formatDate(hospital.createdAt)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => handleEditHospital(hospital)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-20">
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
          </div>
        )}
      </div>

      <AddEditHospitalModal
        open={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        hospital={hospitalToEdit}
        onSuccess={(updatedHospital) => {
          console.log("Hospital operation successful:", updatedHospital);
        }}
      />
    </div>
  );
}
