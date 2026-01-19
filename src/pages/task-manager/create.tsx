import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Calendar, FileText } from "lucide-react";

export default function CreateCase() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visaType: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    filingDeadline: "",
    priority: "medium",
    caseManager: "",
    description: ""
  });

  const visaTypes = [
    "O-1A Visa (Extraordinary Ability)",
    "O-1B Visa (Arts)",
    "EB-1A Visa (Extraordinary Ability)",
    "EB-1B Visa (Outstanding Researcher)",
    "EB-2 NIW (National Interest Waiver)",
    "EB-3 Visa (Skilled Workers)",
    "L-1 Visa (Intracompany Transferee)",
    "H-1B Visa (Specialty Occupations)"
  ];

  const caseManagers = [
    "Sarah Johnson",
    "Michael Chen",
    "David Rodriguez",
    "Emily Watson"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement case creation logic
    console.log("Creating case:", formData);
    // Navigate to the new case detail page
    navigate("/task-manager/ACV-2024-NEW");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create New Case</h1>
          <p className="text-muted-foreground mt-1">Set up a new immigration case for a client</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-full">
            <Link to="/task-manager">Cancel</Link>
          </Button>
          <Button type="submit" className="w-full" disabled={!formData.visaType || !formData.clientName}>
            Create Case
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Information */}
            <Card>
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
                <CardDescription>Basic details about the immigration case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visaType">Visa Type *</Label>
                  <Select value={formData.visaType} onValueChange={(value) => handleChange('visaType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      {visaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseManager">Case Manager *</Label>
                  <Select value={formData.caseManager} onValueChange={(value) => handleChange('caseManager', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign case manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseManagers.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filingDeadline">Target Filing Deadline *</Label>
                  <Input
                    id="filingDeadline"
                    type="date"
                    value={formData.filingDeadline}
                    onChange={(e) => handleChange('filingDeadline', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Case Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the case, client background, or special considerations..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Primary applicant details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Full Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client's full name"
                    value={formData.clientName}
                    onChange={(e) => handleChange('clientName', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email Address *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => handleChange('clientEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Phone Number</Label>
                    <Input
                      id="clientPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.clientPhone}
                      onChange={(e) => handleChange('clientPhone', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formData.clientName || "Not specified"}</p>
                    <p className="text-muted-foreground">Client</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formData.visaType || "Not selected"}</p>
                    <p className="text-muted-foreground">Visa Type</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formData.filingDeadline || "Not set"}</p>
                    <p className="text-muted-foreground">Filing Deadline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}