import Link from "next/link";
import { FOOTER_LINK_GROUPS, FOOTER_SOCIAL_LINKS } from "@/helpers/footer-links";
import { FOOTER_MESSAGES } from "@/helpers/messages/footer-messages";
import FooterLinkGroup from "./footer-link-group";
import FooterSocialLinks from "./footer-social-links";
import styles from "./footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            Cine<span className={styles.logoAccent}>Time</span>
          </span>
          <p className={styles.brandDescription}>
            {FOOTER_MESSAGES.brandDescription}
          </p>
          <FooterSocialLinks links={FOOTER_SOCIAL_LINKS} />
        </div>

        <div className={styles.linkGroups}>
          {FOOTER_LINK_GROUPS.map((group) => (
            <FooterLinkGroup key={group.title} group={group} />
          ))}
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copyright}>{FOOTER_MESSAGES.copyright(year)}</p>
        <div className={styles.legalLinks}>
          <Link href="/privacy">Gizlilik</Link>
          <Link href="/terms">Şartlar</Link>
        </div>
      </div>
    </footer>
  );
}