"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  Mail,
  MessageSquare,
  MessageCircle, // For WhatsApp
  Download,
  Eye,
  RotateCcw,
  ListFilter,
  ChevronDown,
  Calendar as CalendarIcon,
  X,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Send
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";

const communications = [
  {
    id: "COM-001",
    recipientName: "John Adebayo",
    patientId: "PAT-105",
    mode: "Email",
    subject: "Diagnostic Report: MRI Brain (Contrast)",
    status: "Delivered",
    date: "2024-11-20T10:30:00Z",
    gender: "Male"
  },
  {
    id: "COM-002",
    recipientName: "Sarah Phillips",
    patientId: "PAT-211",
    mode: "SMS",
    subject: "Appointment Reminder: CT Scan",
    status: "Sent",
    date: "2024-11-20T11:45:00Z",
    gender: "Female"
  },
  {
    id: "COM-003",
    recipientName: "Michael Chen",
    patientId: "PAT-094",
    mode: "WhatsApp",
    subject: "Report Ready: Radiology Consult Result",
    status: "Delivered",
    date: "2024-11-19T14:20:00Z",
    gender: "Male"
  },
  {
    id: "COM-004",
    recipientName: "Elena Rodriguez",
    patientId: "PAT-302",
    mode: "Email",
    subject: "Invoice #INV-2025-002",
    status: "Failed",
    date: "2024-11-18T09:15:00Z",
    gender: "Female"
  },
  {
    id: "COM-005",
    recipientName: "David Wilson",
    patientId: "PAT-118",
    mode: "WhatsApp",
    subject: "Follow-up Notification: Ultrasound Result",
    status: "Pending",
    date: "2024-11-20T16:00:00Z",
    gender: "Male"
  }
];

export default function Communication() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const modes = ["Email", "SMS", "WhatsApp"];
  const statuses = ["Delivered", "Sent", "Failed", "Pending"];

  const filteredCommunications = useMemo(() => {
    return communications.filter(com => {
      const matchesSearch =
        com.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        com.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        com.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMode = selectedMode === "all" || com.mode === selectedMode;
      const matchesStatus = selectedStatus === "all" || com.status === selectedStatus;

      const comDate = new Date(com.date);
      const matchesStartDate = !startDate || comDate >= startDate;
      const matchesEndDate = !endDate || comDate <= endDate;

      return matchesSearch && matchesMode && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [searchQuery, selectedMode, selectedStatus, startDate, endDate]);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Email": return <Mail className="h-3.5 w-3.5" />;
      case "SMS": return <MessageSquare className="h-3.5 w-3.5" />;
      case "WhatsApp": return <MessageCircle className="h-3.5 w-3.5" />;
      default: return <Send className="h-3.5 w-3.5" />;
    }
  };

  const getModeBadge = (mode: string) => {
    const variants = {
      Email: "bg-blue-100 text-blue-700 border-none",
      SMS: "bg-indigo-100 text-indigo-700 border-none",
      WhatsApp: "bg-emerald-100 text-emerald-700 border-none",
    };
    return (
      <Badge variant="outline" className={cn("gap-1.5 px-2 py-0.5 text-[10px] font-bold border", variants[mode as keyof typeof variants])}>
        {getModeIcon(mode)}
        {mode}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Delivered: "bg-emerald-100 text-emerald-800 border-none",
      Sent: "bg-blue-100 text-blue-800 border-none",
      Failed: "bg-red-100 text-red-800 border-none",
      Pending: "bg-amber-100 text-amber-800 border-none",
    };
    return (
      <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-bold border", variants[status as keyof typeof variants])}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Patient Communication</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {communications.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Track notifications, results dispatch, and reminders sent to patients.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" className="h-9 font-medium px-4">
                <Plus className="h-4 w-4" />
                New Message
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Sent", value: 1240, icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Delivered", value: 1180, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending", value: 45, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Failed", value: 15, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">{stat.label}</p>
                    <h3 className="text-lg font-bold text-slate-800 tabular-nums leading-none pt-1">{stat.value.toLocaleString()}</h3>
                  </div>
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Filters Area */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by recipient or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-0 border border-input rounded-lg overflow-hidden bg-white h-10">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-semibold text-[13px] gap-2 rounded-none border-none", !startDate && "text-slate-700")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <div className="w-px h-4 bg-slate-200 shrink-0" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn("h-full px-4 justify-start text-left font-semibold text-[13px] gap-2 rounded-none border-none", !endDate && "text-slate-700")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <>
                    <div className="w-px h-4 bg-slate-200 shrink-0" />
                    <Button variant="ghost" size="icon" className="h-full w-10 text-slate-400 hover:text-slate-600 rounded-none font-bold" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 px-3 text-sm font-medium bg-white border gap-2 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-700 border-r border-slate-200 pr-2 mr-1">
                      <ListFilter className="h-4 w-4" />
                      <span className="text-sm font-semibold">Filter by</span>
                    </div>
                    {(selectedMode !== "all" || selectedStatus !== "all") && (
                      <Badge variant="secondary" className="mr-1 h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-bold">
                        {[selectedMode, selectedStatus].filter(v => v !== "all").length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] p-2">
                  <div className="space-y-4 p-2">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Communication Mode</p>
                      <div className="flex flex-col gap-1">
                        {["all", ...modes].map((m) => (
                          <div
                            key={m}
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-semibold capitalize",
                              selectedMode === m && "bg-primary/5 text-primary"
                            )}
                            onClick={() => setSelectedMode(m)}
                          >
                            {m}
                            {selectedMode === m && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delivery Status</p>
                      <div className="flex flex-col gap-1">
                        {["all", ...statuses].map((s) => (
                          <div
                            key={s}
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded text-[11px] cursor-pointer hover:bg-slate-50 font-semibold capitalize",
                              selectedStatus === s && "bg-primary/5 text-primary"
                            )}
                            onClick={() => setSelectedStatus(s)}
                          >
                            {s}
                            {selectedStatus === s && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedMode("all");
                        setSelectedStatus("all");
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                    >
                      <X className="h-3.5 w-3.5 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="bg-white rounded-xl border overflow-hidden transition-all duration-300">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent transition-none">
                <TableHead className="pl-6 text-[11px] font-bold uppercase tracking-wider text-slate-600">ID</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Recipient</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Mode</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Subject / Message Preview</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Status</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Date & Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommunications.map((com) => (
                <TableRow key={com.id} className="hover:bg-slate-50/50 transition-colors group cursor-default h-16">
                  <TableCell className="pl-6">
                    <code className="text-[11px] font-semibold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200/50">
                      {com.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getPatientAvatarPath(com.patientId, com.gender)} alt={com.recipientName} />
                        <AvatarFallback className={cn("text-[12px] font-semibold text-white", getAvatarBg(com.recipientName))}>
                          {getAvatarInitials(com.recipientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-slate-800 truncate">{com.recipientName}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">{com.patientId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getModeBadge(com.mode)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col min-w-0 max-w-[300px]">
                      <span className="font-semibold text-sm text-slate-700 truncate">{com.subject}</span>
                      <span className="text-[10px] text-slate-400 truncate">Dispatch of clinical records to patient portal...</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(com.status)}
                  </TableCell>
                  <TableCell className="text-[13px] font-semibold text-slate-700">
                    <div className="flex flex-col">
                      <span>{format(new Date(com.date), "MMM dd, yyyy")}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{format(new Date(com.date), "hh:mm a")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-medium text-sm">
                          <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" /> Resend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCommunications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center p-8 bg-white">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border-slate-100 border">
                        <MessageSquare className="h-8 w-8 text-slate-200" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No communication logs found</h3>
                      <p className="text-slate-400 text-sm font-medium mt-1">Try adjusting your search query or filters.</p>
                      <Button variant="outline" className="mt-6 font-bold" onClick={() => setSearchQuery("")}>Reset Dashboard</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}