import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // cookie orqali foydalanuvchi auth bo'lganini tekshirish
    const isAuthenticated = req.cookies.get("auth")?.value === "true";

    // Root sahifaga kirganda:
    if (pathname === "/") {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/cars", req.url));
        } else {
            return NextResponse.redirect(new URL("/auth/register", req.url));
        }
    }

    // agar foydalanuvchi ro‘yxatdan o‘tmagan bo‘lsa va cars sahifasiga kirmoqchi bo‘lsa → register sahifasiga yuborish
    if (!isAuthenticated && pathname.startsWith("/cars")) {
        return NextResponse.redirect(new URL("/auth/register", req.url));
    }

    return NextResponse.next();
}

// middleware faqat kerakli pathlarda ishlasin
export const config = {
    matcher: ["/", "/cars/:path*"],
};
