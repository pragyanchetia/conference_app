"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const SignUpForm = ({ showGoogle = false }: { showGoogle?: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signUpHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", { name, email, password });
      toast({ description: "Account created. Please log in." });
      router.push("/login");
    } catch (error: any) {
      toast({ description: error?.response?.data?.message || "Could not create your account." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 text-white">
      <Card className="w-full max-w-md border-white/10 bg-dark-2 shadow-xl">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your Confo account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signUpHandler} className="flex flex-col space-y-3">
            <Input type="text" placeholder="Your name" name="username" autoComplete="name" required maxLength={60} disabled={isLoading} />
            <Input type="email" placeholder="Email" name="email" autoComplete="email" required disabled={isLoading} />
            <Input type="password" placeholder="Password (at least 8 characters)" name="password" autoComplete="new-password" minLength={8} maxLength={72} required disabled={isLoading} />
            <Button type="submit" disabled={isLoading} className="bg-sky-400 text-slate-950 hover:bg-sky-500">
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {showGoogle && <span className="text-sm text-slate-400">Or</span>}
          {showGoogle && (
            <Button type="button" variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
              Continue with Google
            </Button>
          )}
          <Link href="/login" className="pt-2 text-sm text-slate-300 hover:text-white">Already have an account? Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpForm;
