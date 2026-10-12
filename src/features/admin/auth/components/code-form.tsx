import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/admin/auth/lib/auth-client";

export function CodeForm({
  email,
  onSignedIn,
  onBack,
}: {
  email: string;
  onSignedIn: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(undefined);

    const { error: signInError } = await authClient.signIn.emailOtp({
      email,
      otp,
    });

    setIsPending(false);
    if (signInError)
      return setError(signInError.message ?? "Could not sign in.");

    onSignedIn();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        If {email} can sign in, a 6-digit code is on its way.
      </p>
      <div className="flex flex-col gap-2">
        <Label htmlFor="otp">Code</Label>
        <Input
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
      <Button type="button" variant="ghost" onClick={onBack}>
        Use a different email
      </Button>
    </form>
  );
}
