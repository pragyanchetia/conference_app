"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast({ description: "Please enter your email and password." });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        toast({ description: "Email or password is incorrect." });
        return;
      }
      toast({ description: "Login successful." });
      const callbackUrl = searchParams.get("callbackUrl");
      const destination = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/user";
      router.replace(destination);
      router.refresh();
    } catch {
      toast({ description: "Could not log in. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <Input type="email" placeholder="Email" name="email" autoComplete="email" required disabled={isLoading} />
      <Input type="password" placeholder="Password" name="password" autoComplete="current-password" required disabled={isLoading} />
      <Button type="submit" disabled={isLoading} className="bg-sky-400 hover:bg-sky-600">
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
