import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import Hero from "@/components/home/Hero";
import MovieStrip from "@/components/home/MovieStrip";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

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

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <Hero />

      <section className={styles.quickSection} aria-labelledby="quick-actions-title">
        <div className={styles.sectionHeader}>
          <span className="ct-eyebrow">Baslangic rotasi</span>
          <h2 id="quick-actions-title">Bilet alma akisina hizli giris</h2>
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

      <MovieStrip />
    </div>
  );
}