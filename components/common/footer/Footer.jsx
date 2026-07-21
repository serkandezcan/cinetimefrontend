import Link from "next/link";
import { Clapperboard, Globe2, Video } from "lucide-react";
import { FOOTER_LINK_GROUPS, FOOTER_SOCIAL_LINKS } from "@/helpers/footer-links";
import { FOOTER_MESSAGES } from "@/helpers/messages/footer-messages";
import styles from "./footer.module.scss";

const SOCIAL_ICONS = {
  instagram: Globe2,
  youtube: Video,
  twitter: Clapperboard,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>CT</span>
            <span>CineTime</span>
          </Link>
          <p>{FOOTER_MESSAGES.brandDescription}</p>
          <div className={styles.socials} aria-label="Social links">
            {FOOTER_SOCIAL_LINKS.map((item) => {
              const Icon = SOCIAL_ICONS[item.icon] || Clapperboard;

              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className={styles.linkGrid}>
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className={styles.linkGroup}>
              <h2>{group.title}</h2>
              {group.links.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>{FOOTER_MESSAGES.copyright(year)}</span>
        <span>Frontend shell by Alperen - feature/home-shell</span>
      </div>
    </footer>
  );
}

