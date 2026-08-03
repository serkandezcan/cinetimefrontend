import Link from "next/link";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { getMovies } from "@/services/movie-service";
import styles from "./hero.module.scss";

const FEATURED_TITLE = "Dune Part Two";

function getPosterStyle(posterUrl) {
  if (!posterUrl || !String(posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(90deg, rgba(7, 17, 31, 0.86), rgba(7, 17, 31, 0.42)), linear-gradient(180deg, rgba(7, 17, 31, 0.2), rgba(7, 17, 31, 0.9)), url(${posterUrl})`,
  };
}

function pickFeaturedMovie(movies = []) {
  return movies.find((movie) => movie.title?.toLowerCase() === FEATURED_TITLE.toLowerCase()) || movies[0] || null;
}

export default async function Hero() {
  let featuredMovie = null;

  try {
    const { content: movies } = await getMovies({
      size: 50,
      sortBy: "id",
      order: "DESC",
    });
    featuredMovie = pickFeaturedMovie(movies);
  } catch {
    return null;
  }

  if (!featuredMovie) return null;

  const posterStyle = getPosterStyle(featuredMovie.posterUrl);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className="ct-eyebrow">CineTime</span>
        <h1>Seansini bul, koltugunu sec, biletini guvenle al.</h1>
        <p>
          Vizyondaki filmleri incele, sana uygun seansi sec ve biletini birkac
          adimda tamamla.
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
          <span>Film, seans, koltuk ve bilet islemleri tek yerde</span>
        </div>
      </div>

      <div className={styles.posterStage} aria-label="Featured movie preview">
        <Link
          href={`/movies/${featuredMovie.id}`}
          className={`${styles.posterCard} ${posterStyle ? styles.hasPoster : ""}`}
          style={posterStyle}
          aria-label={`${featuredMovie.title} film detayina git`}
        >
          <div className={styles.posterTopline}>Gosterimde</div>
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