import { getMovies } from "@/services/movie-service";
import HeroCarousel from "./HeroCarousel";

const FALLBACK_MOVIES = [
  {
    id: "fallback-dune-part-two",
    title: "Dune Part Two",
    summary:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    duration: 166,
    rating: 8.6,
    genre: "Sci-Fi",
    specialHalls: "IMAX",
    href: "/movies",
  },
  {
    id: "fallback-inside-out-2",
    title: "Inside Out 2",
    summary: "Yeni duygularla buyuyen Riley'nin renkli hikayesi.",
    duration: 96,
    rating: 8.0,
    genre: "Animasyon",
    specialHalls: "2D",
    href: "/movies",
  },
  {
    id: "fallback-furiosa",
    title: "Furiosa",
    summary: "Wasteland'de hiz, intikam ve hayatta kalma mucadelesi.",
    duration: 148,
    rating: 7.8,
    genre: "Aksiyon",
    specialHalls: "4DX",
    href: "/movies",
  },
  {
    id: "fallback-kingdom",
    title: "Kingdom",
    summary: "Kralligin kaderini belirleyen buyuk macera.",
    duration: 132,
    rating: 7.5,
    genre: "Macera",
    specialHalls: "Dolby",
    href: "/movies",
  },
];

function buildHeroMovies(movies = []) {
  const merged = [];
  const seenTitles = new Set();

  for (const movie of [...movies, ...FALLBACK_MOVIES]) {
    if (!movie?.title) continue;
    const titleKey = movie.title.toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    merged.push(movie);
    if (merged.length === 8) return merged;
  }

  return merged;
}

export default async function Hero() {
  let movies = [];

  try {
    const { content } = await getMovies({
      size: 8,
      sortBy: "createdAt",
      order: "DESC",
    });
    movies = content || [];
  } catch {
    movies = [];
  }

  return <HeroCarousel movies={buildHeroMovies(movies)} />;
}
