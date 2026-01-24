"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Users, Scan, Calendar as CalendarIcon, ChevronDown, X, LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  patientType: string;
  phone: string;
  email: string;
  lastVisit: string;
  totalVisits: number;
  lastService: string;
  pendingTests: string[];
  avatar: string;
  status: string;
  referringHospital?: string;
  referringDoctor?: string;
}

interface PatientCollectionProps {
  patients: Patient[];
  selectedPatientId?: string;
  onPatientSelect: (patientId: string) => void;
  emptyState?: {
    title: string;
    description: string;
    actionLabel?: string;
    actionIcon?: LucideIcon;
    onActionClick?: () => void;
  };
  label?: string;
  required?: boolean;
  className?: string;
}

export function PatientCollection({
  patients,
  selectedPatientId,
  onPatientSelect,
  emptyState,
  label = "Select Patient",
  required = false,
  className
}: PatientCollectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
    );
  }, [patients, searchQuery]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const getPatientTypeBadge = (type: string) => {
    const variants = {
      regular: "bg-blue-100 text-blue-700",
      private: "bg-purple-100 text-purple-700",
      hmo: "bg-green-100 text-green-700",
    };
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-700";
  };

  const getGenderBadge = (gender: string) => {
    return gender === 'Male'
      ? "bg-blue-100 text-blue-700"
      : "bg-pink-100 text-pink-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePatientSelect = (patientId: string) => {
    onPatientSelect(patientId);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const handleClearSelection = () => {
    onPatientSelect("");
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-4", className)} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg border border-input bg-white text-left text-sm",
            "hover:bg-muted/50 transition-colors",
            !selectedPatient && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            {selectedPatient ? (
              <>
                <Avatar className="h-8 w-8 border border-muted shadow-sm">
                  <AvatarImage src={getPatientAvatarPath(selectedPatient.id, selectedPatient.gender)} alt={selectedPatient.name} />
                  <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(selectedPatient.name))}>
                    {getAvatarInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{selectedPatient.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <code>{selectedPatient.id}</code>
                    <Badge className={cn("text-[10px]", getGenderBadge(selectedPatient.gender))}>
                      {selectedPatient.gender.charAt(0)}
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Click to select a patient</span>
              </>
            )}
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isDropdownOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg !z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, ID, or phone..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {filteredPatients.length > 0 ? (
                <div>
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={cn(
                        "p-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                        selectedPatientId === patient.id && "bg-primary/5"
                      )}
                      onClick={() => handlePatientSelect(patient.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 border border-muted shadow-sm">
                          <AvatarImage src={getPatientAvatarPath(patient.id, patient.gender)} alt={patient.name} />
                          <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(patient.name))}>
                            {getAvatarInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm font-semibold truncate">{patient.name}</div>
                            <code className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {patient.id}
                            </code>
                            <Badge className={cn("text-[10px]", getGenderBadge(patient.gender))}>
                              {patient.gender.charAt(0)}
                            </Badge>
                            <Badge className={cn("text-[10px] capitalize", getPatientTypeBadge(patient.patientType))}>
                              {patient.patientType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : patients.length === 0 && emptyState ? (
                <div className="p-4">
                  <EmptyState
                    icon={Users}
                    title={emptyState.title}
                    description={emptyState.description}
                    action={emptyState.actionLabel && emptyState.onActionClick ? {
                      label: emptyState.actionLabel,
                      onClick: emptyState.onActionClick,
                      icon: emptyState.actionIcon
                    } : undefined}
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No patients found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Patient Details (shown outside dropdown) */}
      {selectedPatient && (
        <div className="p-4 rounded-xl border bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-muted shadow-sm">
                <AvatarImage src={getPatientAvatarPath(selectedPatient.id, selectedPatient.gender)} alt={selectedPatient.name} />
                <AvatarFallback className={cn("text-xs font-semibold", getAvatarBg(selectedPatient.name))}>
                  {getAvatarInitials(selectedPatient.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-[15px]">{selectedPatient.name}</h4>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono font-semibold bg-muted px-2 py-1 rounded">{selectedPatient.id}</code>
                  <Badge className={cn("text-xs capitalize", getPatientTypeBadge(selectedPatient.patientType))}>
                    {selectedPatient.patientType}
                  </Badge>
                  <Badge className={cn("text-xs", getGenderBadge(selectedPatient.gender))}>
                    {selectedPatient.gender}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-3 gap-4 text-[13px]">
            <div>
              <span className="text-muted-foreground">Total Visits:</span>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium">{selectedPatient.totalVisits}</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Last Visit:</span>
              <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className="font-medium">{formatDate(selectedPatient.lastVisit)}</span>
              </div>
            </div>
            {selectedPatient.lastService && (
              <div>
                <span className="text-[13px] font-medium text-muted-foreground">Last Service:</span>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">
                    {selectedPatient.lastService}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Pending Tests */}
          {selectedPatient.pendingTests.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Scan className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[13px] font-medium text-muted-foreground">Pending Tests:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.pendingTests.map((test, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-amber-100 text-amber-700 border-[#deb965]">
                      {test}
                    </Badge>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Returning Patient Notice */}
          {selectedPatient.totalVisits > 1 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Returning patient ({selectedPatient.totalVisits} visits). Comparison study will be auto-selected.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}