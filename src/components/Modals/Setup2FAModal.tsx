// components/Modals/Setup2FAModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Mail, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface Setup2FAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete: (method: "authenticator" | "email") => void;
}

export function Setup2FAModal({ open, onOpenChange, onSetupComplete }: Setup2FAModalProps) {
  const [currentStep, setCurrentStep] = useState<"method" | "setup" | "complete">("method");
  const [selectedMethod, setSelectedMethod] = useState<"authenticator" | "email" | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const handleMethodSelect = (method: "authenticator" | "email") => {
    setSelectedMethod(method);
    setCurrentStep("setup");
  };

  const handleCompleteSetup = () => {
    if (selectedMethod) {
      setCurrentStep("complete");
      setTimeout(() => {
        onSetupComplete(selectedMethod);
        onOpenChange(false);
        // Reset modal state
        setCurrentStep("method");
        setSelectedMethod(null);
        setVerificationCode("");
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "method" && "Choose 2FA Method"}
            {currentStep === "setup" && `Set up ${selectedMethod === "authenticator" ? "Authenticator App" : "Email OTP"}`}
            {currentStep === "complete" && "Setup Complete"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentStep === "method" && (
            <div className="space-y-3">
              <Card 
                className="cursor-pointer border border-input hover:border-[#fe5e41] transition-colors"
                onClick={() => handleMethodSelect("authenticator")}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-6 w-6 text-[#fe5e41] mt-0.5" />
                    <div>
                      <h4 className="font-medium">Authenticator App</h4>
                      <p className="text-sm text-muted-foreground">
                        Use an app like Google Authenticator or Authy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer border border-input hover:border-cyan-600 transition-colors"
                onClick={() => handleMethodSelect("email")}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 text-cyan-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email OTP</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive one-time codes via email
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === "setup" && selectedMethod === "authenticator" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan the QR code with your authenticator app or enter the secret key manually.
              </p>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="bg-white p-4 inline-block rounded">
                  {/* QR Code placeholder */}
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">QR Code</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Secret Key</Label>
                <div className="flex gap-2">
                  <Input value="JBSWY3DPEHPK3PXP" readOnly className="font-mono" />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Verification Code</Label>
                <Input 
                  placeholder="Enter 6-digit code" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleCompleteSetup}>
                Verify and Activate
              </Button>
            </div>
          )}

          {currentStep === "setup" && selectedMethod === "email" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We'll send a verification code to your email address.
              </p>

              <Button className="w-full" onClick={handleCompleteSetup}>
                Send Verification Code
              </Button>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="font-medium">2FA Setup Complete!</p>
              <p className="text-sm text-muted-foreground">
                Your {selectedMethod === "authenticator" ? "authenticator app" : "email OTP"} 
                is now active and will be required for future logins.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}