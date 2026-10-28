import { signIn } from "@/auth"
import LoginForm from "@/components/forms/login-form"
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card" 
  
import Link from "next/link";
import { Suspense } from "react";

const Page = () => {
 
  return (
    <div className="flex-center h-dvh text-white">
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter Your Credentials</CardDescription>
            </CardHeader>
            <CardContent className="text-dark-3">
                <Suspense
                    fallback={
                        <div className="flex min-h-24 items-center justify-center text-sm text-slate-400">
                            Loading login form...
                        </div>
                    }
                >
                    <LoginForm />
                </Suspense>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
                {process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && <span>Or</span>}
                {process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && (
                    <form action={async () => {
                        "use server";
                        await signIn("google", { callbackUrl: "/home" });
                    }}>
                        <Button type="submit" className="text-dark-3 bg-sky-400 hover:bg-sky-600">Login with Google</Button>
                    </form>
                )}

                <Link href={"/signup"} className="pt-4 hover:text-gray-300">
                    Don&apos;t have an account? Sign up
                </Link>
            </CardFooter>
        </Card> 
    </div>
  )
}

export default Page;

  