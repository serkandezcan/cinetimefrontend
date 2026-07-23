import { API_ROUTES } from "@/helpers/api-routes";
import { apiClient } from "@/services/api-client";

export const MOVIE_STATUS = {
  NOW_SHOWING: 0,
  COMING_SOON: 1,
  ARCHIVED: 2,
};

const STATUS_LABELS = {
  0: "Gosterimde",
  1: "Yakinda",
  2: "Arsiv",
  NOW_SHOWING: "Gosterimde",
  COMING_SOON: "Yakinda",
  ARCHIVED: "Arsiv",
};

export function getMovieStatusLabel(status) {
  return STATUS_LABELS[status] ?? "Bilinmiyor";
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

export async function getMovies({ page = 0, size = 12, sortBy = "id", order = "ASC" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    order,
  });

  const data = await apiClient.get(`${API_ROUTES.movies.list}?${params}`);
  return normalizeMoviePage(data);
}

export async function getMovieById(id) {
  return apiClient.get(API_ROUTES.movies.detail(id));
}

export async function createMovie(payload, token) {
  return apiClient.post(API_ROUTES.movies.create, payload, { token });
}

const movieService = {
  getMovies,
  getMovieById,
  createMovie,
  getMovieStatusLabel,
};

export default movieService;
