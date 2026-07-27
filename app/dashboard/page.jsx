import Link from "next/link";
import { Building2, CalendarClock, Clapperboard, DoorOpen } from "lucide-react";
import styles from "./page.module.scss";

const dashboardCards = [
  {
    title: "Film yonetimi",
    description: "Yeni film ekle, movie domain entegrasyonunu test et.",
    href: "/dashboard/movies",
    icon: Clapperboard,
  },
  {
    title: "Sinema yonetimi",
    description: "Sinema kayitlari ve lokasyon bilgisini yonet.",
    href: "/dashboard/cinemas",
    icon: Building2,
  },
  {
    title: "Salon yonetimi",
    description: "Salon ve koltuk yapisini admin akisiyle olustur.",
    href: "/dashboard/halls",
    icon: DoorOpen,
  },
  {
    title: "Seans yonetimi",
    description: "Film, salon, tarih ve fiyat bilgisiyle seans ac.",
    href: "/dashboard/showtimes",
    icon: CalendarClock,
  },
];

export const metadata = { title: "Admin Dashboard" };

export default function DashboardPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Admin Dashboard</span>
        <h1>Yonetim paneli</h1>
        <p>
          Takim domain ekranlarini buradan test edebilir. Film ekleme formu Cahit icin
          Movie Domain teslimati olarak Film yonetimi kartindadir.
        </p>
      </div>

      <div className={styles.grid}>
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.href} href={card.href} className={styles.card}>
              <span className={styles.iconWrap}>
                <Icon size={24} />
              </span>
              <strong>{card.title}</strong>
              <p>{card.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
