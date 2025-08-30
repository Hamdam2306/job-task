import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = req.cookies.get("auth")?.value === "true";

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/cars", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth/register", req.url));
    }
  }

  if (!isAuthenticated && pathname.startsWith("/cars")) {
    return NextResponse.redirect(new URL("/auth/register", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/cars/:path*"],
};