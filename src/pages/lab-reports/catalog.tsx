/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BookOpen, Plus, Search, MoreHorizontal, Pencil, Trash2, FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLabCatalog } from "@/hooks/use-lab-catalog";
import { LabTestDefinition, TEST_CATEGORIES } from "@/data/labReports";

const emptyForm = { name: "", category: "", unit: "", referenceRange: "" };

export default function LabCatalog() {
  const { catalog, addTest, updateTest, deleteTest } = useLabCatalog();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTestDefinition | null>(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = catalog.filter(t => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = TEST_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = catalog.filter(t => t.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const openAdd = () => {
    setEditingTest(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (test: LabTestDefinition) => {
    setEditingTest(test);
    setForm({ name: test.name, category: test.category, unit: test.unit, referenceRange: test.referenceRange });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.category) return;
    if (editingTest) {
      updateTest(editingTest.id, form);
    } else {
      addTest(form);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTest(id);
    setDeleteConfirmId(null);
  };

  const isFormValid = form.name.trim() && form.category;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-[1600px] mx-auto w-full space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">Test Catalog</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{catalog.length} tests defined across {new Set(catalog.map(t => t.category)).size} categories</p>
              </div>
            </div>
            <Button onClick={openAdd} className="gap-2 self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              Add Test
            </Button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {TEST_CATEGORIES.filter(c => categoryCounts[c] > 0).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(prev => prev === cat ? "all" : cat)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-slate-600 border-border hover:border-primary/40"
                )}
              >
                {cat}
                <span className={cn(
                  "h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold",
                  categoryFilter === cat ? "bg-primary-foreground/20 text-primary-foreground" : "bg-slate-200 text-slate-600"
                )}>
                  {categoryCounts[cat]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-6 py-6 bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto w-full">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="font-semibold text-slate-800">No tests found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || categoryFilter !== "all" ? "Try adjusting your filters." : "Start by adding your first test to the catalog."}
              </p>
              {!search && categoryFilter === "all" && (
                <Button onClick={openAdd} className="mt-4 gap-2"><Plus className="h-4 w-4" />Add Test</Button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">ID</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Test Name</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Category</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Unit</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-500">Reference Range</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(test => (
                    <TableRow key={test.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <code className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {test.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FlaskConical className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="text-sm font-semibold text-slate-900">{test.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-medium">{test.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">{test.unit || <span className="text-muted-foreground italic">—</span>}</span>
                      </TableCell>
                      <TableCell className="max-w-[240px]">
                        <span className="text-xs text-slate-500 truncate block" title={test.referenceRange}>
                          {test.referenceRange || <span className="italic text-muted-foreground">—</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem className="gap-2 text-sm" onClick={() => openEdit(test)}>
                              <Pencil className="h-4 w-4 text-muted-foreground" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-sm text-destructive focus:text-destructive"
                              onClick={() => setDeleteConfirmId(test.id)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FlaskConical className="h-4 w-4 text-blue-600" />
              </div>
              {editingTest ? "Edit Test" : "Add Test to Catalog"}
            </DialogTitle>
            <DialogDescription>
              {editingTest ? "Update the test definition details." : "Define a new lab test that can be assigned to patient reports."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Test Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. Full Blood Count (FBC)"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Category <span className="text-red-500">*</span></Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {TEST_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Unit</Label>
                <Input
                  placeholder="e.g. mmol/L"
                  value={form.unit}
                  onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Reference Range</Label>
                <Input
                  placeholder="e.g. 3.9–7.8"
                  value={form.referenceRange}
                  onChange={e => setForm(f => ({ ...f, referenceRange: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isFormValid} className="gap-2 min-w-[100px]">
              {editingTest ? "Save Changes" : "Add Test"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>
              This will remove the test from the catalog. Existing reports that include this test will not be affected.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
