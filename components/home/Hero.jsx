import Link from "next/link";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import styles from "./hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className="ct-eyebrow">CineTime MVP Frontend</span>
        <h1>Filmden koltuga, koltuktan bilete tek akista sinema deneyimi.</h1>
        <p>
          Home shell, navigation ve UI sistemi ilk sprintte takimin ortak zemini olsun diye tasarlandi.
          Her ekip uyesi kendi domain sayfasini bu kabuk uzerine baglayacak.
        </p>

        <div className={styles.actions}>
          <Link href="/movies" className="ct-button ct-button-primary">
            Filmleri kesfet
            <ArrowRight size={18} />
          </Link>
          <Link href="/showtimes" className="ct-button ct-button-ghost">
            Seanslara bak
          </Link>
        </div>

        <div className={styles.trustRow}>
          <span>
            <ShieldCheck size={16} /> Backend MVP hazir
          </span>
          <span>Auth, booking, payment ve ticket akisi test edildi</span>
        </div>
      </div>

      <div className={styles.posterStage} aria-label="Featured movie preview">
        <Link href="/movies/1" className={styles.posterCard} aria-label="Dune Part Two film detayina git">
          <div className={styles.posterTopline}>Tonight / 20:30</div>
          <h2>Dune Part Two</h2>
          <p>IMAX salonunda koltugunu sec, mock payment ile biletini al.</p>
          <span className={styles.playButton} aria-hidden="true">
            <Play size={18} fill="currentColor" />
          </span>
        </Link>
        <div className={styles.seatMiniMap} aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index} className={index === 8 || index === 9 ? styles.booked : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
