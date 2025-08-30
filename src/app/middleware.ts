import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const pbAuth = request.cookies.get('pb_auth')
    const isAuthenticated = !!pbAuth?.value
    const protectedRoutes = ['/cars', '/loads']
    const authRoutes = ['/auth/login', '/auth/register']
    const { pathname } = request.nextUrl

    if (pathname === '/') {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/cars', request.url))
        } else {
            return NextResponse.redirect(new URL('/auth/register', request.url))
        }
    }

    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/register', request.url))
    }

    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/cars', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/cars/:path*',
        '/loads/:path*',
        '/auth/:path*'
    ]
}
