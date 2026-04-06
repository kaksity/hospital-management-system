import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Bell,
  ChevronRight,
  Home,
  HelpCircle,
  Search,
  Settings,
  UserPlus,
  PlusCircle,
  Check,
  ChevronDown,
  Hospital,
  FileText,
  CreditCard,
  Activity,
  User,
  Clock,
  CheckCheck,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Patient Registered",
    description: "Olusola Adebayo was added to the registry by Admin.",
    time: "2m ago",
    type: "patient",
    unread: true,
    icon: User,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Invoice Generated",
    description: "Invoice INV-83921 (₦185,000) for Sarah Smith is ready.",
    time: "15m ago",
    type: "invoice",
    unread: true,
    icon: FileText,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 3,
    title: "Payment Received",
    description: "Successfully processed payment of ₦45,000 for INV-91022.",
    time: "1h ago",
    type: "payment",
    unread: false,
    icon: CreditCard,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 4,
    title: "Report Finalized",
    description: "MRI Brain report for Michael Brown is ready for review.",
    time: "3h ago",
    type: "report",
    unread: false,
    icon: Activity,
    color: "bg-purple-100 text-purple-600",
  },
];

// Enhanced breadcrumb mapping with support for dynamic segments
const getBreadcrumbs = (pathname: string) => {
  const pathMap: Record<string, { label: string; href?: string }> = {
    "/": { label: "Dashboard", href: "/" },
    "/task-manager": { label: "Tasks", href: "/task-manager" },
    "/task-manager/create": { label: "Create Task", href: "/task-manager/create" },
    "/diagnostic-reports": { label: "Diagnostic Reports", href: "/diagnostic-reports" },
    "/help-desk": { label: "Help Desk", href: "/help-desk" },
    "/payments": { label: "Payments", href: "/payments" },
    "/insights": { label: "Insights", href: "/insights" },
    "/patients": { label: "Patients", href: "/patients" },
    "/patients/create": { label: "Create New Patient", href: "/patients/create" },
    "/patients/import": { label: "Import Records", href: "/patients/import" },
    "/admin/products": { label: "Visa Products", href: "/admin/products" },
    "/admin/users": { label: "User Management", href: "/admin/users" },
    "/invoices": { label: "Invoices", href: "/invoices" },
    "/ambulance": { label: "Ambulance Requests", href: "/ambulance" },
    "/lab-reports": { label: "Lab Reports", href: "/lab-reports" },
    "/lab-reports/catalog": { label: "Test Catalog", href: "/lab-reports/catalog" },
    "/invoices/create": { label: "Create Invoice", href: "/invoices/create" },
    "/templates": { label: "Report Templates", href: "/templates" },
    "/templates/create": { label: "Create Template", href: "/templates/create" },
  };

  // Handle dynamic lab-report detail pages
  if (pathname.startsWith('/lab-reports/') && !['/lab-reports/catalog'].includes(pathname)) {
    const reportId = pathname.split('/')[2];
    return [
      { label: "Dashboard", href: "/" },
      { label: "Lab Reports", href: "/lab-reports" },
      { label: `Report ${reportId}`, href: pathname },
    ];
  }

  // Handle dynamic patient detail pages
  if (pathname.startsWith('/patients/') && !['/patients/create', '/patients/import'].includes(pathname)) {
    const patientId = pathname.split('/')[2];
    return [
      { label: "Dashboard", href: "/" },
      { label: "Patients", href: "/patients" },
      { label: `Patient Profile`, href: pathname }
    ];
  }

  // Handle dynamic task-manager pages (e.g., /task-manager/123 or /task-manager/edit/123)
  if (pathname.startsWith('/task-manager/') && pathname !== '/task-manager/create') {
    const segments = pathname.split('/');

    // Handle edit route: /task-manager/edit/:id
    if (segments[2] === 'edit') {
      const taskId = segments[3];
      return [
        { label: "Dashboard", href: "/" },
        { label: "Tasks", href: "/task-manager" },
        { label: `Edit Task ${taskId || ''}`.trim(), href: pathname }
      ];
    }

    // Handle view route: /task-manager/:id
    const taskId = segments[2];
    return [
      { label: "Dashboard", href: "/" },
      { label: "Tasks", href: "/task-manager" },
      { label: `Task ${taskId}`, href: pathname }
    ];
  }

  // Handle dynamic diagnostic-reports pages
  if (pathname.startsWith('/diagnostic-reports/')) {
    const segments = pathname.split('/');
    const docId = segments[2];

    if (docId === 'create') {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Diagnostic Reports", href: "/diagnostic-reports" },
        { label: "Create Report", href: pathname }
      ];
    }

    if (segments[3] === 'edit') {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Diagnostic Reports", href: "/diagnostic-reports" },
        { label: `Edit Report ${docId}`, href: pathname }
      ];
    }

    return [
      { label: "Dashboard", href: "/" },
      { label: "Diagnostic Reports", href: "/diagnostic-reports" },
      { label: `Report ${docId}`, href: pathname }
    ];
  }

  // Handle dynamic template pages
  if (pathname.startsWith('/templates/')) {
    const segments = pathname.split('/');
    const subRoute = segments[2];

    if (subRoute === 'create') {
      return [
        { label: "Dashboard", href: "/" },
        { label: "Report Templates", href: "/templates" },
        { label: "Create Template", href: pathname }
      ];
    }

    if (subRoute === 'edit') {
      const templateId = segments[3];
      return [
        { label: "Dashboard", href: "/" },
        { label: "Report Templates", href: "/templates" },
        { label: `Edit Template ${templateId || ''}`.trim(), href: pathname }
      ];
    }
  }

  // Default breadcrumb generation for known paths
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: "Dashboard", href: "/" }];

  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const mappedItem = pathMap[currentPath];

    if (mappedItem) {
      breadcrumbs.push({
        label: mappedItem.label,
        href: mappedItem.href || currentPath
      });
    } else if (index === paths.length - 1) {
      // Last segment without mapping - use as-is
      breadcrumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        href: currentPath
      });
    }
  });

  return breadcrumbs;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const isDashboard = location.pathname === '/';

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0 h-full">
          <header className="flex-shrink-0 sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
            {/* Left side: Breadcrumbs */}
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger />

              <div className="h-6 w-px bg-border hidden md:block" />

              <div className="hidden lg:flex items-center gap-2 text-sm max-w-[300px] overflow-hidden">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-2 shrink-0">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}

                    {index === 0 ? (
                      <Link
                        to={crumb.href!}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Home className="h-4 w-4" />
                        {isDashboard && <span>Dashboard</span>}
                      </Link>
                    ) : index === breadcrumbs.length - 1 ? (
                      <span className="font-semibold text-foreground truncate">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.href!}
                        className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Search */}
            <div className="flex flex-1 justify-center px-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="w-full pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1"
                />
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground group">
                    <HelpCircle className="h-5 w-5 transition-colors group-hover:text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[320px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                  {/* Header Area */}
                  <div className="bg-primary px-5 pt-8 pb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <HelpCircle className="h-20 w-20 text-white animate-pulse" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-white leading-tight">Hi {user?.name?.split(' ')[0] || "there"}!</h3>
                      <p className="text-[13px] font-medium text-primary-foreground/80 mt-1">Let's make the lab more productive</p>
                    </div>
                  </div>

                  {/* Resource Center Card */}
                  <div className="px-4 pb-4 -mt-6 relative z-20">
                    <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 p-4">
                      <div className="mb-4">
                        <h4 className="text-[15px] font-semibold text-slate-800">Resource center</h4>
                        <p className="text-xs font-medium text-slate-600">Get started with these tools below</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: Wrench, label: "Setup Assistance", color: "text-blue-500", bg: "bg-blue-50" },
                          { icon: BookOpen, label: "Help Center", color: "text-emerald-500", bg: "bg-emerald-50" },
                          { icon: Lightbulb, label: "Feature Request", color: "text-amber-500", bg: "bg-amber-50" },
                          { icon: MessageSquare, label: "Send Feedback", color: "text-purple-500", bg: "bg-purple-50" },
                        ].map((item, i) => (
                          <button
                            key={i}
                            className="flex flex-col items-start p-3 rounded-xl border hover:border-input/50 hover:bg-slate-50/50 transition-all text-left group"
                          >
                            <div className={cn("p-2 rounded-lg mb-2 transition-transform group-hover:scale-110", item.bg)}>
                              <item.icon className={cn("h-4 w-4", item.color)} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 leading-tight">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">V1.1.0-Stable</span>
                    <button className="text-[11px] font-black text-primary hover:underline transition-all">What's new?</button>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fe5e41] border-2 border-card"></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[360px] p-0 overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none hover:bg-slate-200 cursor-pointer gap-2">
                      <CheckCheck className="h-4 w-4" />
                      Mark all as read
                    </Badge>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="flex flex-col">
                      {MOCK_NOTIFICATIONS.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-3 p-4 pl-5 border-b last:border-none hover:bg-slate-50 transition-colors cursor-pointer relative group",
                            notification.unread && "bg-primary/[0.02]"
                          )}
                        >
                          {notification.unread && (
                            <div className="absolute left-2 top-[35px] -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                          )}
                          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0", notification.color)}>
                            <notification.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className={cn("text-[13px] font-bold leading-none", notification.unread ? "text-slate-900" : "text-slate-600")}>
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                                <Clock className="h-3 w-3" />
                                {notification.time}
                              </div>
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                              {notification.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-3 bg-slate-50 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-[13px] font-semibold text-primary group">
                      View all notifications
                      <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="h-6 w-px bg-border mx-1" />

              {/* Organization Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                        <Hospital className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-semibold hidden sm:inline-block">Broadplaces Radiology</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Broadplaces Radiology
                      </p>
                      <p className="text-xs leading-none text-muted-foreground flex items-center gap-2">
                        <span className="text-xs">🇳🇬</span>
                        Admin Account
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4" />
                    <span>Org Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="h-4 w-4" />
                    <span>Add a new member</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PlusCircle className="h-4 w-4" />
                    <span>Add a new lab</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Current Lab
                  </div>
                  <DropdownMenuItem className="bg-muted/50">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="flex-1">Main Facility - Lagos</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto min-w-0 bg-[#fafafa]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}