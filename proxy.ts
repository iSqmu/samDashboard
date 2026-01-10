// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies(); // Resuelve la Promise de cookies

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresca y obtiene la sesión (mantiene el login activo)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/tasks', '/profile'];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (session && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/profile/:path*', '/auth'],
};
