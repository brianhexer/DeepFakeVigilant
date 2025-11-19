import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, LogIn } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function SignInPage() {
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const canSignIn = termsAccepted && privacyAccepted;

  const handleSignIn = async () => {
    if (!canSignIn) return;
    try {
      await base44.auth.redirectToLogin(window.location.origin + createPageUrl("Home"));
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to DeepFakeVigilant</CardTitle>
          <CardDescription>
            Access enhanced features by signing in securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <Button
              onClick={handleSignIn}
              disabled={!canSignIn}
              className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              Sign In
            </Button>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={setTermsAccepted}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-normal">
                  I have read and agree to the{' '}
                  <Link to={createPageUrl("Terms")} target="_blank" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>.
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={setPrivacyAccepted}
                />
                <Label htmlFor="privacy" className="text-sm text-gray-600 leading-normal">
                  I have read and agree to the{' '}
                  <Link to={createPageUrl("Privacy")} target="_blank" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>.
                </Label>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 NetzSpaz / DeepFakeVigilant
          </p>
        </CardContent>
      </Card>
    </div>
  );
}