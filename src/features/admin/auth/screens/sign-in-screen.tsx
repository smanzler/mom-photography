import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeForm } from "@/features/admin/auth/components/code-form";
import { EmailForm } from "@/features/admin/auth/components/email-form";

export function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>();

  const handleSignedIn = async () => {
    await router.invalidate();
    await router.navigate({ to: "/admin" });
  };

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>We will email you a sign in code.</CardDescription>
        </CardHeader>
        <CardContent>
          {email ? (
            <CodeForm
              email={email}
              onSignedIn={handleSignedIn}
              onBack={() => setEmail(undefined)}
            />
          ) : (
            <EmailForm onSent={setEmail} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
