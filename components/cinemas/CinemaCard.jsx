import Link from "next/link";
import styles from "./cinema-card.module.scss";

export default function CinemaCard({ cinema }) {
  const { id, name, city, district, address, phone } = cinema;

  return (
    <Link href={`/cinemas/${id}`} className={`cinetime-panel ${styles.card}`}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.location}>{district ? `${city} / ${district}` : city}</p>
      <p className={styles.address}>{address}</p>
      {phone && <p className={styles.phone}>{phone}</p>}
    </Link>
  );
}
