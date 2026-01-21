"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  User,
  Search,
  MoreVertical,
  Archive,
  Trash2,
  Plus,
  MessageSquare,
  Stethoscope,
  Building2,
  Clock
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const getAvatarBg = (seed: string) => {
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export default function Communication() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const conversations = [
    {
      id: 1,
      name: "Dr. Ope Adeyemi",
      role: "Radiologist",
      hospital: "Evercare Hospital",
      lastMessage: "The brain MRI for patient PAT-105 is ready for review.",
      time: "10 mins ago",
      unread: 2,
      active: true,
      online: true
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      role: "Referral Physician",
      hospital: "Lagos University Teaching Hosp.",
      lastMessage: "Could you clarify the findings on the chest X-ray?",
      time: "2 hours ago",
      unread: 0,
      active: false,
      online: false
    },
    {
      id: 3,
      name: "Marketer - Tunde Lawal",
      role: "Corporate Marketer",
      hospital: "CarePak Diagnostics",
      lastMessage: "Meeting scheduled with Reddington Hospital tomorrow.",
      time: "1 day ago",
      unread: 0,
      active: false,
      online: true
    },
    {
      id: 4,
      name: "Reception - Maryam",
      role: "Admin Staff",
      hospital: "CarePak Diagnostics",
      lastMessage: "Patient Elena Rodriguez has arrived for her CT scan.",
      time: "3 days ago",
      unread: 1,
      active: false,
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Dr. Ope Adeyemi",
      content: "Hi team, I've just uploaded the report for the Brain MRI (Contrast) study.",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Excellent. I've notified the referring doctor. Should we flag any urgent findings?",
      time: "10:45 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Dr. Ope Adeyemi",
      content: "No urgent anomalies detected, but follow-up in 3 months is recommended for monitoring the lesion.",
      time: "11:15 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      content: "Copy that. Will include the follow-up recommendation in the final patient portal update.",
      time: "11:30 AM",
      isOwn: true
    }
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Sidebar - Chats List */}
      <div className="w-[380px] border-r border-border/60 flex flex-col bg-card/30">
        <div className="p-6 border-b border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Communication</h1>
            <Button size="icon" variant="ghost" onClick={() => setIsNewMessageOpen(true)}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats, doctors, hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/40 border-muted-foreground/10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-3">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "w-full rounded-xl p-4 text-left transition-all duration-200 group relative",
                  conv.active
                    ? "bg-primary/5 ring-1 ring-primary/10 shadow-sm"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarFallback className={cn("text-sm font-bold", getAvatarBg(conv.name))}>
                        {getInitials(conv.name)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-sm truncate">{conv.name}</h4>
                      <span className="text-[10px] text-muted-foreground font-medium">{conv.time}</span>
                    </div>
                    <p className="text-xs font-medium text-primary/80 mb-1">{conv.role}</p>
                    <p className="text-[13px] text-muted-foreground line-clamp-1 leading-snug">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
                {conv.unread > 0 && (
                  <div className="absolute right-4 bottom-4 h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {conv.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background relative">
        <div className="px-8 py-4 border-b border-border/60 flex items-center justify-between bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border shadow-sm">
              <AvatarFallback className={getAvatarBg("Dr. Ope Adeyemi")}>OA</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Dr. Ope Adeyemi</h3>
                <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase font-black bg-green-50 text-green-700 border-green-100">Radiologist</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span>Evercare Hospital, Lagos</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-muted/40 text-[11px] px-4 font-bold border-none text-muted-foreground">Today, Nov 20</Badge>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4 group", msg.isOwn ? "flex-row-reverse" : "")}>
                <Avatar className="h-9 w-9 shrink-0 shadow-sm border mt-1">
                  <AvatarFallback className={cn("text-xs font-bold", msg.isOwn ? "bg-muted" : getAvatarBg(msg.sender))}>
                    {msg.isOwn ? "CP" : getInitials(msg.sender)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("flex flex-col gap-1.5 max-w-[65%]", msg.isOwn ? "items-end" : "items-start")}>
                  {!msg.isOwn && <span className="text-[11px] font-bold text-muted-foreground ml-1">{msg.sender}</span>}
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                    msg.isOwn
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-muted/50 text-foreground border border-border/40 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1.5 px-1 mt-0.5">
                    <Clock className="h-2.5 w-2.5 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground/60 font-medium">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border/60 bg-card/30">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 bg-muted/40 border border-muted-foreground/10 rounded-2xl p-2 transition-all focus-within:bg-background focus-within:ring-2 ring-primary/10">
              <textarea
                placeholder="Type your clinical update or message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none max-h-32 min-h-[44px] custom-scrollbar"
                rows={1}
              />
              <div className="flex items-center justify-between border-t border-border/40 mt-2 pt-2">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="rounded-xl px-4 gap-2 h-8"
                  disabled={!message.trim()}
                >
                  <span className="text-xs font-bold">Send Message</span>
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}