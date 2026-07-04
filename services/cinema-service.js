import { CINEMAS_API, CINEMA_DETAIL_API } from "@/helpers/api-routes";
import { request } from "./api-client";

export const getCinemas = async () => request(CINEMAS_API);
export const getCinemaById = async (id) => request(CINEMA_DETAIL_API(id));
