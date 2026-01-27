// settings/account.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Trash2, AlertTriangle, User, Mail, Phone } from "lucide-react";
import { UploadAvatarModal } from "@/components/Modals/UploadAvatarModal";
import { getAvatarInitials } from "@/utils/avatarUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AccountSettings() {
  const { user, updateUserAvatar, removeUserAvatar } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const hasAvatar = !!avatarUrl;
  const canDeleteAccount = deleteEmail === user?.email;

  const handleAvatarUpload = (file: File) => {
    const newAvatarUrl = URL.createObjectURL(file);
    setAvatarUrl(newAvatarUrl);
    localStorage.setItem("userAvatar", newAvatarUrl);
    updateUserAvatar(newAvatarUrl);
    toast.success("Profile photo uploaded successfully");
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl("");
    localStorage.removeItem("userAvatar");
    if (avatarUrl.startsWith("blob:")) {
      URL.revokeObjectURL(avatarUrl);
    }
    removeUserAvatar();
    toast.success("Profile photo removed");
  };

  const handleDeleteAccount = () => {
    if (!canDeleteAccount) return;
    toast.error("Account deletion requested. This action requires administrative approval.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Account Details Form */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Personal Profile</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Keep your contact information updated to receive important notifications.
          </p>
        </div>

        <Card className="lg:col-span-2 border shadow-none bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-8 pt-6 space-y-4 border-b">
            <div className="flex flex-col md:flex-row items-center gap-4 pb-3">
              <div className="relative group">
                <Avatar className="h-16 w-16 border-4 border-slate-50 shadow-sm transition-transform group-hover:scale-105 duration-300">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className={cn("text-xl font-semibold bg-[#006bff] text-white")}>
                    {user ? getAvatarInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-2 border-white shadow-sm"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button size="sm" variant="outline" className="h-9 px-4" onClick={() => setShowUploadModal(true)}>
                    Change Avatar
                  </Button>
                  {hasAvatar && (
                    <Button size="sm" variant="ghost" className="h-9 px-4 gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDeleteAvatar}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="firstName" className="pl-9" defaultValue={user?.name?.split(' ')[0]} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="lastName" className="pl-9" defaultValue={user?.name?.split(' ')[1]} />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="email">Professional Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="email" type="email" className="pl-9" defaultValue={user?.email} disabled />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">* Email changes require administrative oversight</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="phone" type="tel" className="pl-9" placeholder="+234 800 000 0000" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 px-8 flex">
            <Button>
              Save Account Changes
            </Button>
          </CardFooter>
        </Card>
      </div>

      <hr className="border-slate-100" />

      {/* Danger Zone */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-1">
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Irreversible actions regarding your clinical account access.
          </p>
        </div>

        <Card className="lg:col-span-2 border border-[#daacac] shadow-none bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-[#daacac] bg-red-50/30">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-sm font-bold uppercase tracking-tight">Account Deactivation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-4">
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Warning: Deleting your account will permanently remove all of your data and cannot be undone. This includes your profile, chats, comments, and any other information associated with your account. Are you sure you want to proceed with deleting your account?
            </p>

            <div className="space-y-3">
              <Label htmlFor="confirmEmail" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Confirm your identity by typing <span className="font-bold text-red-600 select-all">{user?.email}</span>
              </Label>
              <Input
                id="confirmEmail"
                type="email"
                placeholder={user?.email}
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                className="h-11 border-red-200 focus:ring-red-100 bg-white"
              />
            </div>

            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!canDeleteAccount}
              className="h-11 px-8 font-bold shadow-sm"
            >
              Request Deactivation
            </Button>
          </CardContent>
        </Card>
      </div>

      <UploadAvatarModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUpload={handleAvatarUpload}
        currentAvatar={avatarUrl}
      />
    </div>
  );
}
