import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import Hero from "@/components/home/Hero";
import MovieStrip from "@/components/home/MovieStrip";
import styles from "./page.module.scss";

const quickActions = [
  {
    title: "Film sec",
    description: "Vizyondaki filmleri incele ve sana uygun hikayeyi bul.",
    href: "/movies",
    icon: Ticket,
  },
  {
    title: "Sinema bul",
    description: "Sana en yakin salonu ve salon ozelliklerini gor.",
    href: "/cinemas",
    icon: MapPin,
  },
  {
    title: "Seans yakala",
    description: "Tarih, film ve sinemaya gore seanslari filtrele.",
    href: "/showtimes",
    icon: CalendarDays,
  },
];

const featuredMovies = [
  { title: "Dune Part Two", meta: "IMAX / Sci-Fi", rating: "8.6", href: "/movies/1" },
  { title: "Inside Out 2", meta: "2D / Animation", rating: "8.0", href: "/movies" },
  { title: "Furiosa", meta: "4DX / Action", rating: "7.8", href: "/movies" },
  { title: "Kingdom", meta: "Dolby / Adventure", rating: "7.5", href: "/movies" },
];

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <Hero />

      <section className={styles.quickSection} aria-labelledby="quick-actions-title">
        <div className={styles.sectionHeader}>
          <span className="ct-eyebrow">Baslangic rotasi</span>
          <h2 id="quick-actions-title">Bilet alma akisina hizli giris</h2>
          <p>Frontend ekibi bu kabuk uzerinden sayfalari parca parca backend ile baglayacak.</p>
        </div>

        <div className={styles.quickGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.href} href={action.href} className={styles.quickCard}>
                <span className={styles.quickIcon}>
                  <Icon size={22} />
                </span>
                <strong>{action.title}</strong>
                <p>{action.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <MovieStrip movies={featuredMovies} />
    </div>
  );
}
