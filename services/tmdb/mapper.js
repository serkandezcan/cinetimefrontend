// services/tmdb/mapper.js

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function toSlug(title, id) {
    const base = (title || "movie")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // aksanları temizle (ı, ğ, ü, ş, ö, ç dahil)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // unique olması icin sonuna tmdb id'sini ekliyoruz, entity max 150 char
    const slug = `${base}-${id}`;
    return slug.length > 150 ? slug.slice(0, 150) : slug;
}

function toSummary(overview) {
    const fallback = "Film özeti yakında eklenecek.";
    if (!overview || overview.trim().length < 3) return fallback;

    // entity max 300 char, min 3 char
    return overview.length > 300 ? `${overview.slice(0, 297)}...` : overview;
}

function toTitle(title) {
    const safeTitle = (title || "Bilinmeyen Film").trim();
    // entity min 3 char
    return safeTitle.length < 3 ? safeTitle.padEnd(3, ".") : safeTitle.slice(0, 100);
}

function resolveStatus(releaseDateStr) {
    if (!releaseDateStr) return "COMING_SOON";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const releaseDate = new Date(releaseDateStr);

    return releaseDate <= today ? "NOW_SHOWING" : "COMING_SOON";
}

function resolveDirector(credits) {
    const director = credits?.crew?.find((person) => person.job === "Director");
    return director?.name || "Bilinmiyor";
}

function resolveCast(credits, limit = 6) {
    return (credits?.cast || []).slice(0, limit).map((actor) => actor.name);
}

function resolveGenre(tmdbMovie) {
    // detay endpoint'i "genres: [{id, name}]" olarak doner
    if (Array.isArray(tmdbMovie.genres) && tmdbMovie.genres.length > 0) {
        return tmdbMovie.genres.map((g) => g.name).join(", ");
    }
    return "Genel";
}

/**
 * TMDB'nin /movie/{id}?append_to_response=credits cevabini
 * backend Movie entity'sine uygun bir objeye cevirir.
 *
 * @param {object} tmdbMovie - TMDB movie details response (credits dahil)
 * @param {object} [overrides] - formats, specialHalls gibi elle set etmek istediklerin
 */
export function mapTmdbMovieToEntity(tmdbMovie, overrides = {}) {
    return {
        title: toTitle(tmdbMovie.title || tmdbMovie.original_title),
        slug: toSlug(tmdbMovie.title || tmdbMovie.original_title, tmdbMovie.id),
        summary: toSummary(tmdbMovie.overview),
        releaseDate: tmdbMovie.release_date || null,
        duration: tmdbMovie.runtime || 0,
        rating: typeof tmdbMovie.vote_average === "number" ? tmdbMovie.vote_average : null,
        director: resolveDirector(tmdbMovie.credits),
        cast: resolveCast(tmdbMovie.credits),
        formats: overrides.formats || ["2D"],
        genre: resolveGenre(tmdbMovie),
        posterUrl: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}` : null,
        status: resolveStatus(tmdbMovie.release_date),
        specialHalls: overrides.specialHalls || null,
        // backend tarafinda id, createdAt, updatedAt otomatik set edilir, burada gondermiyoruz
    };
}