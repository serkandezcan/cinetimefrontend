export const FALLBACK_MOVIES = [
  {
    id: "fallback-dune-part-two",
    title: "Dune Part Two",
    summary:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    releaseDate: "2026-07-01",
    duration: 166,
    rating: 8.6,
    director: "Denis Villeneuve",
    cast: ["Timothee Chalamet", "Zendaya"],
    formats: ["IMAX", "2D"],
    genre: "Sci-Fi",
    specialHalls: "IMAX",
    status: "NOW_SHOWING",
    href: "/movies",
  },
  {
    id: "fallback-inside-out-2",
    title: "Inside Out 2",
    summary: "Yeni duygularla buyuyen Riley'nin renkli hikayesi.",
    releaseDate: "2026-07-05",
    duration: 96,
    rating: 8.0,
    genre: "Animasyon",
    specialHalls: "2D",
    status: "NOW_SHOWING",
    href: "/movies",
  },
  {
    id: "fallback-furiosa",
    title: "Furiosa",
    summary: "Wasteland'de hiz, intikam ve hayatta kalma mucadelesi.",
    releaseDate: "2026-07-12",
    duration: 148,
    rating: 7.8,
    genre: "Aksiyon",
    specialHalls: "4DX",
    status: "NOW_SHOWING",
    href: "/movies",
  },
  {
    id: "fallback-kingdom",
    title: "Kingdom",
    summary: "Kralligin kaderini belirleyen buyuk macera.",
    releaseDate: "2026-07-18",
    duration: 132,
    rating: 7.5,
    genre: "Macera",
    specialHalls: "Dolby",
    status: "NOW_SHOWING",
    href: "/movies",
  },
];

function getTitleKey(movie) {
  return movie?.title ? movie.title.trim().toLowerCase() : "";
}

export function mergeMoviesWithFallbacks(movies = [], { max } = {}) {
  const merged = [];
  const seenTitles = new Set();

  for (const movie of [...movies, ...FALLBACK_MOVIES]) {
    const titleKey = getTitleKey(movie);
    if (!titleKey || seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    merged.push(movie);

    if (max && merged.length >= max) return merged;
  }

  return merged;
}
