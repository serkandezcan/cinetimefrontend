"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { HEADER_NAV_LINKS } from "@/helpers/header-links";
import UserMenu from "./UserMenu";
import styles from "./header.module.scss";

export default function MainMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandMark}>CT</span>
          <span className={styles.brandText}>
            Cine<span>Time</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Menuyu kapat" : "Menuyu ac"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
          {HEADER_NAV_LINKS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.userArea}>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
