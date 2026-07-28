import { auth } from "@/auth";
import {
  getDefaultAuthenticatedPath,
  getIsTokenValid,
  getIsUserAuthorized,
} from "./helpers/auth-helpers";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const PROTECTED_PREFIXES = ["/dashboard", "/tickets", "/bookings", "/account", "/admin"];

function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function buildLoginRedirect(request) {
  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return loginUrl;
}

export default auth(async (request) => {
  const { pathname, origin } = request.nextUrl;
  const session = await auth();
  const role = session?.user?.role;
  const isLoggedIn = getIsTokenValid(session?.accessToken);

  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL(getDefaultAuthenticatedPath(role), origin));
  }

  if (!isLoggedIn && isProtectedPath(pathname)) {
    return NextResponse.redirect(buildLoginRedirect(request));
  }

  if (isLoggedIn && !getIsUserAuthorized(role, pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", origin));
  }

  return NextResponse.next();
});
