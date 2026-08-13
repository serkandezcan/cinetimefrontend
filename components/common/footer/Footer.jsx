"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { FOOTER_LINK_GROUPS, FOOTER_SOCIAL_LINKS } from "@/helpers/footer-links";
import { FOOTER_MESSAGES } from "@/helpers/messages/footer-messages";
import styles from "./footer.module.scss";

function FacebookIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14 8.4V6.9c0-.8.5-1.3 1.4-1.3H17V2.8c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.2v1.6H7.7v3.2h2.7V21h3.4v-9.4h2.8l.5-3.2H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 3h4.4l4.1 5.8L17.5 3H22l-7.3 8.5L22.5 21h-4.4l-5.3-6.9L6.9 21H2.5l8.1-9.3L4 3Zm3.2 1.9 11.7 14.2h1.4L8.6 4.9H7.2Z" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M21.6 7.1c-.2-1.4-1.2-2.5-2.6-2.7C17.3 4.1 15 4 12 4s-5.3.1-7 .4c-1.4.2-2.4 1.3-2.6 2.7C2.1 8.4 2 10 2 12s.1 3.6.4 4.9c.2 1.4 1.2 2.5 2.6 2.7 1.7.3 4 .4 7 .4s5.3-.1 7-.4c1.4-.2 2.4-1.3 2.6-2.7.3-1.3.4-2.9.4-4.9s-.1-3.6-.4-4.9Z"
        fill="currentColor"
      />
      <path d="M10.1 8.4v7.2l6-3.6-6-3.6Z" fill="currentColor" className={styles.cutout} />
    </svg>
  );
}

function InstagramIcon({ size = 31 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="5.2" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="17" cy="7" r="1.35" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ size = 31 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14.8 2.7c.4 2.9 2 4.7 4.7 4.9v3.2c-1.7 0-3.2-.5-4.6-1.5v5.7c0 3.7-2.3 6.3-5.8 6.3-3 0-5.3-2.1-5.3-5.1 0-3.3 2.7-5.4 6.1-5.1v3.4c-1.4-.3-2.7.4-2.7 1.7 0 1.1.8 1.8 1.9 1.8 1.4 0 2.3-.9 2.3-2.8V2.7h3.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon({ size = 31 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.5a9.2 9.2 0 0 0-7.8 14.1L3 21.5l5-1.2A9.2 9.2 0 1 0 12 2.5Zm0 2a7.2 7.2 0 1 1-3.4 13.5l-.4-.2-2.3.6.6-2.2-.3-.4A7.2 7.2 0 0 1 12 4.5Zm-3.1 3.7c-.2 0-.5.1-.7.4-.4.4-.9 1.1-.9 2.1 0 1 .7 2 1 2.4.1.2 1.9 3 4.6 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.4l-1.8-.9c-.3-.1-.5-.1-.7.2l-.8 1c-.1.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6l.4-.4c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.5-.7-.5h-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  twitter: XIcon,
  whatsapp: WhatsAppIcon,
  youtube: YouTubeIcon,
};


function normalizeRole(role) {
  return String(role ?? "").replace(/^ROLE_/, "").toUpperCase();
}

function getVisibleFooterGroups(groups, sessionStatus, role) {
  const isAuthenticated = sessionStatus === "authenticated";
  const normalizedRole = normalizeRole(role);
  const isAdmin = normalizedRole === "ADMIN";

  return groups
    .map((group) => {
      if (group.title !== "Hesabim") return group;

      const links = group.links.filter((item) => {
        if (!isAuthenticated) return item.href === "/login" || item.href === "/register";
        if (item.href === "/login" || item.href === "/register") return false;
        if (item.href === "/dashboard") return isAdmin;
        return true;
      });

      return { ...group, links };
    })
    .filter((group) => group.links.length > 0);
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { data: session, status } = useSession();
  const footerGroups = getVisibleFooterGroups(FOOTER_LINK_GROUPS, status, session?.user?.role);

  return (
    <footer className={styles.footer}>
      <div className={styles.followBar}>
        <div className={styles.followInner}>
          <strong className={styles.followTitle}>Bizi Takip Et</strong>
          <div className={styles.socials} aria-label="Sosyal medya linkleri">
            {FOOTER_SOCIAL_LINKS.map((item) => {
              const Icon = SOCIAL_ICONS[item.icon] || InstagramIcon;

              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} title={item.label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>CT</span>
            <span>CineTime</span>
          </Link>
          <p>{FOOTER_MESSAGES.brandDescription}</p>
        </div>

        <div className={styles.linkGrid}>
          {footerGroups.map((group) => (
            <div key={group.title} className={styles.linkGroup}>
              <h2>{group.title}</h2>
              {group.links.map((item) => (
                <Link key={`${group.title}-${item.label}`} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>{FOOTER_MESSAGES.copyright(year)}</span>
      </div>
    </footer>
  );
}
