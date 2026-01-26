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
  Repeat,
  Check,
  Building2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
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
  };

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
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <HelpCircle className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fe5e41]"></span>
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              {/* Organization Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline-block">Broadplaces Radiology</span>
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
                    <span>Invite a member</span>
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