import MovieDetail from "@/components/movies/MovieDetail";

export const metadata = { title: "Movie Detail" };

export default async function MovieDetailPage({ params }) {
  const { id } = await params;

  return <MovieDetail movieId={id} />;
}
