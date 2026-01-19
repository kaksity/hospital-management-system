// components/Modals/AssignTeamMemberModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

interface AssignTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
  currentAssignee: string | null;
  onAssign: (member: TeamMember) => void;
  onClearAssignment: () => void;
}

export function AssignTeamMemberModal({
  open,
  onOpenChange,
  teamMembers,
  currentAssignee,
  onAssign,
  onClearAssignment,
}: AssignTeamMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(
    teamMembers.find(member => member.name === currentAssignee) || null
  );

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarBg = (seed: string) => {
    const colors = ["bg-blue-200", "bg-green-200", "bg-purple-200", "bg-pink-200", "bg-yellow-200"];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash % colors.length)];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Case to Team Member</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Team Members List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedMember?.id === member.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-muted/50"
                )}
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex gap-3 items-center flex-1">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={cn("text-sm font-semibold", getAvatarBg(member.name))}>
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-[15px] font-medium leading-tight">{member.name}</div>
                    <div className="text-sm text-muted-foreground capitalize leading-tight">{member.role}</div>
                  </div>
                </div>
                {/* Checkmark on the far right */}
                <div className="flex-shrink-0">
                  {(currentAssignee === member.name || selectedMember?.id === member.id) && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Clear Assignment */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {selectedMember && selectedMember.name !== currentAssignee && (
              <Button
                onClick={() => {
                  onAssign(selectedMember);
                  onOpenChange(false);
                }}
              >
                Assign to {selectedMember.name}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}