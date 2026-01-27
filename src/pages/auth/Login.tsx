import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, switchUser } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const quickFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center mx-auto">
            <img
              src="/images/logos/carepak-bpr-logo.png"
              alt="Carepak"
              className="h-11 w-auto"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Sign in to Carepak</CardTitle>
            <CardDescription>Welcome back! Please sign in to continue</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Fill Buttons - More compact */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Development: Quick fill
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickFill("ope.adeyomoye@agora.com")}
                className="text-xs h-8"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickFill("lab@agora.com")}
                className="text-xs h-8"
              >
                Radiology Lab
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickFill("cs@agora.com")}
                className="text-xs h-8"
              >
                Customer Service
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickFill("doctor@agora.com")}
                className="text-xs h-8"
              >
                Doctor
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickFill("accounts@agora.com")}
                className="text-xs h-8 col-span-2"
              >
                Accounts
              </Button>
            </div>
          </div>

          {/* Traditional Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="space-y-4 text-center">
            <div className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  );
}