/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Eye,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  ChevronUp,
  ChevronDown,
  Minus,
  Check,
  Loader2,
  FolderArchive,
  Trash2,
  X,
} from "lucide-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { useToast } from "../ui/use-toast";
import { ConfirmActionModal } from "../Modals/ConfirmActionModal";
import { Checkbox } from "../ui/checkbox";

// 🧠 Helper functions
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

export type CaseData = {
  id: string;
  clientName: string;
  clientAvatar?: string;
  visaType: string;
  status: string;
  priority: string;
  progress: number;
  nextDeadline: string;
  assignedTo: string;
  assigneeAvatar?: string;
};

interface CasesTableProps {
  data: CaseData[];
}

export function CasesTable({ data }: CasesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [rowSelection, setRowSelection] = React.useState({});

  const { toast } = useToast();
  const [showArchiveModal, setShowArchiveModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedCase, setSelectedCase] = React.useState<CaseData | null>(null);
  const [bulkMode, setBulkMode] = React.useState<"archive" | "delete" | null>(null);
  const [selectedCases, setSelectedCases] = React.useState<CaseData[]>([]);

  const columns = React.useMemo<ColumnDef<CaseData, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "clientName",
        header: "Client",
        cell: ({ row }) => {
          const name = row.original.clientName;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={row.original.clientAvatar} alt={name} />
                <AvatarFallback
                  className={cn("text-xs font-semibold", getAvatarBg(name))}
                >
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Case ID",
        cell: ({ row }) => <span>{row.original.id}</span>,
      },
      {
        accessorKey: "visaType",
        header: "Visa Type",
        cell: ({ row }) => <span>{row.original.visaType}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const colorMap: Record<string, string> = {
            Active: "bg-green-100 text-green-800",
            Review: "bg-yellow-100 text-yellow-800",
            Draft: "bg-gray-100 text-gray-800",
            Approved: "bg-green-100 text-green-800",
          };
          const formatted =
            status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
          return (
            <Badge
              className={colorMap[formatted] || "bg-gray-100 text-gray-800"}
            >
              {formatted}
            </Badge>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const priority = row.original.priority.toLowerCase();
          const iconMap: Record<string, React.ReactNode> = {
            high: <ChevronUp className="h-3.5 w-3.5 text-red-600" />,
            medium: <Minus className="h-3.5 w-3.5 text-orange-500" />,
            low: <ChevronDown className="h-3.5 w-3.5 text-blue-500" />,
            completed: <Check className="h-3.5 w-3.5 text-green-600" />,
          };
          const colorMap: Record<string, string> = {
            high: "bg-red-100 text-red-800",
            medium: "bg-orange-100 text-orange-800",
            low: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
          };
          return (
            <div className="flex items-center">
              <Badge
                className={`${colorMap[priority]} text-xs capitalize gap-1 font-medium`}
              >
                {iconMap[priority]}
                {priority}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => {
          const progress = row.original.progress;
          const color =
            progress >= 80
              ? "text-green-600"
              : progress >= 40
                ? "text-orange-500"
                : "text-red-600";
          return (
            <div className="flex items-center gap-2">
              <Loader2 className={`h-4 w-4 ${color}`} />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: "nextDeadline",
        header: "Deadline",
        cell: ({ row }) => (
          <span className="text-sm">{formatDate(row.original.nextDeadline)}</span>
        ),
      },
      {
        accessorKey: "assignedTo",
        header: "Assignee",
        cell: ({ row }) => {
          const name = row.original.assignedTo;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={row.original.assigneeAvatar} alt={name} />
                <AvatarFallback
                  className={cn("text-xs font-semibold", getAvatarBg(name))}
                >
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{name}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const caseItem = row.original;
          const hasFiles =
            caseItem.progress > 0 || caseItem.status.toLowerCase() !== "draft";

          const handleArchive = () => {
            setSelectedCase(caseItem);
            setShowArchiveModal(true);
          };

          const handleDelete = () => {
            setSelectedCase(caseItem);
            setShowDeleteModal(true);
          };

          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-dropdown-ignore
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    asChild
                    onClick={() => (window.location.href = `/task-manager/${caseItem.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Case
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleArchive}>
                    <div className="flex items-center gap-2">
                      <FolderArchive className="h-4 w-4" />
                      Archive Case
                    </div>
                  </DropdownMenuItem>

                  {!hasFiles && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDelete}
                    >
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-600" />
                        Delete Case
                      </div>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          );
        },
      }
    ],
    []
  );

  // Apply Filters
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.clientName.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.visaType.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.id.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority =
        priorityFilter === "all" ||
        item.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data, globalFilter, statusFilter, priorityFilter]);

  React.useEffect(() => {
    setRowSelection((prev) => {
      const valid: Record<string, boolean> = {};
      filteredData.forEach((item) => {
        if (prev[item.id]) valid[item.id] = true;
      });
      return valid;
    });
  }, [filteredData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
  });

  return (
    <div className="w-full space-y-4 mt-4">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search cases..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between bg-muted/40 border rounded-md px-3 py-2 mt-2">
          <div className="text-sm text-muted-foreground">
            {Object.keys(rowSelection).length} case
            {Object.keys(rowSelection).length > 1 ? "s" : ""} selected
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const selectedRows = table
                  .getFilteredSelectedRowModel()
                  .rows.map((r) => r.original);
                setSelectedCases(selectedRows);
                setBulkMode("archive");
              }}
            >
              <FolderArchive className="w-4 h-4" />
              Archive Selected
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const selectedRows = table
                  .getFilteredSelectedRowModel()
                  .rows.map((r) => r.original)
                  .filter(
                    (item) =>
                      item.status.toLowerCase() === "draft" || item.progress === 0
                  );

                if (selectedRows.length === 0) {
                  toast({
                    title: "No eligible cases ⚠️",
                    description: "Only draft or empty cases can be deleted.",
                    variant: "destructive",
                  });
                  return;
                }

                setSelectedCases(selectedRows);
                setBulkMode("delete");
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllPageRowsSelected(false)}
            >
              <X className="w-4 h-4 text-red-600" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => (window.location.href = `/task-manager/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).closest("[data-dropdown-ignore]") ||
                          (e.target as HTMLElement).closest("button")
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-32 text-muted-foreground"
                >
                  No cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className="flex items-center border-t justify-between px-2 py-3">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} results
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex"
                onClick={() =>
                  table.setPageIndex(table.getPageCount() - 1)
                }
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rows per page:</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="w-[70px] h-8 text-sm font-medium">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
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
      </div>

      {/* 🗂️ Archive Confirmation */}
      <ConfirmActionModal
        open={showArchiveModal}
        onOpenChange={setShowArchiveModal}
        title="Archive Case"
        description={`Are you sure you want to archive ${selectedCase?.clientName || "this case"
          }? You can restore it later from the archive.`}
        confirmLabel="Archive"
        confirmVariant="outline"
        onConfirm={() => {
          toast({
            title: "Case archived ✅",
            description: `${selectedCase?.id} has been moved to archive.`,
          });
          setSelectedCase(null);
        }}
      />

      {/* ❌ Delete Confirmation */}
      <ConfirmActionModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Case"
        description={`Are you sure you want to permanently delete ${selectedCase?.clientName || "this case"
          }? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={() => {
          toast({
            title: "Case deleted 🗑️",
            description: `${selectedCase?.id} was removed successfully.`,
            variant: "destructive",
          });
          setSelectedCase(null);
        }}
      />

      {/* 🗂️ Bulk Archive Confirmation */}
      <ConfirmActionModal
        open={bulkMode === "archive"}
        onOpenChange={(open) => !open && setBulkMode(null)}
        title="Archive Selected Cases"
        description="Are you sure you want to archive these selected cases? You can restore them later from the archive."
        confirmLabel="Archive"
        confirmVariant="outline"
        multipleItems={selectedCases.map((c) => c.id)}
        onConfirm={() => {
          toast({
            title: "Cases archived ✅",
            description: `${selectedCases.length} case${selectedCases.length > 1 ? "s" : ""
              } moved to archive.`,
          });
          table.toggleAllPageRowsSelected(false);
          setSelectedCases([]);
        }}
      />

      {/* ❌ Bulk Delete Confirmation */}
      <ConfirmActionModal
        open={bulkMode === "delete"}
        onOpenChange={(open) => !open && setBulkMode(null)}
        title="Delete Selected Cases"
        description="Are you sure you want to permanently delete these selected cases? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        multipleItems={selectedCases.map((c) => c.id)}
        onConfirm={() => {
          toast({
            title: "Cases deleted 🗑️",
            description: `${selectedCases.length} case${selectedCases.length > 1 ? "s" : ""
              } deleted successfully.`,
            variant: "destructive",
          });
          table.toggleAllPageRowsSelected(false);
          setSelectedCases([]);
        }}
      />
    </div>
  );
}
