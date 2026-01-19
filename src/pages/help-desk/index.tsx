import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, User, Search, MoreVertical, Archive, Trash2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


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

export default function Messages() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Paralegal",
      lastMessage: "I've reviewed your media coverage documents. They look great!",
      time: "2 hours ago",
      unread: 2,
      active: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Attorney",
      lastMessage: "Can you provide more details about your judging experience?",
      time: "1 day ago",
      unread: 0,
      active: false
    },
    {
      id: 3,
      name: "David Rodriguez",
      role: "Attorney",
      lastMessage: "The petition is ready for final review.",
      time: "2 days ago",
      unread: 0,
      active: false
    },
    {
      id: 4,
      name: "Emily Watson",
      role: "Paralegal",
      lastMessage: "Please upload the additional evidence we discussed.",
      time: "3 days ago",
      unread: 1,
      active: false
    }
  ];

  const availableUsers = [
    { id: 1, name: "Lisa Wang", role: "Senior Attorney", available: true },
    { id: 2, name: "Robert Brown", role: "Case Manager", available: true },
    { id: 3, name: "Maria Garcia", role: "Paralegal", available: false },
    { id: 4, name: "James Wilson", role: "Immigration Specialist", available: true },
    { id: 5, name: "Jennifer Lee", role: "Attorney", available: true },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      role: "Paralegal",
      content: "Hi John! I hope you're doing well. I wanted to let you know that I've started reviewing your recent document uploads.",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Thanks Sarah! I just uploaded some additional press coverage. Let me know if you need anything else.",
      time: "10:45 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      role: "Paralegal",
      content: "Perfect timing! I've reviewed your media coverage documents. They look great and strongly support the Published Material criterion. The TechCrunch feature is particularly impressive.",
      time: "11:15 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      role: "Paralegal",
      content: "One thing - could you also provide the circulation numbers or audience reach metrics for the publications? That would strengthen the evidence even more.",
      time: "11:16 AM",
      isOwn: false
    },
    {
      id: 5,
      sender: "You",
      content: "Absolutely! I'll gather those metrics and upload them by end of day.",
      time: "11:30 AM",
      isOwn: true
    }
  ];

  const handleStartConversation = () => {
    // TODO: Implement actual conversation creation
    console.log("Starting conversation with:", selectedUser);
    setIsNewMessageOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex w-full overflow-hidden">
        {/* Left Pane - Conversations List */}
        <div className="w-80 border-r flex flex-col h-full">
          {/* Search Section */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* Scrollable Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-3">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    conv.active 
                      ? "bg-primary/10" 
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={`${getAvatarBg(conv.name)} text-xs`}>
                        {getInitials(conv.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conv.name}</p>
                        {conv.unread > 0 && (
                          <Badge className="ml-2 bg-destructive text-destructive-foreground h-5 min-w-5 px-1.5 text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[13px] text-muted-foreground line-clamp-2 leading-tight">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* New Message Button - Fixed at bottom */}
          <div className="p-4 border-t">
            <Button 
              className="w-full gap-2" 
              onClick={() => setIsNewMessageOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>

        {/* Right Pane - Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Top Section - Message Info & Actions */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${getAvatarBg("Sarah Johnson")}`}>
                    {getInitials("Sarah Johnson")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground">Paralegal - Case Manager</p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4" />
                    Archive Conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Middle Section - Chat Messages (Scrollable) */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={msg.isOwn ? "bg-accent" : getAvatarBg(msg.sender)}>
                      {msg.isOwn ? <User className="h-4 w-4" /> : getInitials(msg.sender)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col gap-1 max-w-[70%] ${msg.isOwn ? "items-end" : ""}`}>
                    {!msg.isOwn && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {msg.sender}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        msg.isOwn
                          ? "bg-blue-50 text-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Bottom Section - Message Input */}
          <div className="border-t p-4">
            <div className="border rounded-lg p-2">
              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon" className="shrink-0 border-transparent hover:border-muted-foreground/20">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      setMessage("");
                    }
                  }}
                />
                <Button 
                  className="shrink-0 gap-2 border-transparent hover:border-muted-foreground/20" 
                  onClick={() => setMessage("")}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Select a team member to start a new conversation with.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                className={`w-full rounded-lg p-3 text-left transition-colors border ${
                  selectedUser === user.id
                    ? "bg-primary/10 border-primary/50"
                    : "hover:bg-muted border-border"
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`${getAvatarBg(user.name)} text-sm`}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{user.name}</p>
                      <div className={`h-2 w-2 rounded-full ${user.available ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <DialogFooter className="sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsNewMessageOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartConversation}
              disabled={!selectedUser}
              className="flex-1"
            >
              Start Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}