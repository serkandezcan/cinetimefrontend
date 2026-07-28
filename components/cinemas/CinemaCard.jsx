import Link from "next/link";
import { Heart, MapPin, Navigation } from "lucide-react";
import styles from "./cinema-card.module.scss";

export default function CinemaCard({ cinema, isFavorite = false, mapHref, onToggleFavorite }) {
  const { id, name, city, district, address, phone } = cinema;

  return (
    <article className={styles.card}>
      <Link href={`/cinemas/${id}`} className={styles.content} aria-label={`${name} sinema detayina git`}>
        <div className={styles.copy}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.location}>
            <MapPin size={16} /> {district ? `${city} / ${district}` : city}
          </p>
          <p className={styles.address}>{address}</p>
          {phone && <p className={styles.phone}>{phone}</p>}
        </div>
      </Link>

      <div className={styles.actions}>
        <button
          type="button"
          className={isFavorite ? `${styles.iconButton} ${styles.favoriteActive}` : styles.iconButton}
          onClick={() => onToggleFavorite?.(id)}
          aria-label={isFavorite ? `${name} favorilerden kaldir` : `${name} favorilere ekle`}
        >
          <Heart size={23} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <a href={mapHref} className={styles.iconButton} target="_blank" rel="noreferrer" aria-label={`${name} haritada goster`}>
          <Navigation size={23} />
        </a>
      </div>
    </article>
  );
}
