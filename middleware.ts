
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth?.user);
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isHomePage = pathname === "/" || pathname === "/home";

  const userId = (
    request.auth?.user as { id?: string } | undefined
  )?.id;

  // Authenticated users should land on their own home page.
  if (isLoggedIn && (isAuthPage || isHomePage)) {
    if (userId) {
      return NextResponse.redirect(
        new URL(`/user/${userId}`, request.url)
      );
    }
  }

  // Keep the public landing page accessible to logged-out users.
  if (!isLoggedIn && !isAuthPage && pathname !== "/") {
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
    "/meeting/:path*",
  ],
};
