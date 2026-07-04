import { SHOWTIMES_API, SHOWTIME_SEATS_API } from "@/helpers/api-routes";
import { request } from "./api-client";

export const getShowtimes = async (params = {}) => {
  const query = new URLSearchParams(params);
  return request(`${SHOWTIMES_API}${query.toString() ? `?${query}` : ""}`);
};

export const getShowtimeSeats = async (id) => request(SHOWTIME_SEATS_API(id));
