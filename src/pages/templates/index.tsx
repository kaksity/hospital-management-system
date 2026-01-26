"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileType,
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  MoreHorizontal,
  Filter,
  FileSliders,
  ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

const MOCK_TEMPLATES = [
  { id: 1, name: "Normal Chest X-Ray", category: "X-RAY", lastUsed: "2 hours ago", status: "Published" },
  { id: 2, name: "Brain MRI (Pre-Contrast)", category: "MRI", lastUsed: "1 day ago", status: "Published" },
  { id: 3, name: "Abdominal CT Study", category: "CT SCAN", lastUsed: "3 days ago", status: "Draft" },
  { id: 4, name: "Pelvic Ultrasound Report", category: "ULTRASOUND", lastUsed: "5 hours ago", status: "Published" },
  { id: 5, name: "Cardiology Review Template", category: "CONSULT", lastUsed: "Yesterday", status: "Published" },
];

export default function ReportTemplates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = [
    { label: "Total Templates", value: MOCK_TEMPLATES.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published", value: MOCK_TEMPLATES.filter(t => t.status === "Published").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Drafts", value: MOCK_TEMPLATES.filter(t => t.status === "Draft").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Used Recently", value: 3, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Reporting Templates</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  {MOCK_TEMPLATES.length}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Create and manage standardized diagnostic report structures</p>
            </div>
            <Button
              onClick={() => navigate("/templates/create")}
              className="h-9 font-medium px-4"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {stats.map((stat, i) => (
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border shadow-none bg-slate-50/50 focus-visible:ring-primary/20 transition-all hover:border-slate-300 rounded-lg placeholder:text-slate-400 text-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[250px] h-10 bg-white justify-between border shadow-none rounded-lg font-semibold text-xs text-slate-600"
                  >
                    <div className="flex items-center gap-2 truncate text-sm font-medium">
                      <div className="flex items-center gap-2 text-slate-700 border-r border-border pr-2 mr-1">
                        <ListFilter className="h-4 w-4" />
                        <span className="text-sm font-semibold">Filter by</span>
                      </div>
                      {selectedCategory === "all" ? "All Categories" : selectedCategory}
                    </div>
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search categories..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            setSelectedCategory("all");
                            setIsCategoryPopoverOpen(false);
                          }}
                          className="text-xs font-medium"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-3.5 w-3.5",
                              selectedCategory === "all" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Categories
                        </CommandItem>
                        {["MRI", "CT SCAN", "X-RAY", "ULTRASOUND", "CONSULT"].map((cat) => (
                          <CommandItem
                            key={cat}
                            onSelect={() => {
                              setSelectedCategory(cat);
                              setIsCategoryPopoverOpen(false);
                            }}
                            className="text-xs font-medium"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-3.5 w-3.5",
                                selectedCategory === cat ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <FileSliders className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="text-base font-bold text-slate-800">{template.name}</div>
                      <Badge
                        variant="default"
                        className={cn(
                          "text-[10px] font-bold px-2 border-none",
                          template.status === "Published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-semibold uppercase py-0 text-slate-500 tracking-widest">{template.category}</p>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => navigate(`/templates/edit/${template.id}`)}
                          className="gap-2 font-medium text-sm"
                        >
                          <Edit className="h-3.5 w-3.5 text-slate-500" /> Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 gap-2 font-medium text-sm">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

