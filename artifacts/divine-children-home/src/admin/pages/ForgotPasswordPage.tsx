import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
      toast({ title: "Reset email sent", description: "Check your inbox for the reset link." });
    } catch (err) {
      toast({
        title: "Failed to send reset email",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            {sent ? "If an account exists, you will receive a reset link." : "Enter your admin email address."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          )}
          <p className="text-center text-sm mt-4">
            <Link href="/admin/login" className="text-primary hover:underline">Back to sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
