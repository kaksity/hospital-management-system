import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Bell, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Enhanced breadcrumb mapping with support for dynamic segments
const getBreadcrumbs = (pathname: string) => {
  const pathMap: Record<string, { label: string; href?: string }> = {
    "/": { label: "Dashboard", href: "/" },
    "/cases": { label: "Cases", href: "/cases" },
    "/cases/create": { label: "Create Case", href: "/cases/create" },
    "/documents": { label: "Documents", href: "/documents" },
    "/messages": { label: "Messages", href: "/messages" },
    "/payments": { label: "Payments", href: "/payments" },
    "/admin/products": { label: "Visa Products", href: "/admin/products" },
    "/admin/users": { label: "User Management", href: "/admin/users" },
  };

  // Handle dynamic case pages (e.g., /cases/123)
  if (pathname.startsWith('/cases/') && pathname !== '/cases/create') {
    const caseId = pathname.split('/')[2];
    return [
      { label: "Dashboard", href: "/" },
      { label: "Cases", href: "/cases" },
      { label: `Case ${caseId}`, href: pathname }
    ];
  }

  // Handle dynamic document pages
  if (pathname.startsWith('/documents/')) {
    const docId = pathname.split('/')[2];
    return [
      { label: "Dashboard", href: "/" },
      { label: "Documents", href: "/documents" },
      { label: `Document ${docId}`, href: pathname }
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
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              
              {/* Horizontal Separator */}
              <div className="h-6 w-px bg-border" />
              
              {/* Smart Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    
                    {index === 0 ? (
                      // Home icon - conditionally show text only on dashboard
                      <Link 
                        to={crumb.href!}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Home className="h-4 w-4" />
                        {isDashboard && <span>Dashboard</span>}
                      </Link>
                    ) : index === breadcrumbs.length - 1 ? (
                      // Current page (last breadcrumb) - not clickable
                      <span className="font-semibold text-foreground">
                        {crumb.label}
                      </span>
                    ) : (
                      // Clickable breadcrumb
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

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}