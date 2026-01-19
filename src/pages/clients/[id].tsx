/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useParams, Link } from "react-router-dom";
import {
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  FileText,
  DollarSign,
  User,
  Building,
  Globe,
  Clock
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
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/formatCurrency";

// Helper functions
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

export default function ClientDetail() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading client details...
      </div>
    );
  }

  // Mock client data
  const clientData = {
    id: id || "CL-001",
    name: "Alex Turner",
    email: "alex.turner@email.com",
    phone: "+1 (555) 123-4567",
    country: "United Kingdom",
    address: "123 Music Street, London W1 2AB, United Kingdom",
    status: "active",
    joinedDate: "2024-10-15",
    lastActivity: "2025-01-15",
    notes: "Musician and composer with extensive international experience. Prefers email communication.",
    
    // Cases associated with this client
    cases: [
      {
        id: "ACV-2024-001",
        visaType: "O-1A Visa",
        status: "Active",
        priority: "High",
        progress: 65,
        filingDeadline: "2025-12-10",
        assignedTo: "Sarah Johnson"
      },
      {
        id: "ACV-2024-005",
        visaType: "EB-1A Visa",
        status: "Review",
        priority: "Medium",
        progress: 30,
        filingDeadline: "2025-08-15",
        assignedTo: "Michael Chen"
      }
    ],

    // Payment information
    paymentSummary: {
      totalValue: 27000,
      paid: 10000,
      balance: 17000,
      nextPaymentDue: "2025-03-15",
      paymentPlan: [
        { name: "Initial Retainer", amount: 5000, status: "paid", date: "2024-10-20" },
        { name: "Document Review", amount: 5000, status: "paid", date: "2024-11-15" },
        { name: "Filing Preparation", amount: 7000, status: "pending", dueDate: "2025-03-15" },
        { name: "USCIS Filing", amount: 10000, status: "pending", dueDate: "2025-06-01" }
      ]
    },

    // Communication history
    communications: [
      {
        id: "comm-1",
        type: "email",
        subject: "Welcome to Agora Visa Services",
        date: "2024-10-15",
        summary: "Initial onboarding and case setup"
      },
      {
        id: "comm-2",
        type: "call",
        subject: "Document Collection Discussion",
        date: "2024-10-20",
        summary: "Discussed required documents for O-1A application"
      },
      {
        id: "comm-3",
        type: "email",
        subject: "Payment Confirmation - Initial Retainer",
        date: "2024-10-21",
        summary: "Confirmed receipt of initial retainer payment"
      },
      {
        id: "comm-4",
        type: "meeting",
        subject: "Case Strategy Session",
        date: "2024-11-05",
        summary: "Discussed evidence strategy and timeline"
      }
    ],

    // Documents
    documents: [
      {
        id: "doc-1",
        name: "Passport_Scan.pdf",
        type: "Identification",
        uploadedAt: "2024-10-18",
        size: "2.1MB"
      },
      {
        id: "doc-2",
        name: "CV_Resume.pdf",
        type: "Professional",
        uploadedAt: "2024-10-19",
        size: "1.8MB"
      },
      {
        id: "doc-3",
        name: "Award_Certificates.zip",
        type: "Evidence",
        uploadedAt: "2024-10-25",
        size: "15.2MB"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getCaseStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-green-100 text-green-800",
      Review: "bg-yellow-100 text-yellow-800",
      Draft: "bg-gray-100 text-gray-800",
      Approved: "bg-blue-100 text-blue-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-orange-100 text-orange-800",
      Low: "bg-blue-100 text-blue-800"
    };
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback
                className={cn("text-sm font-semibold", getAvatarBg(clientData.name))}
              >
                {getInitials(clientData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold leading-tight">{clientData.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(clientData.status)}>
                    {clientData.status.charAt(0).toUpperCase() + clientData.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {clientData.id}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(clientData.joinedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last activity {formatDate(clientData.lastActivity)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Client
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Export Client Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DollarSign className="w-4 h-4 mr-2" />
                Create Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4" variant="line">
          <TabsTrigger variant="line" value="overview" className="flex items-center gap-1">
            <User className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger variant="line" value="cases" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Cases
          </TabsTrigger>
          <TabsTrigger variant="line" value="payments" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Payments
          </TabsTrigger>
          <TabsTrigger variant="line" value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Contact Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{clientData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{clientData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Country</p>
                      <p className="text-sm text-muted-foreground">{clientData.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{clientData.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Client Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Cases</span>
                    <span className="font-semibold">{clientData.cases.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-semibold">{formatCurrency(clientData.paymentSummary.totalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold text-green-600">{formatCurrency(clientData.paymentSummary.paid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="font-semibold text-yellow-600">{formatCurrency(clientData.paymentSummary.balance)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes & Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {clientData.notes}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
                <CardDescription>Last 4 interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientData.communications.slice(0, 4).map((comm) => (
                    <div key={comm.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full mt-0.5 ${
                        comm.type === 'email' ? 'bg-blue-100' :
                        comm.type === 'call' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <Mail className={`h-3 w-3 ${
                          comm.type === 'email' ? 'text-blue-600' :
                          comm.type === 'call' ? 'text-green-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{comm.subject}</p>
                        <p className="text-xs text-muted-foreground">{comm.summary}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(comm.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cases Tab */}
        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>Client Cases</CardTitle>
              <CardDescription>All visa cases associated with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Visa Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Filing Deadline</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientData.cases.map((caseItem) => (
                    <TableRow key={caseItem.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{caseItem.id}</TableCell>
                      <TableCell>{caseItem.visaType}</TableCell>
                      <TableCell>
                        <Badge className={getCaseStatusBadge(caseItem.status)}>
                          {caseItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(caseItem.priority)}>
                          {caseItem.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${caseItem.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{caseItem.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(caseItem.filingDeadline)}</TableCell>
                      <TableCell>{caseItem.assignedTo}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/cases/${caseItem.id}`}>
                            View Case
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Payment Summary */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(clientData.paymentSummary.totalValue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(clientData.paymentSummary.paid)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(clientData.paymentSummary.balance)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Next Payment Due</p>
                    <p className="text-lg font-bold">{formatDate(clientData.paymentSummary.nextPaymentDue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Plan */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Payment Plan</CardTitle>
                <CardDescription>Scheduled payments and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.paymentSummary.paymentPlan.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{payment.name}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge className={
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.status === 'paid' ? formatDate(payment.date) : formatDate(payment.dueDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Client Documents</CardTitle>
              <CardDescription>All documents uploaded by or for this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientData.documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}