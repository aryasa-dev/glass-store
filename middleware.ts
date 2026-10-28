import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "default_fallback_secret_key_at_least_32_chars_long!"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValidAdmin = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role === "ADMIN") {
        isValidAdmin = true;
      }
    } catch {
      isValidAdmin = false;
    }
  }

  // If visiting login page
  if (pathname === "/admin/login") {
    if (isValidAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Protecting any /admin route
  if (pathname.startsWith("/admin")) {
    if (!isValidAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
