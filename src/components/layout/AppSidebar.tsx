import { Home, FileText, DollarSign, Settings, Users, Briefcase, ChevronDown, UserIcon, LogOut, MessageSquareMore, TicketsPlane, Receipt, BarChart3, Building2, UserCog, LayoutGrid, ScrollText, ClipboardCheck, CalendarCheck, IdCard, Hospital, Stethoscope, FormInputIcon, LayoutPanelTop } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth, getAvatarInitials } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getNavigationItems = (role: string) => {
  const baseItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Appointments", url: "/appointments", icon: CalendarCheck },
  ];

  const adminItems = [
    { title: "Tasks", url: "/task-manager", icon: ClipboardCheck },
    { title: "Patients", url: "/patients", icon: IdCard },
    { title: "Invoices", url: "/invoices", icon: Receipt },
    { title: "Diagnostic Reports", url: "/diagnostic-reports", icon: FileText },
    { title: "Hospitals", url: "/hospitals", icon: Hospital },
    { title: "Doctors", url: "/doctors", icon: Stethoscope },
    { title: "Services", url: "/services", icon: LayoutGrid },
    { title: "Templates", url: "/templates", icon: LayoutPanelTop },
    { title: "Communication", url: "/communication", icon: MessageSquareMore },
    { title: "Insights", url: "/insights", icon: BarChart3 },
    { title: "Payments", url: "/payments", icon: DollarSign },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const attorneyParalegalItems = [
    { title: "Tasks", url: "/task-manager", icon: Briefcase },
    { title: "Diagnostic Reports", url: "/diagnostic-reports", icon: FileText },
    { title: "Communication", url: "/communication", icon: MessageSquareMore },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const clientItems = [
    { title: "Diagnostic Reports", url: "/diagnostic-reports", icon: FileText },
    { title: "Payments", url: "/payments", icon: DollarSign },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  switch (role) {
    case 'admin':
      return [...baseItems, ...adminItems];
    case 'attorney':
    case 'paralegal':
      return [...baseItems, ...attorneyParalegalItems];
    case 'client':
      return [...baseItems, ...clientItems];
    default:
      return baseItems;
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout, switchUser } = useAuth();
  const collapsed = state === "collapsed";

  const navigationItems = getNavigationItems(user?.role || 'client');

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/images/logos/agora-logo-dark.png"
            alt="Agora Visa Platform"
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                  >
                    {({ isActive }) => (
                      <SidebarMenuButton asChild isActive={isActive}>
                        <div className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 ${isActive
                          ? "!bg-gray-100 text-foreground font-medium [&_svg]:!text-[#fe5e41] hover:!bg-gray-100 focus:!bg-gray-100 active:!bg-gray-100"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground [&_svg]:text-muted-foreground focus:bg-transparent active:bg-transparent"
                          }`}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile in Sidebar Footer */}
      <SidebarFooter className="border-t border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start hover:bg-muted transition-colors px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getAvatarInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.name || "Loading..."}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/60 flex-shrink-0" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64" side="top">
            <DropdownMenuLabel>
              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-sidebar-primary text-primary-foreground">
                    {user ? getAvatarInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Development Role Switcher */}
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Development - Switch Role
            </DropdownMenuLabel>
            <div className="grid grid-cols-2 gap-1 px-2 py-1">
              <Button
                variant={user?.role === 'admin' ? "default" : "outline"}
                size="sm"
                onClick={() => switchUser('admin')}
                className="h-8 text-xs"
              >
                Ope (Admin)
              </Button>
              <Button
                variant={user?.role === 'paralegal' ? "default" : "outline"}
                size="sm"
                onClick={() => switchUser('paralegal')}
                className="h-8 text-xs"
              >
                Sarah (Para)
              </Button>
              <Button
                variant={user?.role === 'attorney' ? "default" : "outline"}
                size="sm"
                onClick={() => switchUser('attorney')}
                className="h-8 text-xs"
              >
                Michael (Atty)
              </Button>
              <Button
                variant={user?.role === 'client' ? "default" : "outline"}
                size="sm"
                onClick={() => switchUser('client')}
                className="h-8 text-xs"
              >
                Alex (Client)
              </Button>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}