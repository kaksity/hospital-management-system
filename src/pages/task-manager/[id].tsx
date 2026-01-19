/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useParams } from "react-router-dom";
import {
  MoreHorizontal,
  Upload,
  UserPlus,
  Folder,
  FileText,
  Info,
  ClipboardList,
  Calendar,
  Trash2,
  Plus,
  Pencil,
  FolderArchive,
  Copy,
  Edit,
  Download,
  Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UploadCaseDocumentsModal } from "@/components/Modals/UploadCaseDocumentsModal";
import { AddEditGroupModal } from "@/components/Modals/AddEditGroupModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getVisaSchema } from "@/services/visaSchemaService";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AssignTeamMemberModal } from "@/components/Modals/AssignTeamMemberModal";
import { toast } from "sonner";

// 🧩 Helpers
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getFirstInitial = (name: string) => {
  return name.trim().charAt(0).toUpperCase();
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

export default function CaseDetail() {
  const { id } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<any>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [activeGroup, setActiveGroup] = React.useState<any>(null);
  const [visaSchema, setVisaSchema] = React.useState<any>(null);

  const [assignedTo, setAssignedTo] = React.useState<string | null>("Sarah Johnson");
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // In a real app, you'd fetch the case data and then get the schema
      const schema = getVisaSchema("O-1A"); // This would come from case data
      setVisaSchema(schema);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading case details...
      </div>
    );
  }

  // 🧠 Enhanced Mock Case Data with schema-based structure
  const caseData = {
    id: id || "ACV-2024-001",
    visaType: "O-1A Visa",
    clientName: "Alex Turner",
    clientAvatar: "",
    status: "Active",
    priority: "High",
    progress: 65,
    assignedTo: assignedTo,
    assigneeAvatar: "",
    filingDeadline: "2025-12-10",
    createdAt: "2025-10-15",
    updatedAt: "2025-10-16",
    // Schema-based background data
    backgroundData: {
      first_name: "Alex",
      last_name: "Turner",
      field_of_endeavor: "Music Composition",
      o1a_category: "Arts",
      petitioner_name: "Global Music Records Inc."
    },
    // File upload sections data
    backgroundFiles: {
      "Background of the Beneficiary": [
        { id: "bg-1", name: "Biography.pdf", size: "2.1MB", uploadedAt: "2024-10-20" },
        { id: "bg-2", name: "CV_Resume.pdf", size: "1.8MB", uploadedAt: "2024-10-19" }
      ],
      "Proposed Employment": [
        { id: "emp-1", name: "Employment_Contract.pdf", size: "3.2MB", uploadedAt: "2024-10-18" }
      ],
      "Expert Letters": [
        { id: "exp-1", name: "Dr_Smith_Recommendation.pdf", size: "1.5MB", uploadedAt: "2024-10-21" }
      ]
    },
    criteria: [
      {
        id: "national_international_awards",
        title: "National or International Prizes or Awards",
        description: "Evidence of nationally or internationally recognized prizes or awards for excellence",
        groups: [
          {
            id: "grp-1",
            name: "Awards Certificates",
            createdAt: "2025-10-15",
            documents: [
              {
                id: "doc-1",
                name: "Grammy_Award_Certificate.pdf",
                size: "1.2MB",
                addedAt: "2025-10-21",
              },
              {
                id: "doc-2",
                name: "Music_Industry_Recognition.png",
                size: "600KB",
                addedAt: "2025-10-19",
              },
            ],
          },
          {
            id: "grp-2",
            name: "Press Coverage",
            createdAt: "2025-10-17",
            documents: [
              {
                id: "doc-3",
                name: "NY_Times_Feature.pdf",
                size: "2.1MB",
                addedAt: "2025-10-20",
              },
            ],
          },
        ],
      },
      {
        id: "membership_associations",
        title: "Membership in Associations",
        description: "Documentation showing membership in associations which require outstanding achievements",
        groups: [
          {
            id: "grp-3",
            name: "Association Letters",
            createdAt: "2025-10-18",
            documents: [
              {
                id: "doc-4",
                name: "Music_Association_Membership.pdf",
                size: "1.1MB",
                addedAt: "2025-10-22",
              },
            ],
          },
        ],
      },
    ],
    documents: [
      {
        id: "doc-main-1",
        name: "Passport_Scan.pdf",
        type: "PDF",
        size: "1.1MB",
        uploadedAt: "2025-10-21",
      },
      {
        id: "doc-main-2",
        name: "Visa_Application_Form.pdf",
        type: "PDF",
        size: "1.4MB",
        uploadedAt: "2025-10-20",
      },
    ],
  };

  const teamMembers = [
    { id: "1", name: "Sarah Johnson", role: "Paralegal", avatar: "", email: "sarah@agora.com" },
    { id: "2", name: "Michael Chen", role: "Attorney", avatar: "", email: "michael@agora.com" },
    { id: "3", name: "David Rodriguez", role: "Attorney", avatar: "", email: "david@agora.com" },
    { id: "4", name: "Emily Watson", role: "Paralegal", avatar: "", email: "emily@agora.com" },
    { id: "5", name: "James Wilson", role: "Legal Assistant", avatar: "", email: "james@agora.com" },
  ];

  const hasBackground = caseData.backgroundData && Object.keys(caseData.backgroundData).length > 0;
  const hasBackgroundFiles = caseData.backgroundFiles && Object.keys(caseData.backgroundFiles).length > 0;
  const hasCriteria = caseData.criteria?.length > 0;
  const hasDocuments = caseData.documents?.length > 0;

  // Calculate progress for each criterion
  const calculateCriterionProgress = (criterion: any) => {
    const totalFiles = criterion.groups.reduce((sum: number, group: any) => sum + group.documents.length, 0);
    return totalFiles > 0 ? 100 : 0; // Simple progress calculation
  };

  const totalProgress = caseData.progress || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={caseData.clientAvatar} alt={caseData.clientName} />
              <AvatarFallback
                className={cn("text-sm font-semibold", getAvatarBg(caseData.clientName))}
              >
                {getInitials(caseData.clientName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold leading-tight">{caseData.clientName}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {caseData.visaType}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 capitalize">
                    {caseData.status}
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 capitalize">
                    {caseData.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div>
                  Case ID: <span className="font-medium">{caseData.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Case
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowAssignModal(true)}
          >
            <UserPlus className="h-4 w-4" />
            {assignedTo ? 'Re-assign' : 'Assign'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FolderArchive className="w-4 h-4" />
                Archive Case
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4" variant="line">
          <TabsTrigger variant="line" value="overview" className="flex items-center gap-1">
            <Info className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger variant="line" value="background" className="flex items-center gap-1">
            <ClipboardList className="h-4 w-4" /> Background
          </TabsTrigger>
          <TabsTrigger variant="line" value="criteria" className="flex items-center gap-1">
            <Folder className="h-4 w-4" /> Criteria
          </TabsTrigger>
          <TabsTrigger variant="line" value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,55%)_minmax(0,45%)]">
            {/* Case Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Visa Type</p>
                    <p className="font-medium">{caseData.visaType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="bg-green-100 text-green-800 capitalize">
                      {caseData.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <div className="flex items-center gap-2">
                      {assignedTo ? (
                        <>
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className={cn("text-xs", getAvatarBg(assignedTo))}>
                              {getFirstInitial(assignedTo)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{assignedTo}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
                    <Badge className="bg-red-100 text-red-800 capitalize">
                      {caseData.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium">{totalProgress}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDate(caseData.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(caseData.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Filing Deadline</p>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{formatDate(caseData.filingDeadline)}</span>
                    </div>
                  </div>
                </div>
                
                {/* <Separator />
                
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Filing Deadline</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDate(caseData.filingDeadline)}</span>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Criteria Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Criteria Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasCriteria ? (
                  caseData.criteria.map((criterion) => {
                    const progress = calculateCriterionProgress(criterion);
                    return (
                      <div key={criterion.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{criterion.title}</span>
                          <span className="text-muted-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No criteria defined yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Background Tab */}
        <TabsContent value="background" className="space-y-6">
          {/* Form Data Section */}
          {hasBackground && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Background Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {Object.entries(caseData.backgroundData).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="font-medium">{value || 'Not provided'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Upload Sections */}
          {hasBackgroundFiles && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Supporting Documents</h3>
              </div>
              
              {Object.entries(caseData.backgroundFiles).map(([sectionTitle, files]) => (
                <Card key={sectionTitle}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{sectionTitle}</CardTitle>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {files.length > 0 ? (
                      <div className="space-y-3">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {file.size} • Uploaded {formatDate(file.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No files uploaded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!hasBackground && !hasBackgroundFiles && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No background information added yet.</p>
                <Button className="mt-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Add Background Information
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Criteria Tab - Keep your existing criteria implementation */}
        <TabsContent value="criteria">
          {hasCriteria ? (
            <Accordion type="single" collapsible className="space-y-3">
              {caseData.criteria.map((crit) => {
                const totalGroups = crit.groups.length;
                const totalDocs = crit.groups.reduce(
                  (acc, g) => acc + g.documents.length,
                  0
                );

                return (
                  <AccordionItem
                    key={crit.id}
                    value={crit.id}
                    className="border rounded-lg bg-card data-[state=open]:shadow-sm transition-all"
                  >
                    <AccordionTrigger className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:no-underline">
                      <div className="text-left flex-1">
                        <p className="text-md font-medium text-foreground">{crit.title}</p>
                        <p className="text-sm text-muted-foreground">{crit.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Folder className="h-4 w-4" />
                          <span>{totalGroups} Groups</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{totalDocs} Documents</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowGroupModal(true);
                            setEditMode(false);
                            setSelectedGroup(null);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" /> New Group
                        </Button>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="p-4 border-t space-y-4">
                        {crit.groups.length > 0 ? (
                          crit.groups.map((group) => (
                            <div
                              key={group.id}
                              className="rounded-lg border p-4 transition-all"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Folder className="h-4 w-4 text-blue-600" />
                                  <p className="font-medium text-sm">{group.name}</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-muted-foreground"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditMode(true);
                                      setSelectedGroup(group);
                                      setShowGroupModal(true); 
                                    }}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-[#ed4b2e]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowUploadModal(true);
                                      setActiveGroup(group);
                                    }}
                                  >
                                    <Upload className="h-3.5 w-3.5" /> Upload
                                  </Button>
                                </div>
                              </div>

                              {group.documents.length > 0 ? (
                                <div className="space-y-2">
                                  {group.documents.map((doc) => (
                                    <div
                                      key={doc.id}
                                      className="flex items-center justify-between border-b last:border-b-0 px-3 py-2 text-sm"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="border rounded-lg p-2">
                                          <FileText className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="font-medium">{doc.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            Added {formatDate(doc.addedAt)}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-sm text-muted-foreground py-6 border rounded-md bg-background/50">
                                  No files yet
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No groups created for this criterion yet.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No criteria defined yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab - Keep your existing documents implementation */}
        <TabsContent value="documents">
          {hasDocuments ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseData.documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-transparent transition-colors">
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No documents uploaded yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* <div className="fixed bottom-6 right-6 w-[350px]">
        <Card className="shadow-lg border-l-4 border-l-[#fe5e41]">
          <CardContent className="p-4 py-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Case Progress</span>
                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(new Date().toISOString())}
                  </div>
                </div>
                <span className="text-sm font-semibold">{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div> */}

      <AddEditGroupModal
        open={showGroupModal}
        onOpenChange={(open) => {
          setShowGroupModal(open);
          if (!open) {
            setSelectedGroup(null);
            setEditMode(false);
          }
        }}
        editMode={editMode}
        defaultValues={selectedGroup}
      />

      <UploadCaseDocumentsModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUpload={(files) => console.log("Uploaded Files:", files)}
      />

      {/* Assign Team Member Modal */}
      <AssignTeamMemberModal
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        teamMembers={teamMembers}
        currentAssignee={assignedTo}
        onAssign={(member) => {
          setAssignedTo(member.name);
          toast.success(`Case assigned to ${member.name}`);
        }}
        onClearAssignment={() => {
          setAssignedTo(null);
          toast.success("Assignment cleared");
        }}
      />
    </div>
  );
}