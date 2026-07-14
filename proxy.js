import { auth } from "@/auth";
import { getIsTokenValid, getIsUserAuthorized } from "./helpers/auth-helpers";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth(async (request) => {
  const { pathname, origin } = request.nextUrl;
  const session = await auth();
  const role = session?.user?.role;
  const isLoggedIn = getIsTokenValid(session?.accessToken);

  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  if (!isLoggedIn && (pathname.startsWith("/dashboard") || pathname.startsWith("/tickets") || pathname.startsWith("/bookings") || pathname.startsWith("/account") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (isLoggedIn && !getIsUserAuthorized(role, pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", origin));
  }

  return NextResponse.next();
});
