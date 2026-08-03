import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { getMovies } from "@/services/movie-service";
import styles from "./hero.module.scss";

export default async function Hero() {
  let featuredMovie = null;

  try {
    const { content: movies } = await getMovies({
      size: 1,
      sortBy: "id",
      order: "DESC",
    });
    featuredMovie = movies?.[0] || null;
  } catch {
    return null;
  }

  if (!featuredMovie) return null;

  const backdropUrl = featuredMovie.posterUrl || null;

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className="ct-eyebrow">CineTime</span>
        <h1>Filmden koltuga, koltuktan bilete tek akista sinema deneyimi.</h1>
        <p>
          Vizyondaki filmleri kesfet, sana uygun seansi sec, koltugunu ayir ve
          biletini birkac adimda tamamla.
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
            <ShieldCheck size={16} /> Guvenli rezervasyon
          </span>
          <span>Film, seans, koltuk ve bilet islemleri tek akista</span>
        </div>
      </div>

      <div className={styles.posterStage} aria-label="Featured movie preview">
        <Link
          href={`/movies/${featuredMovie.id}`}
          className={styles.posterCard}
          aria-label={`${featuredMovie.title} film detayina git`}
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={featuredMovie.title}
              fill
              priority
              className={styles.posterBackdrop}
            />
          )}
          <div className={styles.posterTopline}>Bu aksam / 20:30</div>
          <h2>{featuredMovie.title}</h2>
          <p>
            {featuredMovie.specialHalls
              ? `${featuredMovie.specialHalls} salonunda koltugunu sec, biletini hizlica al.`
              : "Koltugunu sec, biletini hizlica al."}
          </p>
          <span className={styles.playButton} aria-hidden="true">
            <Play size={18} fill="currentColor" />
          </span>
        </Link>
        <div className={styles.seatMiniMap} aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className={index === 8 || index === 9 ? styles.booked : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}