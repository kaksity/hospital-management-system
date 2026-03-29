// settings/index.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Users, Building2, MessageSquare, Bell, CreditCard, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const location = useLocation();
  const { user } = useAuth();

  const allSettingsTabs = [
    {
      id: "general",
      title: "Organization",
      description: "Business identity and registry",
      icon: Building2,
      path: "/settings/general",
      roles: ['admin'] // Org settings only for admin
    },
    {
      id: "account",
      title: "My Account",
      description: "Personal profile and identification",
      icon: User,
      path: "/settings/account",
      roles: ['admin', 'lab', 'customer_service', 'doctor', 'accounts']
    },
    {
      id: "security",
      title: "Security",
      description: "Access and permissions",
      icon: Shield,
      path: "/settings/security",
      roles: ['admin', 'lab', 'customer_service', 'doctor', 'accounts']
    },
    {
      id: "communications",
      title: "Communications",
      description: "Messaging and templates",
      icon: MessageSquare,
      path: "/settings/communications",
      roles: ['admin', 'customer_service']
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Alert preferences",
      icon: Bell,
      path: "/settings/notifications",
      roles: ['admin', 'lab', 'customer_service', 'doctor', 'accounts']
    },
    {
      id: "members",
      title: "Team",
      description: "Manage clinical staff",
      icon: Users,
      path: "/settings/members",
      roles: ['admin']
    },
    {
      id: "payments",
      title: "Payments",
      description: "Gateway configuration",
      icon: CreditCard,
      path: "/settings/payments",
      roles: ['admin', 'accounts']
    },
    {
      id: "data",
      title: "Data Handling",
      description: "Governance and portability",
      icon: Database,
      path: "/settings/data",
      roles: ['admin']
    },
  ];

  // Filter tabs based on user role
  const settingsTabs = allSettingsTabs.filter(tab =>
    tab.roles.includes(user?.role || 'customer_service')
  );

  const currentTab = settingsTabs.find(tab => location.pathname === tab.path) || settingsTabs[0];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 space-y-8">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest antialiased">
              Manage your account settings and team preferences
            </p>
          </div>

          {/* Horizontal Tabs */}
          <Tabs value={currentTab.id} className="w-full">
            <TabsList className="w-full justify-start border-b-0 bg-transparent rounded-none p-0 h-auto gap-2">
              {settingsTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  variant="line"
                  className={cn(
                    "relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold antialiased text-muted-foreground shadow-none transition-all hover:text-foreground",
                    "data-[state=active]:border-[hsl(var(--primary))] data-[state=active]:text-foreground data-[state=active]:shadow-none"
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
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto p-6 lg:px-10 lg:py-8">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}