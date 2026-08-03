

export const tmdbConfig = {
    apiKey: process.env.TMDB_API_TOKEN,
    baseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || "https://api.themoviedb.org/t/p",
};