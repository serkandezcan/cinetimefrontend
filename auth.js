import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { config as appConfig } from "@/helpers/config";
import { API_ROUTES } from "@/helpers/api-routes";

/**
 * JWT'nin payload'ını (imza doğrulamadan) decode eder — sadece `exp` claim'ini
 * okuyup proaktif refresh zamanlamak için kullanılır.
 */
function decodeJwtExp(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    );
    return decoded.exp ? decoded.exp * 1000 : null; // ms cinsinden
  } catch {
    return null;
  }
}

/**
 * Aynı refreshToken için eşzamanlı birden fazla yenileme isteği gitmesini
 * önler — server component'ler paralel render olurken hepsi aynı anda
 * "token süresi doldu" deyip refresh tetikleyebiliyor. Bu Map, aynı
 * refreshToken için sadece TEK bir ağ isteği gitmesini garanti eder,
 * diğer eşzamanlı çağrılar aynı promise'i bekler.
 */
const inFlightRefreshes = new Map();

async function refreshAccessToken(token) {
  const key = token.refreshToken;

  if (inFlightRefreshes.has(key)) {
    return inFlightRefreshes.get(key);
  }

  const promise = performRefresh(token).finally(() => {
    inFlightRefreshes.delete(key);
  });

  inFlightRefreshes.set(key, promise);
  return promise;
}

async function performRefresh(token) {
  try {
    const res = await fetch(
      `${appConfig.apiURL}${API_ROUTES.auth.refreshToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );

    if (!res.ok) {
      throw new Error("Refresh token isteği başarısız oldu");
    }

    // Backend: ResponseMessage<RefreshTokenResponseDTO>
    const body = await res.json();
    const data = body?.object;

    if (!data?.accessToken) {
      throw new Error("Refresh response'unda accessToken yok");
    }

    return {
      ...token,
      accessToken: data.accessToken,
      // Bazı backend'ler refresh'te yeni refreshToken dönmeyebilir,
      // dönmezse eskisini koru (rotation yoksa).
      refreshToken: data.refreshToken || token.refreshToken,
      accessTokenExpires: decodeJwtExp(data.accessToken),
      error: undefined,
    };
  } catch (err) {
    console.error("[auth] refreshAccessToken hata:", err.message);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: appConfig.authSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(
          `${appConfig.apiURL}${API_ROUTES.auth.login}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        if (!res.ok) {
          return null;
        }

        // Backend: ResponseMessage<LoginResponseDTO>
        const body = await res.json();
        const user = body?.object;

        if (!user?.accessToken) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // İlk login anı
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: decodeJwtExp(user.accessToken),
        };
      }

      // Token hâlâ geçerliyse dokunma
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // Süresi dolmuş veya dolmak üzere — yenile
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error; // client bunu görüp gerekirse logout yapabilir

      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
});