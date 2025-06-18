'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn('azure-ad',{callbackUrl: '/dashboard'});
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">📬 Email Tracker</CardTitle>
          <CardDescription className="text-center text-gray-500 text-sm">
            Track your job applications and interview emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignIn} 
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner className="text-white" />}
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Footer */}
      <footer className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Nicholas Bryant • <a href="https://nicholasbryantdev.super.site" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Portfolio</a>
      </footer>
    </div>
  );
}
