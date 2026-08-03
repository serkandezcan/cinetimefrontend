import { getNowPlayingMovies, getUpcomingMovies, getMovieDetailsWithCredits } from "./movies";
import { mapTmdbMovieToEntity } from "./mapper";

async function mapListToEntities(tmdbList) {
    const withReleaseDate = tmdbList.filter((movie) => movie.release_date);

    const detailed = await Promise.all(
        withReleaseDate.map((movie) => getMovieDetailsWithCredits(movie.id))
    );

    return detailed.map((tmdbMovie) => ({
        id: tmdbMovie.id,
        ...mapTmdbMovieToEntity(tmdbMovie),
    }));
}

export async function getAllTmdbMoviesMapped() {
    const [nowPlaying, upcoming] = await Promise.all([
        getNowPlayingMovies(),
        getUpcomingMovies(),
    ]);

    // ayni film iki listede de olabilir, id'ye gore tekillestir
    const combined = [...nowPlaying, ...upcoming];
    const uniqueById = Array.from(new Map(combined.map((m) => [m.id, m])).values());

    return mapListToEntities(uniqueById);
}

export async function getTmdbMovieMapped(movieId) {
    const tmdbMovie = await getMovieDetailsWithCredits(movieId);
    return { id: tmdbMovie.id, ...mapTmdbMovieToEntity(tmdbMovie) };
}