import { API_ROUTES } from "@/helpers/api-routes";
import { apiClient } from "@/services/api-client";

export const SHOWTIME_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  SOLD_OUT: "SOLD_OUT",
};

const STATUS_LABELS = {
  ACTIVE: "Aktif",
  CANCELLED: "Iptal edildi",
  SOLD_OUT: "Tukendi",
};

export function getShowtimeStatusLabel(status) {
  return STATUS_LABELS[status] ?? status ?? "Bilinmiyor";
}

function cleanFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export function buildShowtimeQuery(filters = {}) {
  const params = new URLSearchParams(cleanFilters(filters));
  return params.toString();
}

export async function getShowtimes(filters = {}) {
  const query = buildShowtimeQuery(filters);
  return apiClient.get(`${API_ROUTES.showtimes.list}${query ? `?${query}` : ""}`);
}

export async function getShowtimeSeats(id) {
  return apiClient.get(API_ROUTES.showtimes.seats(id));
}

export async function createShowtime(payload, token) {
  return apiClient.post(API_ROUTES.admin.createShowtime, payload, { token });
}

export async function cancelShowtime(id, token) {
  return apiClient.patch(API_ROUTES.admin.cancelShowtime(id), undefined, { token });
}

const showtimeService = {
  getShowtimes,
  getShowtimeSeats,
  createShowtime,
  cancelShowtime,
  getShowtimeStatusLabel,
};

export default showtimeService;
