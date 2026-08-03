"use server";

import { getMovieTrailer } from "./movies";
import { getTrailerByMovieTitle } from "@/services/tmdb/movies";


export async function fetchTrailerActionById(movieId) {
    const trailer = await getMovieTrailer(movieId);
    return trailer;
}


export async function fetchTrailerAction(movieTitle) {
    try {
        return await getTrailerByMovieTitle(movieTitle);
    } catch (error) {
        console.error("Fragman aranirken hata:", error);
        return null;
    }
}