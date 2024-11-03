// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
    // Ambil token dari cookies
    const token = request.cookies.get('token')?.value;

    // Rute yang dilindungi
    const protectedRoutes = ['/dashboard', '/akun'];

    // Jika mencoba mengakses rute yang dilindungi tanpa token
    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Melanjutkan jika semua kondisi terpenuhi
}

export const config = {
    matcher: ['/dashboard', '/akun'], // Rute yang dilindungi
};
