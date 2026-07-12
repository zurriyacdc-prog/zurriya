import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PORTAL_PREFIXES = ['/parent', '/therapist', '/admin'];
const ROLE_HOME: Record<string, string> = {
  parent:    'parent',
  therapist: 'therapist',
  admin:     'admin',
};

export async function middleware(request: NextRequest) {
  // Run i18n middleware first to get locale prefix
  const intlResponse = intlMiddleware(request);

  // Build Supabase client that can read/write cookies on this request
  let supabaseResponse = intlResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — do NOT remove this call
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Strip locale prefix to get the bare path (e.g. /en/parent → /parent)
  const bare = pathname.replace(/^\/(en|ar)/, '') || '/';

  const isPortal = PORTAL_PREFIXES.some((p) => bare.startsWith(p));
  const isLogin  = bare.startsWith('/login');

  // Redirect unauthenticated users away from portals
  if (isPortal && !user) {
    const locale = pathname.split('/')[1] || 'en';
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page to their portal
  if (isLogin && user) {
    const locale = pathname.split('/')[1] || 'en';
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role  = profile?.role ?? 'parent';
    const dest  = ROLE_HOME[role] ?? 'parent';
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = `/${locale}/${dest}`;
    homeUrl.search = '';
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
