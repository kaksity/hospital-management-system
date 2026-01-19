// settings/security.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, EllipsisVertical, Eye, EyeOff, Key, LogOut, Mail, Monitor, Plus, Shield, Smartphone, Star, Trash2, X } from "lucide-react";
import { Setup2FAModal } from "@/components/Modals/Setup2FAModal";
import { formatDate } from "@/utils/dateFormatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function SecuritySettings() {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAMethods, setTwoFAMethods] = useState<Array<{
    id: string;
    method: "authenticator" | "email";
    name: string;
    dateAdded: string;
    isDefault: boolean;
  }>>([]);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, NY",
      ip: "192.168.1.100",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      current: true
    },
    {
      id: "2", 
      device: "Safari on Mac",
      location: "New York, NY",
      ip: "192.168.1.101",
      lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      current: false
    },
    {
      id: "3",
      device: "Firefox on Linux",
      location: "Chicago, IL", 
      ip: "192.168.1.102",
      lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      current: false
    }
  ]);

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false
  });

  const twoFAOptions = [
    {
      id: "authenticator",
      title: "Authenticator App",
      description: "Use an app like Google Authenticator or Authy",
      icon: Smartphone,
    },
    {
      id: "email",
      title: "Email OTP",
      description: "Receive one-time codes via email",
      icon: Mail,
    }
  ];

  const isAdmin = user?.role === 'admin';

  const handleSetup2FA = (method: "authenticator" | "email") => {
    setShow2FAModal(true);
    console.log('Setting up 2FA method:', method);
  };

  const handleSetDefault = (methodId: string) => {
    setTwoFAMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleRemoveMethod = (methodId: string) => {
    setTwoFAMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const handleTerminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const handleTerminateAllOtherSessions = () => {
    setActiveSessions(prev => prev.filter(session => session.current));
  };

  const validatePassword = (password: string) => {
    setPasswordValidations({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[@#!$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    });
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };
  
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {/* Left Column - Header */}
      <div className="space-y-1 lg:col-span-1">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and authentication settings
        </p>
      </div>

      {/* Right Column - Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base tracking-normal">
              <Key className="h-4 w-4" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input 
                  id="currentPassword" 
                  type={showCurrentPassword ? "text" : "password"} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    type={showNewPassword ? "text" : "password"}
                    onChange={(e) => validatePassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm">
                {passwordValidations.minLength ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-muted-foreground">Must be at least 8 characters</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {passwordValidations.hasUppercase && passwordValidations.hasNumber && passwordValidations.hasSymbol ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-muted-foreground">Must have at least 1 uppercase, 1 number, and 1 symbol (@,#,!, etc.)</span>
              </div>
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base tracking-normal">
              <Shield className="h-4 w-4" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Increase your account's security by using multiple authentication methods to verify your identity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 2FA Setup Button */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Two-factor authentication</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {twoFAMethods.length > 0 
                    ? `${twoFAMethods.length} method${twoFAMethods.length > 1 ? 's' : ''} configured`
                    : "No 2FA methods set up yet"
                  }
                </p>
              </div>
              <Button 
                onClick={() => setShow2FAModal(true)}
                className="flex items-center gap-2"
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add 2FA Method
              </Button>
            </div>

            {/* Active 2FA Methods Table */}
            {twoFAMethods.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm">Active 2FA Methods</Label>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-sm p-3 font-medium">Method</th>
                      <th className="text-left text-sm p-3 font-medium">Date added</th>
                      <th className="text-right text-sm p-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {twoFAMethods.map((method) => (
                      <tr key={method.id} className="border-b last:border-0">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              {method.method === "authenticator" ? (
                                <Smartphone className="h-4 w-4 text-primary" />
                              ) : (
                                <Mail className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="flex gap-2">
                              <div className="font-medium text-[15px]">{method.name}</div>
                              {method.isDefault && (
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {formatDate(method.dateAdded)}
                        </td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                data-dropdown-ignore
                                onClick={(e) => e.stopPropagation()}
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!method.isDefault ? (
                                <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4" />
                                    Set as Default
                                  </div>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem disabled>
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4" />
                                    Default Method
                                  </div>
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => handleRemoveMethod(method.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <div className="flex items-center gap-2">
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {twoFAMethods.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-base">No 2FA methods set up yet</p>
                <p className="text-sm">Click "Add 2FA Method" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Management - Admin Only */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base tracking-normal">
                <Monitor className="h-4 w-4" />
                Session Management
              </CardTitle>
              <CardDescription>
                Manage your active sessions and devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground">
                    {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {activeSessions.filter(s => !s.current).length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTerminateAllOtherSessions}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out All Other Devices
                  </Button>
                )}
              </div>

              <div className="border rounded-lg">
                {activeSessions.map((session, index) => (
                  <div 
                    key={session.id} 
                    className={`flex items-center justify-between p-4 ${
                      index !== activeSessions.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{session.device}</span>
                          {session.current && (
                            <Badge variant="success" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.location} • {session.ip}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last active: {formatLastActive(session.lastActive)}
                        </div>
                      </div>
                    </div>
                    
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {activeSessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-base">No active sessions</p>
                  <p className="text-sm">Your active sessions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 2FA Setup Modal */}
      <Setup2FAModal
        open={show2FAModal}
        onOpenChange={setShow2FAModal}
        onSetupComplete={(method) => {
          const newMethod = {
            id: `${method}-${Date.now()}`,
            method,
            name: method === "authenticator" ? "Authenticator App" : "Email OTP",
            dateAdded: new Date().toLocaleDateString(),
            isDefault: twoFAMethods.length === 0 // First method becomes default
          };
          setTwoFAMethods(prev => [...prev, newMethod]);
        }}
      />
    </div>
  );
}