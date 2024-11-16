import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Ambil token atau data pengguna dari cookies atau header
  const token = req.cookies.get('token'); // Misalnya token disimpan dalam cookies

  if (!token) {
    // Jika tidak ada token, redirect ke halaman login
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Misalnya, ambil role dari token atau data yang ada
  const roleCookie = req.cookies.get('role'); // This will be of type RequestCookie | undefined
  
  // Check if the cookie exists and extract the role as a string
  const role = roleCookie ? roleCookie.value : undefined;

  // Cek role pengguna dan tentukan akses
  if (role == '1') {
    return NextResponse.next(); // Izinkan akses ke halaman
  } else {
    // Jika role bukan admin, redirect ke halaman tertentu
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/akun', '/alamat', '/checkout', '/histori-transaksi', '/keranjang'], // Tentukan halaman yang akan dicek aksesnya (misal: /admin)
};
