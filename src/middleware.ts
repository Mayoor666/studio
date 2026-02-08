import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

const studentRoutes = ['/student/dashboard'];
const adminRoutes = ['/admin/dashboard'];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isStudentRoute = studentRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (!session && (isStudentRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (session) {
    if (session.role === 'student') {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
      }
      if(pathname === '/login' || pathname === '/admin/login') {
         return NextResponse.redirect(new URL('/student/dashboard', request.url));
      }
    }

    if (session.role === 'admin') {
      if (isStudentRoute) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
       if(pathname === '/login' || pathname === '/admin/login') {
         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*', '/login'],
};
