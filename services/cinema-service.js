import { apiClient } from "./api-client";
import { API_ROUTES } from "@/helpers/api-routes";

export const getCinemas = async () => apiClient.get(API_ROUTES.cinemas.list);

export const getCinemaById = async (id) => apiClient.get(API_ROUTES.cinemas.detail(id));

export const getCinemaHalls = async (id) => apiClient.get(API_ROUTES.cinemas.halls(id));

export const createCinema = async (payload, token) =>
  apiClient.post(API_ROUTES.admin.createCinema, payload, { token });

export const updateCinema = async (id, payload, token) =>
  apiClient.put(API_ROUTES.admin.updateCinema(id), payload, { token });

export const deleteCinema = async (id, token) =>
  apiClient.delete(API_ROUTES.admin.deleteCinema(id), { token });

export const createHall = async (payload, token) =>
  apiClient.post(API_ROUTES.admin.createHall, payload, { token });

export const updateHall = async (id, payload, token) =>
  apiClient.put(API_ROUTES.admin.updateHall(id), payload, { token });

export const deleteHall = async (id, token) =>
  apiClient.delete(API_ROUTES.admin.deleteHall(id), { token });