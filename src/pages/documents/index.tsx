/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {  
  Upload, 
  Search, 
  MoreVertical, 
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Filter,
  Trash2,
  X,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
  Folder,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/utils/dateFormatter";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadDocumentsModal } from "@/components/Modals/UploadDocumentsModal";
import { DeleteDocumentModal } from "@/components/Modals/DeleteDocumentModal";
import { useToast } from "@/components/ui/use-toast";

export default function Documents() {
  const [caseFilter, setCaseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const { toast } = useToast();

  // Enhanced mock data
  const cases = [
    {
      id: "ACV-2024-001",
      clientName: "Alex Turner",
      visaType: "O-1A Visa",
    },
    {
      id: "ACV-2024-002", 
      clientName: "Maria Garcia",
      visaType: "EB-2 NIW",
    }
  ];

  const recentDocuments = [
    {
      id: "doc-1",
      name: "TechCrunch_Feature_Article.pdf",
      criterion: "Published Material",
      group: "Tech & Startup Coverage",
      caseId: "ACV-2024-001",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
      uploadedBy: "Sarah Johnson",
      type: "pdf"
    },
    {
      id: "doc-2",
      name: "Y_Combinator_Acceptance.pdf",
      criterion: "Membership",
      group: "Accelerators", 
      caseId: "ACV-2024-001",
      uploadDate: "2024-01-14",
      size: "1.1 MB",
      uploadedBy: "Sarah Johnson",
      type: "pdf"
    },
    {
      id: "doc-3",
      name: "Forbes_30Under30_Certificate.pdf",
      criterion: "Awards",
      group: "National Awards",
      caseId: "ACV-2024-002",
      uploadDate: "2024-01-13",
      size: "890 KB",
      uploadedBy: "Michael Chen",
      type: "pdf"
    },
    {
      id: "doc-4",
      name: "Conference_Presentation.jpg",
      criterion: "Judging Experience",
      group: "Conference Talks",
      caseId: "ACV-2024-001",
      uploadDate: "2024-01-12",
      size: "3.2 MB",
      uploadedBy: "Sarah Johnson",
      type: "image"
    }
  ];

  const allDocuments = [
    ...recentDocuments,
    {
      id: "doc-5",
      name: "Patent_Certificate.pdf",
      criterion: "Original Contributions",
      group: "Patents",
      caseId: "ACV-2024-002",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      uploadedBy: "Michael Chen",
      type: "pdf"
    },
    {
      id: "doc-6",
      name: "Recommendation_Letter.pdf",
      criterion: "Recommendation Letters",
      group: "Expert Letters",
      caseId: "ACV-2024-001",
      uploadDate: "2024-01-09",
      size: "2.1 MB",
      uploadedBy: "Sarah Johnson",
      type: "pdf"
    },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `doc-${i + 7}`,
      name: `Document_${i + 7}.pdf`,
      criterion: "Various Criteria",
      group: "Various Groups",
      caseId: i % 2 === 0 ? "ACV-2024-001" : "ACV-2024-002",
      uploadDate: "2024-01-0" + (8 - (i % 5)),
      size: `${1 + (i % 3)}.${i % 2} MB`,
      uploadedBy: i % 2 === 0 ? "Sarah Johnson" : "Michael Chen",
      type: "pdf"
    }))
  ];

  const getCaseInfo = (caseId: string) => {
    return cases.find(c => c.id === caseId);
  };

  const getFirstInitial = (name: string) => {
  return name.trim().charAt(0).toUpperCase();
};

  const getAvatarColor = (seed: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash % colors.length)];
  };

  const getFileIcon = (type: string, name: string) => {
    if (type === 'image' || name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <ImageIcon className="h-5 w-5 text-blue-600" />;
    }
    return <FileText className="h-5 w-5 text-red-600" />;
  };

  // Filter documents based on search and filters
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.criterion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.group.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCase = caseFilter === "all" || doc.caseId === caseFilter;
    
    return matchesSearch && matchesCase;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageDocumentIds = paginatedDocuments.reduce((acc, doc) => {
        acc[doc.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setRowSelection(pageDocumentIds);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectDocument = (docId: string, checked: boolean) => {
    setRowSelection(prev => ({
      ...prev,
      [docId]: checked
    }));
  };

  const clearSelection = () => {
    setRowSelection({});
  };

  const selectedCount = Object.keys(rowSelection).length;
  const isAllSelected = paginatedDocuments.length > 0 && 
    paginatedDocuments.every(doc => rowSelection[doc.id]);
  const isSomeSelected = paginatedDocuments.some(doc => rowSelection[doc.id]);

  const handleDeleteClick = (doc: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDocumentToDelete(doc);
    setBulkDeleteMode(false);
    setDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setDocumentToDelete(null);
    setBulkDeleteMode(true);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bulkDeleteMode) {
      // Handle bulk delete
      const selectedDocumentIds = Object.keys(rowSelection);
      console.log('Deleting documents:', selectedDocumentIds);
      
      // In a real app, you'd make an API call here
      toast({
        title: "Documents Deleted",
        description: `${selectedDocumentIds.length} documents have been permanently deleted.`,
        variant: "destructive",
      });
      
      // Clear selection
      setRowSelection({});
    } else if (documentToDelete) {
      // Handle single delete
      console.log('Deleting document:', documentToDelete.id);
      
      // In a real app, you'd make an API call here
      toast({
        title: "Document Deleted",
        description: `${documentToDelete.name} has been permanently deleted.`,
        variant: "destructive",
      });
    }
    
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage all documents across your cases
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowUploadModal(true)}>
          <Upload className="h-4 w-4" />
          Upload Documents
        </Button>
      </div>

      {/* Recent Uploads Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Uploads</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentDocuments.map((doc) => {
            const caseInfo = getCaseInfo(doc.caseId);
            return (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {getFileIcon(doc.type, doc.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.criterion} • {doc.group}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className={cn("text-[10px] text-white", getAvatarColor(doc.uploadedBy))}>
                            {getFirstInitial(doc.uploadedBy)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {doc.uploadedBy}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.uploadDate)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>
            Complete document library across all cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents, criteria, or groups..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={caseFilter} onValueChange={setCaseFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                {cases.map(caseItem => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedCount > 0 && (
            <div className="flex items-center justify-between bg-muted/40 border rounded-md px-3 py-2 mb-4">
              <div className="text-sm text-muted-foreground">
                {selectedCount} document{selectedCount > 1 ? "s" : ""} selected
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDeleteClick}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                >
                  <X className="w-4 h-4 text-red-600" />
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Documents Table */}
          <div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className="translate-y-[2px]"
                    />
                  </TableHead>
                  <TableHead className="w-[350px]">Document</TableHead>
                  <TableHead>Case</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((doc) => {
                  const caseInfo = getCaseInfo(doc.caseId);
                  return (
                    <TableRow key={doc.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={!!rowSelection[doc.id]}
                          onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                          aria-label="Select row"
                          className="translate-y-[2px]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                            {getFileIcon(doc.type, doc.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate" title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.size}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {caseInfo ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {caseInfo.clientName}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doc.group}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={cn("text-xs text-white", getAvatarColor(doc.uploadedBy))}>
                              {getFirstInitial(doc.uploadedBy)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{doc.uploadedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(doc.uploadDate)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link 
                                to={`/cases/${doc.caseId}`} 
                                className="flex items-center"
                              >
                                <Eye className="h-4 w-4" />
                                View Case
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => handleDeleteClick(doc, e)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredDocuments.length > 0 && (
            <div className="flex items-center border-t justify-between px-2 py-3">
              <div className="text-sm text-muted-foreground">
                {filteredDocuments.length} results
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
        </CardContent>
      </Card>

      {/* Upload Document Modal */}
      <UploadDocumentsModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUpload={(files, metadata) => {
          // Handle the uploaded files with metadata
          console.log('Uploaded files:', files);
          console.log('Metadata:', metadata);
          // In a real app, you'd make an API call here
        }}
        cases={cases}
      />

      {/* Delete Document Modal */}
      <DeleteDocumentModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        document={bulkDeleteMode ? undefined : documentToDelete}
        multiple={bulkDeleteMode}
        count={Object.keys(rowSelection).length}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}