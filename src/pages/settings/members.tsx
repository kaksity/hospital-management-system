// settings/members.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Plus, RotateCcw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InviteMemberModal } from "@/components/Modals/InviteMemberModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";


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

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function MembersSettings() {
  const { user } = useAuth();
  
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@agora.com",
      role: "Paralegal",
      status: "active",
      avatar: ""
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@agora.com",
      role: "Attorney",
      status: "active",
      avatar: ""
    },
    {
      id: 3,
      name: "David Rodriguez",
      email: "david@agora.com",
      role: "Attorney",
      status: "pending",
      avatar: ""
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily@agora.com", 
      role: "Admin",
      status: "inactive",
      avatar: ""
    }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const activeMembers = teamMembers.filter(member => member.status === "active");
  const pendingMembers = teamMembers.filter(member => member.status === "pending");
  const inactiveMembers = teamMembers.filter(member => member.status === "inactive");

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const handleResendInvite = (memberId: number) => {
    // Logic to resend invite
    console.log('Resending invite to member:', memberId);
  };

  const handleRemoveMember = (memberId: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleRevokeInvite = (memberId: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleInviteMember = (data: { firstName: string; lastName: string; email: string; role: string }) => {
    const newMember = {
      id: Date.now(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.role,
      status: "pending",
      avatar: ""
    };
    setTeamMembers(prev => [...prev, newMember]);
    setShowInviteModal(false);
  };

  const MemberTable = ({ members, showActions = true }: { members: typeof teamMembers; showActions?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="w-[80px]"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id} className="hover:bg-transparent">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={getAvatarBg(member.name)}>
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
            <TableCell>
              <Badge className={getStatusBadge(member.status)}>
                {member.status === "pending" ? "Invite Sent" : member.status}
              </Badge>
            </TableCell>
            {showActions && (
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-dropdown-ignore>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Resend Invite - only for pending status */}
                    {member.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleResendInvite(member.id)}>
                        <div className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Resend Invite
                        </div>
                      </DropdownMenuItem>
                    )}
                    
                    {/* Remove/Revoke - different labels based on status */}
                    {member.status === "active" ? (
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </div>
                      </DropdownMenuItem>
                    ) : member.status === "pending" ? (
                      <DropdownMenuItem 
                        onClick={() => handleRevokeInvite(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Revoke Invite
                        </div>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (user?.role !== 'admin') {
    return <Navigate to="/settings/general" replace />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {/* Left Column - Header */}
      <div className="space-y-1 lg:col-span-1">
        <h2 className="text-lg font-semibold">Team Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage who has access to your organization
        </p>
      </div>

      {/* Right Column - Content */}
      <div className="space-y-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{teamMembers.length} Team Members</h3>
            <p className="text-sm text-muted-foreground">
              People with access to this organization
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="active" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fe5e41] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6"
                >
                  Active Members ({activeMembers.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fe5e41] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6"
                >
                  Pending Invites ({pendingMembers.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="inactive" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fe5e41] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6"
                >
                  Inactive ({inactiveMembers.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="m-0">
                {activeMembers.length > 0 ? (
                  <MemberTable members={activeMembers} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active team members
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="m-0">
                {pendingMembers.length > 0 ? (
                  <MemberTable members={pendingMembers} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending invitations
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="inactive" className="m-0">
                {inactiveMembers.length > 0 ? (
                  <MemberTable members={inactiveMembers} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No inactive members
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        onInvite={handleInviteMember}
      />
    </div>
  );
}