import { apiClient } from "./api-client";
import { API_ROUTES } from "@/helpers/api-routes";

export const getCinemas = async () => apiClient.get(API_ROUTES.cinemas.list);

export const getCinemaById = async (id) => apiClient.get(API_ROUTES.cinemas.detail(id));

export const getCinemaHalls = async (id) => apiClient.get(API_ROUTES.cinemas.halls(id));

export const createCinema = async (payload, token) =>
  apiClient.post(API_ROUTES.admin.createCinema, payload, { token });

export const createHall = async (payload, token) =>
  apiClient.post(API_ROUTES.admin.createHall, payload, { token });