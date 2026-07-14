"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

/**
 * GEÇİCİ component — header/footer eklenene kadar logout'u test edebilmek
 * için. Header ekibi kendi component'ini ekleyince bu dosya ve
 * layout.jsx'teki kullanımı silinecek.
 */
export default function TempLogoutButton() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 9999,
        background: "#e84d3d",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Çıkış Yap (geçici)
    </button>
  );
}