// pages/applications/index.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Calendar, Clock, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { useNavigate } from "react-router-dom";
import ChooseApplicationCategoryModal from "@/components/Modals/ChooseApplicationCategoryModal";

export default function Applications() {
  const navigate = useNavigate();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Mock applications data - client view
  const applications = [
    {
      id: "ACV-2024-001",
      visaType: "O-1A Visa",
      status: "in_review",
      progress: 85,
      lastUpdated: "2025-11-15",
      filingDeadline: "2025-12-10",
      assignedTo: "Sarah Johnson",
      documentsRequired: 12,
      documentsSubmitted: 10,
      nextStep: "Review additional evidence",
      priority: "high"
    },
    {
      id: "ACV-2024-002", 
      visaType: "EB-2 NIW",
      status: "draft",
      progress: 45,
      lastUpdated: "2025-11-10",
      filingDeadline: "2026-01-15",
      assignedTo: "Michael Chen",
      documentsRequired: 8,
      documentsSubmitted: 4,
      nextStep: "Upload supporting letters",
      priority: "medium"
    },
    {
      id: "ACV-2023-045",
      visaType: "L-1 Visa",
      status: "approved",
      progress: 100,
      lastUpdated: "2025-10-01",
      filingDeadline: "2025-09-15",
      assignedTo: "David Rodriguez",
      documentsRequired: 10,
      documentsSubmitted: 10,
      nextStep: "Visa issued - Complete",
      priority: "completed"
    }
  ];

  const getStatusConfig = (status: string) => {
    const config = {
      draft: { 
        label: "Draft", 
        bgColor: "bg-gray-100", 
        textColor: "text-gray-800" 
      },
      in_review: { 
        label: "In Review", 
        bgColor: "bg-blue-100", 
        textColor: "text-blue-800" 
      },
      approved: { 
        label: "Approved", 
        bgColor: "bg-green-100", 
        textColor: "text-green-800" 
      },
      rejected: { 
        label: "Rejected", 
        bgColor: "bg-red-100", 
        textColor: "text-red-800" 
      }
    };
    return config[status as keyof typeof config] || config.draft;
  };

  const getPriorityConfig = (priority: string) => {
    const config = {
      high: { 
        label: "High", 
        bgColor: "bg-red-100", 
        textColor: "text-red-800" 
      },
      medium: { 
        label: "Medium", 
        bgColor: "bg-amber-100", 
        textColor: "text-amber-800" 
      },
      low: { 
        label: "Low", 
        bgColor: "bg-blue-100", 
        textColor: "text-blue-800" 
      },
      completed: { 
        label: "Completed", 
        bgColor: "bg-green-100", 
        textColor: "text-green-800" 
      }
    };
    return config[priority as keyof typeof config] || config.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_review":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Track your visa application progress and status
          </p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => setShowApplicationModal(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </Button>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => {
          const statusConfig = getStatusConfig(app.status);
          const priorityConfig = getPriorityConfig(app.priority);
          
          return (
            <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{app.visaType}</CardTitle>
                    <CardDescription>{app.id}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1">{statusConfig.label}</span>
                    </Badge>
                    <Badge className={`${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
                      {priorityConfig.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pb-3">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{app.progress}%</span>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                </div>

                {/* Documents */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Documents</span>
                  <span className="font-medium">
                    {app.documentsSubmitted}/{app.documentsRequired}
                  </span>
                </div>

                {/* Next Step */}
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Next Step</p>
                  <p className="font-medium line-clamp-2">{app.nextStep}</p>
                </div>

                {/* Assigned To */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Case Manager</span>
                  <span className="font-medium">{app.assignedTo}</span>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4 flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(app.filingDeadline)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Updated {formatDate(app.lastUpdated)}</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-semibold">No applications yet</h3>
              <p className="text-muted-foreground mt-1">
                Start your first visa application to get started
              </p>
            </div>
            <Button 
              onClick={() => setShowApplicationModal(true)}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Application
            </Button>
          </CardContent>
        </Card>
      )}

      <ChooseApplicationCategoryModal
        open={showApplicationModal}
        onOpenChange={setShowApplicationModal}
      />
    </div>
  );
}