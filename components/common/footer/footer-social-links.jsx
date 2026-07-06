import styles from "./footer.module.scss";

/**
 * Basit metin linki olarak sosyal medya — ikon seti eklenince
 * `link.icon`'a göre gerçek SVG/ikon component'i render edilebilir.
 */
export default function FooterSocialLinks({ links }) {
  return (
    <div className={styles.socialLinks}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}