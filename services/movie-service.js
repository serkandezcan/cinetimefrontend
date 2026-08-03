import { API_ROUTES } from "@/helpers/api-routes";
import { apiClient } from "@/services/api-client";

export const MOVIE_STATUS = {
  NOW_SHOWING: "NOW_SHOWING",
  COMING_SOON: "COMING_SOON",
  ARCHIVED: "ARCHIVED",
};

const STATUS_ALIASES = {
  0: MOVIE_STATUS.NOW_SHOWING,
  1: MOVIE_STATUS.COMING_SOON,
  2: MOVIE_STATUS.ARCHIVED,
  ACTIVE: MOVIE_STATUS.NOW_SHOWING,
  SHOWING: MOVIE_STATUS.NOW_SHOWING,
  IN_THEATERS: MOVIE_STATUS.NOW_SHOWING,
  RELEASED: MOVIE_STATUS.NOW_SHOWING,
  NOW_SHOWING: MOVIE_STATUS.NOW_SHOWING,
  COMING: MOVIE_STATUS.COMING_SOON,
  SOON: MOVIE_STATUS.COMING_SOON,
  COMING_SOON: MOVIE_STATUS.COMING_SOON,
  ARCHIVE: MOVIE_STATUS.ARCHIVED,
  ARCHIVED: MOVIE_STATUS.ARCHIVED,
};

const STATUS_LABELS = {
  [MOVIE_STATUS.NOW_SHOWING]: "Gosterimde",
  [MOVIE_STATUS.COMING_SOON]: "Yakinda",
  [MOVIE_STATUS.ARCHIVED]: "Arsiv",
};

export function normalizeMovieStatus(status) {
  if (status === null || status === undefined || status === "") return "";
  const key = String(status).trim().toUpperCase();
  return STATUS_ALIASES[key] ?? key;
}

export function getMovieStatusLabel(status) {
  const normalizedStatus = normalizeMovieStatus(status);
  return STATUS_LABELS[normalizedStatus] ?? "Bilinmiyor";
}

export function normalizeMoviePage(data) {
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
      empty: data.length === 0,
    };
  }

  return {
    content: data?.content ?? [],
    totalElements: data?.totalElements ?? data?.content?.length ?? 0,
    totalPages: data?.totalPages ?? 0,
    number: data?.number ?? 0,
    size: data?.size ?? data?.content?.length ?? 0,
    empty: data?.empty ?? !data?.content?.length,
  };
}

export async function getMovies({ page = 0, size = 12, sortBy = "id", order = "ASC", q } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: sortBy,
    type: order,
  });

  if (q) params.set("q", q);

  const data = await apiClient.get(`${API_ROUTES.movies.list}?${params}`);
  return normalizeMoviePage(data);
}

export async function getMovieById(id) {
  return apiClient.get(API_ROUTES.movies.detail(id));
}

export async function createMovie(payload, token) {
  return apiClient.post(API_ROUTES.movies.create, payload, { token });
}

export async function updateMovie(id, payload, token) {
  return apiClient.put(API_ROUTES.movies.update(id), payload, { token });
}

export async function deleteMovie(id, token) {
  return apiClient.delete(API_ROUTES.movies.delete(id), { token });
}

const movieService = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStatusLabel,
  normalizeMovieStatus,
};

export default movieService;