import { auth } from "@/auth";
import { config } from "@/helpers/config";

export async function getCurrentSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session) {
    throw new Error("Oturum bulunamadi. Bu fonksiyon sadece login sonrasi cagrilmali.");
  }
  return session;
}

export async function getAccessToken() {
  const session = await auth();
  return session?.accessToken ?? null;
}

export function normalizeRole(role) {
  if (!role) return null;
  return String(role).replace(/^ROLE_/, "").toUpperCase();
}

export function getDefaultAuthenticatedPath(role) {
  return normalizeRole(role) === config.roleNames.admin ? "/dashboard" : "/account";
}

export function getIsTokenValid(token) {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (!decoded.exp) return true;
    return Date.now() < decoded.exp * 1000;
  } catch {
    return false;
  }
}

export function getIsUserAuthorized(role, pathname) {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return false;
  }

  const matchingRule = config.userRightsOnRoutes.find((routeRule) =>
    routeRule.urlRegex.test(pathname)
  );

  if (matchingRule) {
    return matchingRule.roles.includes(normalizedRole);
  }

  if (pathname.startsWith("/admin")) {
    return normalizedRole === config.roleNames.admin;
  }

  return true;
}
