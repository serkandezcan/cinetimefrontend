import Link from "next/link";
import styles from "./footer.module.scss";

export default function FooterLinkGroup({ group }) {
  return (
    <div className={styles.linkGroup}>
      <h3 className={styles.linkGroupTitle}>{group.title}</h3>
      <ul className={styles.linkList}>
        {group.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}