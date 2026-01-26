"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  Scan,
  Settings2,
  MoreHorizontal,
  Trash2,
  Edit,
  Activity,
  Zap,
  Microscope,
  Stethoscope,
  CheckCircle2,
  Clock,
  Eye
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
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";

const services = [
  { id: 1, name: "MRI Brain (Contrast)", category: "MRI", price: 150000, duration: "45 mins", icon: Activity, active: true },
  { id: 2, name: "CT Head", category: "CT SCAN", price: 45000, duration: "15 mins", icon: Zap, active: true },
  { id: 3, name: "Chest X-Ray", category: "X-RAY", price: 12000, duration: "10 mins", icon: Scan, active: true },
  { id: 4, name: "Abdominal Ultrasound", category: "ULTRASOUND", price: 25000, duration: "30 mins", icon: Microscope, active: true },
  { id: 5, name: "Cardiology Consult", category: "CONSULTATION", price: 35000, duration: "20 mins", icon: Stethoscope, active: false },
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = services.filter(s => s.active).length;
  const inactiveCount = services.filter(s => !s.active).length;
  const categoriesCount = new Set(services.map(s => s.category)).size;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Radiology Services</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {services.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Configure and manage your inventory of scans and medical services.</p>
            </div>
            <Button onClick={() => { }} size="sm" className="gap-2 h-9 font-bold shadow-sm px-4">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Services", value: services.length, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Active Services", value: activeCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Inactive", value: inactiveCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Modalities", value: categoriesCount, icon: LayoutGrid, color: "text-indigo-600", bg: "bg-indigo-50" },
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
                  placeholder="Search services, modalities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 bg-white border shadow-none rounded-lg">
                <Settings2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">Service Name</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Modality / Category</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Base Price</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Est. Duration</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-slate-50/50 transition-colors group h-16 border-b border-slate-100 last:border-0">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                        <service.icon className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="font-bold text-sm text-slate-800">{service.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] font-bold px-2 py-0.5">
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 tabular-nums">
                    {formatCurrency(service.price)}
                  </TableCell>
                  <TableCell className="text-[13px] font-semibold text-slate-500">
                    {service.duration}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-bold border",
                      service.active ? "bg-emerald-100 text-emerald-800 border-none" : "bg-slate-100 text-slate-700 border-none"
                    )}>
                      {service.active ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <Edit className="h-3.5 w-3.5 text-slate-500" /> Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <LayoutGrid className="h-3.5 w-3.5 text-slate-500" /> Linked Techs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 gap-2 font-medium text-sm">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
