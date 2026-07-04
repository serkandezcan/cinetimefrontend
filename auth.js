import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./services/auth-service";
import { getIsTokenValid } from "./helpers/auth-helpers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const res = await login(credentials);
        const data = await res.json();
        if (!res.ok) return null;

        const object = data.object || data;
        const accessToken = object.token || object.accessToken || data.token || data.accessToken;
        if (!accessToken) return null;

        return {
          user: {
            id: object.id,
            email: object.email || credentials.email,
            role: object.role,
            name: object.name,
            surname: object.surname,
          },
          accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, user: user.user, accessToken: user.accessToken };
      return token;
    },
    async session({ session, token }) {
      if (!getIsTokenValid(token?.accessToken)) return null;
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: { signIn: "/login" },
  trustHost: true,
});
