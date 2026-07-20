"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";
import styles from "./header.module.scss";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const role = session?.user?.role;
  const accountHref = role === "ROLE_ADMIN" || role === "ADMIN" ? "/dashboard" : "/account";

  if (status === "loading") {
    return <span className={styles.loadingPill}>Oturum</span>;
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.authLinks}>
        <Link href="/login" className={styles.loginLink}>
          Giris
        </Link>
        <Link href="/register" className={styles.registerLink}>
          Kayit ol
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.profileActions}>
      <Link href={accountHref} className={styles.profileLink}>
        <UserRound size={16} />
        <span>Hesabim</span>
      </Link>
      <button
        type="button"
        className={styles.logoutButton}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut size={16} />
        <span>Cikis</span>
      </button>
    </div>
  );
}
