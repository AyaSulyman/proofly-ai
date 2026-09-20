import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "proofly_access";
const PROTECTED_PREFIXES = ["/investigations", "/reports", "/disputes", "/notifications", "/settings"];
const AUTH_PAGES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/investigations", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investigations/:path*", "/reports/:path*", "/disputes/:path*", "/notifications/:path*", "/settings/:path*", "/login", "/register"],
};
