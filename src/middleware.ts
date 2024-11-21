import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Ambil token dan role dari cookies
  const token = req.cookies.get('token');
  const roleCookie = req.cookies.get('role');
  const role = roleCookie ? roleCookie.value : undefined;

  // Ambil path yang diminta
  const urlPath = req.nextUrl.pathname;

  // Jika path adalah /dashboard, izinkan akses tanpa validasi
  if (urlPath === '/dashboard') {
    return NextResponse.next();
  }

  // Jika tidak ada token, redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Logika akses berdasarkan role dan path
  if (urlPath.startsWith('/admin')) {
    // Hanya role 1 yang dapat mengakses /admin
    if (role !== '1') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else if (
    urlPath.startsWith('/akun') ||
    urlPath.startsWith('/alamat') ||
    urlPath.startsWith('/checkout') ||
    urlPath.startsWith('/histori-transaksi') ||
    urlPath.startsWith('/keranjang')
  ) {
    // Hanya role 1 & 2 yang dapat mengakses rute ini
    if (role !== '1' && role !== '2') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Jika tidak ada aturan yang dilanggar, izinkan akses
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/akun',
    '/alamat',
    '/checkout',
    '/histori-transaksi',
    '/keranjang',
    '/dashboard',
  ], // Tentukan halaman yang akan dicek aksesnya
};
