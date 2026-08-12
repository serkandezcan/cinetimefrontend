import { getMovies } from "@/services/movie-service";
import { mergeMoviesWithFallbacks } from "@/helpers/fallback-movies";
import HeroCarousel from "./HeroCarousel";

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

  return <HeroCarousel movies={mergeMoviesWithFallbacks(movies)} />;
}
