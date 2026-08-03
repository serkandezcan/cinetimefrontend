import { NextResponse } from "next/server";
import { auth } from "@/auth"; // NextAuth config dosyanin gercek yolu farkliysa duzelt
import { getAllTmdbMoviesMapped } from "@/services/tmdb/movie-catalog";
import { createMovie } from "@/services/movie-service";

export async function POST() {
    const session = await auth();

    if (!session?.accessToken) {
        return NextResponse.json({ message: "Yetkisiz." }, { status: 401 });
    }

    let mappedMovies;
    try {
        mappedMovies = await getAllTmdbMoviesMapped();
    } catch (error) {
        return NextResponse.json(
            { message: `TMDB verisi cekilemedi: ${error.message}` },
            { status: 502 }
        );
    }

    const results = { created: [], failed: [] };

    // sequential: backend'i ve TMDB'yi ayni anda 40+ istekle bogmamak icin
    for (const movie of mappedMovies) {
        const { id: _tmdbId, ...payload } = movie; // backend kendi id'sini uretiyor, TMDB id'sini göndermiyoruz

        try {
            const created = await createMovie(payload, session.accessToken);
            results.created.push(created?.title || payload.title);
        } catch (error) {
            results.failed.push({ title: payload.title, reason: error.message });
        }
    }

    return NextResponse.json(results);
}