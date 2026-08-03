import { tmdbFetch } from "./client";

export async function getNowPlayingMovies() {
    const data = await tmdbFetch("/movie/now_playing");
    return data.results;
};

export async function getMovieTrailer(movieId) {
    const data = await tmdbFetch(`/movie/${movieId}/videos`);
    const trailer = data.results.find((video) => video.site === "YouTube" && video.type === "Trailer");
    return trailer ?? null;
};

export async function getUpcomingMovies() {
    const data = await tmdbFetch("/movie/upcoming");
    return data.results;
};

export async function getMovieDetailsWithCredits(movieId) {
    const data = await tmdbFetch(`/movie/${movieId}?append_to_response=credits&language=tr-TR`);
    return data;
};

export async function searchMovieByTitle(title) {
    const query = encodeURIComponent(title);
    const data = await tmdbFetch(`/search/movie?query=${query}&language=tr-TR`);
    return data.results?.[0] ?? null; // en alakali ilk sonuc
}

export async function getTrailerByMovieTitle(title) {
    const match = await searchMovieByTitle(title);
    if (!match) return null;
    return getMovieTrailer(match.id); // zaten mevcut olan fonksiyon
}