"use client";

import Link from "next/link";
import { Button } from "react-bootstrap";
import { signOut } from "next-auth/react";
import { HEADER_MESSAGES } from "@/helpers/messages/header-messages";
import styles from "./header.module.scss";

export default function UserMenu({ session }) {
  if (session) {
    return (
      <div className={styles.actions}>
        <Button
          as={Link}
          href="/dashboard"
          size="sm"
          className={styles.primaryButton}
        >
          {HEADER_MESSAGES.auth.dashboard}
        </Button>
        <Button
          size="sm"
          className={styles.secondaryButton}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {HEADER_MESSAGES.auth.logout}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <Button
        as={Link}
        href="/login"
        size="sm"
        className={styles.secondaryButton}
      >
        {HEADER_MESSAGES.auth.login}
      </Button>
      <Button
        as={Link}
        href="/register"
        size="sm"
        className={styles.primaryButton}
      >
        {HEADER_MESSAGES.auth.register}
      </Button>
    </div>
  );
}