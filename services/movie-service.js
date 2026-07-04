import { MOVIES_API, MOVIE_DETAIL_API } from "@/helpers/api-routes";
import { request } from "./api-client";

export const getMovies = async () => request(MOVIES_API);
export const getMovieById = async (id) => request(MOVIE_DETAIL_API(id));
