
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth?.user);
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  const isPublicPage = pathname === "/";

  const userId = (
    request.auth?.user as { id?: string } | undefined
  )?.id;

  const userHome = userId ? `/user/${userId}` : null;
  const isUserRoute =
    pathname === "/user" || pathname.startsWith("/user/");

  // Logged-in users should land on their own dashboard.
  if (isLoggedIn && userHome && (isAuthPage || pathname === "/" || pathname === "/home")) {
    return NextResponse.redirect(new URL(userHome, request.url));
  }

  // Prevent users from opening another user's dashboard URL.
  if (isLoggedIn && userHome && isUserRoute && pathname !== userHome) {
    return NextResponse.redirect(new URL(userHome, request.url));
  }

  // A session without a usable database user ID cannot access protected pages.
  if (isLoggedIn && !userId && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // The landing, login, and signup pages remain public.
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/home",
    "/login",
    "/signup",
    "/user/:path*",
    "/room/:path*",
  ],
};
