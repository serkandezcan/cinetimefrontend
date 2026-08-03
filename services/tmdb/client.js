import { tmdbConfig as config } from "./config";

export async function tmdbFetch(endpoint, options = {}) {

    const url = `${config.baseUrl}${endpoint}`;

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`,
        },
        next: {
            revalidate: 3060,
        },
    });

    if (!res.ok) {
        throw new Error(`TMDB isteği başarısız: ${res.status} - ${endpoint}`);
    }
    return res.json();
}