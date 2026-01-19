// settings/index.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const location = useLocation();
  const { user } = useAuth();

  const allSettingsTabs = [
    {
      id: "general",
      title: "General",
      description: "Account settings and preferences",
      icon: User,
      path: "/settings/general",
      roles: ['admin', 'attorney', 'paralegal', 'client'] // All roles can access
    },
    {
      id: "security",
      title: "Security",
      description: "Password and authentication",
      icon: Shield,
      path: "/settings/security",
      roles: ['admin', 'attorney', 'paralegal', 'client'] // All roles can access
    },
    {
      id: "members",
      title: "Team Members",
      description: "Manage team access",
      icon: Users,
      path: "/settings/members",
      roles: ['admin'] // Only admins can access
    }
  ];
  
  // Filter tabs based on user role
  const settingsTabs = allSettingsTabs.filter(tab => 
    tab.roles.includes(user?.role || 'client')
  );

  const currentTab = settingsTabs.find(tab => location.pathname === tab.path) || settingsTabs[0];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and team preferences
        </p>
      </div>

      {/* Horizontal Tabs */}
      <Tabs value={currentTab.id} className="space-y-6">
        <TabsList className="w-full justify-start border-b bg-transparent rounded-none p-0 h-auto">
          {settingsTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              variant="line"
              className={cn(
                "relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-all hover:text-foreground",
                "data-[state=active]:border-[#fe5e41] data-[state=active]:text-foreground data-[state=active]:shadow-none"
              )}
              asChild
            >
              <Link to={tab.path} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.title}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}