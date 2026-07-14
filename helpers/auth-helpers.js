import { auth } from "@/auth";

export async function getCurrentSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session) {
    throw new Error(
      "Oturum bulunamadı. Bu fonksiyon sadece login sonrası çağrılmalı."
    );
  }
  return session;
}

export async function getAccessToken() {
  const session = await auth();
  return session?.accessToken ?? null;
}

/**
 * JWT'nin süresi dolmuş mu kontrol eder (imza doğrulamadan, sadece `exp` claim'i).
 * Not: middleware (proxy.js) Edge runtime'da çalışır, Node'un `Buffer`'ı
 * her zaman garanti değildir — bu yüzden atob tabanlı, Edge-uyumlu decode kullanıyoruz.
 */
export function getIsTokenValid(token) {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (!decoded.exp) return true; // exp yoksa süresiz kabul ediyoruz
    return Date.now() < decoded.exp * 1000;
  } catch {
    return false;
  }
}

/**
 * Role bazlı route yetkilendirmesi.
 * Şu an sadece /admin/* prefix'ini ADMIN role'üyle sınırlıyor — ihtiyaç
 * arttıkça buraya yeni kural eklenir.
 */
export function getIsUserAuthorized(role, pathname) {
  if (pathname.startsWith("/admin")) {
    return role === "ROLE_ADMIN";
  }
  return true;
}