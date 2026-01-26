// settings/general.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Trash2, AlertTriangle } from "lucide-react";
import { UploadAvatarModal } from "@/components/Modals/UploadAvatarModal";
import { getAvatarInitials } from "@/utils/avatarUtils";
import { toast } from "sonner";

export function GeneralSettings() {
  const { user, updateUserAvatar, removeUserAvatar } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const isClient = user?.role === 'client';
  const isStaff = ['admin', 'attorney', 'paralegal'].includes(user?.role || '');

  const hasAvatar = !!avatarUrl;
  const canDeleteAccount = deleteEmail === user?.email;

  const handleAvatarUpload = (file: File) => {
    const newAvatarUrl = URL.createObjectURL(file);
    setAvatarUrl(newAvatarUrl);
    localStorage.setItem('userAvatar', newAvatarUrl);
    updateUserAvatar(newAvatarUrl); // Update context
    toast.success("Profile photo uploaded successfully");
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl("");
    localStorage.removeItem('userAvatar');

    // Revoke the blob URL to free memory
    if (avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl);
    }

    removeUserAvatar();
    toast.success("Profile photo removed");
  };

  const handleDeleteAccount = () => {
    if (!canDeleteAccount) return;

    // Add your account deletion logic here
    console.log('Deleting account...');
    alert('Account deletion would be processed here');
  };

  // Load avatar from localStorage on component mount
  useState(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }
  });

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {/* Left Column - Header */}
      <div className="space-y-1 lg:col-span-1">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information, profile picture, or delete your account
        </p>
      </div>

      {/* Right Column - Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base tracking-normal">Profile Picture</CardTitle>
            <CardDescription>
              Update your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-lg font-semibold">
                  {user ? getAvatarInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <Button onClick={() => setShowUploadModal(true)}>
                    <Upload className="h-4 w-4" />
                    {hasAvatar ? "Change Photo" : "Upload Photo"}
                  </Button>

                  {hasAvatar && (
                    <Button
                      variant="outline"
                      onClick={handleDeleteAvatar}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Photo
                    </Button>
                  )}
                </div>

                <p className="text-[13px] text-muted-foreground max-w-[250px]">
                  JPG or PNG format only (recommended size 400px by 400px). Max size 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base tracking-normal">Basic Information</CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user?.name?.split(' ')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user?.name?.split(' ')[1]} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-base tracking-normal">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                Warning: This will permanently delete your account. Upon deletion all your cases, documents and client information will be permanently deleted
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmEmail" className="text-sm font-medium">
                Type your email to confirm deletion. Enter <span className="font-semibold antialiased text-destructive">{user?.email}</span> to confirm account deletion
              </Label>
              <Input
                id="confirmEmail"
                type="email"
                placeholder={user?.email}
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                className="max-w-md"
              />
            </div>

            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!canDeleteAccount}
              className="mt-4"
            >
              Delete Account Permanently
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upload Avatar Modal */}
      <UploadAvatarModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUpload={handleAvatarUpload}
        currentAvatar={avatarUrl}
      />
    </div>
  );
}