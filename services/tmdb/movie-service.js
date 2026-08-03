import { getAllTmdbMoviesMapped, getTmdbMovieMapped } from "./tmdb/movie-catalog";

export const MOVIE_STATUS = {
    NOW_SHOWING: "NOW_SHOWING",
    COMING_SOON: "COMING_SOON",
};

export function normalizeMovieStatus(status) {
    return String(status || "").trim().toUpperCase();
}

export function getMovieStatusLabel(status) {
    switch (normalizeMovieStatus(status)) {
        case MOVIE_STATUS.NOW_SHOWING:
            return "Gösterimde";
        case MOVIE_STATUS.COMING_SOON:
            return "Yakında";
        default:
            return "Durum yok";
    }
}

export async function getMovies({ size = 24, sortBy = "id", order = "ASC" } = {}) {
    const movies = await getAllTmdbMoviesMapped();

    const sorted = [...movies].sort((a, b) => {
        const dir = order === "DESC" ? -1 : 1;
        if (a[sortBy] < b[sortBy]) return -1 * dir;
        if (a[sortBy] > b[sortBy]) return 1 * dir;
        return 0;
    });

    return {
        content: sorted.slice(0, size),
        totalElements: sorted.length,
    };
}

export async function getMovieById(id) {
    return getTmdbMovieMapped(Number(id));
}