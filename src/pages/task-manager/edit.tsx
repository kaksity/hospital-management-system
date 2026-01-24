"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  User,
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Scan,
  AlertTriangle,
  FileText,
  Tag,
  CreditCard,
  Building,
  Phone,
  Mail,
  ChevronDown,
  Search,
  Link,
  UserPlus,
  Trash2,
  Copy,
  History,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock data for editing
const mockTask = {
  id: "TSK-2024-001",
  patientName: "John Adebayo",
  patientId: "PT-2024-001",
  phone: "0800 123 4567",
  email: "john.adebayo@example.com",
  patientType: "hmo" as const,
  insurance: "ABC Insurance Co.",
  service: "MRI",
  subService: "Brain with Contrast",
  date: new Date("2024-11-20"),
  time: "10:30",
  priority: "high" as const,
  referringDoctor: "Dr. Ope Adeyemi",
  clinicalNotes: "Rule out metastases, known lung cancer. Patient has history of smoking for 15 years.",
  isEmergency: true,
  isComparison: false,
  isWalkIn: false,
  tags: ["neuro", "urgent", "oncology"],
  assignedDoctor: "1",
  status: "pending" as const,
  createdAt: new Date("2024-11-19"),
  createdBy: "Admin User",
  lastModified: new Date("2024-11-19"),
  modifiedBy: "Admin User"
};

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("09:00");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isComparison, setIsComparison] = useState(false);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const doctors = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Radiologist" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Radiologist" },
    { id: "3", name: "Dr. Ope Adeyemi", specialty: "Neurologist" },
    { id: "4", name: "Dr. David Lee", specialty: "Orthopedist" },
  ];

  const services = [
    "MRI",
    "CT Scan",
    "X-Ray",
    "Ultrasound",
    "Mammography",
    "Angiography",
    "Nuclear Medicine",
    "Fluoroscopy"
  ];

  const subServices = [
    "MRI Brain",
    "MRI Spine",
    "CT Chest",
    "CT Abdomen",
    "X-Ray Chest",
    "X-Ray Wrist",
    "Ultrasound Pelvis",
    "Ultrasound Abdomen"
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  ];

  const patientTypes = [
    { value: "regular", label: "Regular", color: "bg-blue-100 text-blue-800" },
    { value: "private", label: "Private", color: "bg-purple-100 text-purple-800" },
    { value: "hmo", label: "HMO", color: "bg-green-100 text-green-800" },
  ];

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "draft", label: "Draft", color: "bg-blue-100 text-blue-800" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
    { value: "assigned", label: "Assigned", color: "bg-purple-100 text-purple-800" },
  ];

  useEffect(() => {
    // Simulate loading task data
    setTimeout(() => {
      setDate(mockTask.date);
      setTime(mockTask.time);
      setTags(mockTask.tags);
      setIsEmergency(mockTask.isEmergency);
      setIsComparison(mockTask.isComparison);
      setIsWalkIn(mockTask.isWalkIn);
      setSelectedDoctor(mockTask.assignedDoctor);
      setIsLoading(false);
    }, 500);
  }, []);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call
    console.log("Updating task...");
    navigate("/task-manager");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      // Delete logic here
      navigate("/task-manager");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading task data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">Edit Task</h1>
              <Badge variant="outline" className="font-mono text-primary border-primary">
                {mockTask.id}
              </Badge>
            </div>
            <p className="text-slate-600 mt-1">Update task details and assignment</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate(`/task-manager`)}
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => navigate("/task-manager")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Patient & Task Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Status & Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <History className="h-5 w-5 text-primary" />
                      Task Information
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-slate-600">Status:</Label>
                      <Select defaultValue={mockTask.status}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", status.value === 'pending' ? 'bg-yellow-500' : status.value === 'draft' ? 'bg-blue-500' : status.value === 'completed' ? 'bg-green-500' : 'bg-purple-500')} />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Created By</p>
                      <p className="font-medium">{mockTask.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Created On</p>
                      <p className="font-medium">{format(mockTask.createdAt, "MMM dd, yyyy HH:mm")}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Last Modified</p>
                      <p className="font-medium">{format(mockTask.lastModified, "MMM dd, yyyy HH:mm")}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Modified By</p>
                      <p className="font-medium">{mockTask.modifiedBy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Full Name *</Label>
                      <Input
                        id="patientName"
                        defaultValue={mockTask.patientName}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        defaultValue={mockTask.patientId}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          defaultValue={mockTask.phone}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={mockTask.email}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Patient Type *</Label>
                    <RadioGroup defaultValue={mockTask.patientType} className="flex gap-4">
                      {patientTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={type.value} id={`edit-${type.value}`} />
                          <Label
                            htmlFor={`edit-${type.value}`}
                            className={cn(
                              "px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer",
                              type.color
                            )}
                          >
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance/HMO Provider</Label>
                    <Input
                      id="insurance"
                      defaultValue={mockTask.insurance}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Task Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scan className="h-5 w-5 text-primary" />
                    Task Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Type *</Label>
                      <Select defaultValue={mockTask.service}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subService">Sub-Service *</Label>
                      <Select defaultValue={mockTask.subService}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {subServices.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Date & Time *</Label>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "MMM dd, yyyy") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="relative flex-1">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority *</Label>
                      <Select defaultValue={mockTask.priority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", priority.value === 'high' ? 'bg-red-500' : priority.value === 'medium' ? 'bg-yellow-500' : 'bg-green-500')} />
                                {priority.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referringDoctor">Referring Doctor</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="referringDoctor"
                        defaultValue={mockTask.referringDoctor}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicalNotes">Clinical Notes/History</Label>
                    <Textarea
                      id="clinicalNotes"
                      defaultValue={mockTask.clinicalNotes}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Flags & Tags</Label>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <Label htmlFor="emergency" className="cursor-pointer">
                            Emergency Case
                          </Label>
                        </div>
                        <Switch
                          id="emergency"
                          checked={isEmergency}
                          onCheckedChange={setIsEmergency}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <Label htmlFor="comparison" className="cursor-pointer">
                            Requires Comparison
                          </Label>
                        </div>
                        <Switch
                          id="comparison"
                          checked={isComparison}
                          onCheckedChange={setIsComparison}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-purple-500" />
                          <Label htmlFor="walkin" className="cursor-pointer">
                            Walk-in Patient
                          </Label>
                        </div>
                        <Switch
                          id="walkin"
                          checked={isWalkIn}
                          onCheckedChange={setIsWalkIn}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tags (neuro, urgent, follow-up...)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-3 py-1 flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Assignment & Actions */}
            <div className="space-y-6">
              {/* Assignment Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Assign Radiologist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Radiologist</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Search or select radiologist">
                          {selectedDoctor ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {doctors.find(d => d.id === selectedDoctor)?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{doctors.find(d => d.id === selectedDoctor)?.name}</span>
                            </div>
                          ) : (
                            "Search or select radiologist"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search doctors..."
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {doctor.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium">{doctor.name}</div>
                                  <div className="text-xs text-slate-500">{doctor.specialty}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDoctor && (
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {doctors.find(d => d.id === selectedDoctor)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {doctors.find(d => d.id === selectedDoctor)?.name}
                          </div>
                          <div className="text-sm text-slate-600">
                            {doctors.find(d => d.id === selectedDoctor)?.specialty}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button type="submit" className="w-full h-12 text-base font-semibold">
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => navigate("/task-manager")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Activity Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "Task created", user: "Admin User", time: "2 hours ago" },
                    { action: "Assigned to Dr. Sarah Johnson", user: "Admin User", time: "1 hour ago" },
                    { action: "Priority changed to High", user: "System", time: "45 minutes ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-slate-500">
                          by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}