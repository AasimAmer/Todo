import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/signin', '/signup'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const jwt = request.cookies.get('jwt')?.value;
  const isLoggedIn = Boolean(jwt);

  if (!isLoggedIn && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/signin', '/signup'],
};
