"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";


 // jwt callback'te refresh token başarısız olursa (auth.js'de
 // `token.error = "RefreshAccessTokenError"`), session'a bu hata taşınır.
 // Burada onu izleyip kullanıcıyı otomatik login'e atıyoruz — aksi halde
 // kullanıcı geçersiz bir accessToken ile dolaşmaya devam eder.
 
export default function SessionErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return null;
}