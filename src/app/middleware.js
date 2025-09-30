import { NextResponse } from 'next/server';

// This is your root domain, and any subdomains you want to ignore.
const ROOT_DOMAIN = 'collabriss.site';
const IGNORED_SUBDOMAINS = ['www', 'app', 'api'];

export const config = {
  // The matcher ensures this middleware only runs on requests to your domain
  // and avoids running on internal Next.js assets like _next.
  matcher: [
    '/((?!api/|_next/|_static/|_vercel|favicon.ico|logo.png|robots.txt|sitemap.xml).*)',
  ],
};

export function middleware(req) {
  const url = req.nextUrl;
  const host = req.headers.get('host');

  // For local development, you can use localhost.
  const currentHost = process.env.NODE_ENV === 'production' ? host.replace(`.${ROOT_DOMAIN}`, '') : host.replace('.localhost:3000', '');

  // If the subdomain is the root domain or an ignored one, do nothing.
  if (currentHost === ROOT_DOMAIN || IGNORED_SUBDOMAINS.includes(currentHost)) {
    return NextResponse.next();
  }

  // Rewrite the URL to the /store/[subdomain] page
  const newPath = `/store/${currentHost}${url.pathname}`;
  const newUrl = new URL(newPath, req.url);

  console.log(`Rewriting ${host}${url.pathname} to ${newUrl.toString()}`);

  return NextResponse.rewrite(newUrl);
}