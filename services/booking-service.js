import { API_ROUTES } from "@/helpers/api-routes";
import { apiClient } from "@/services/api-client";

export async function createBooking(payload, token) {
  return apiClient.post(API_ROUTES.bookings.create, payload, { token });
}

export async function getMyBookings(token) {
  return apiClient.get(API_ROUTES.bookings.list, { token });
}

export async function getBookingById(bookingId, token) {
  return apiClient.get(API_ROUTES.bookings.detail(bookingId), { token });
}

export async function cancelBooking(bookingId, token) {
  return apiClient.patch(API_ROUTES.bookings.cancel(bookingId), undefined, { token });
}

export async function completePayment(bookingId, token) {
  return apiClient.post(API_ROUTES.bookings.pay(bookingId), {}, { token });
}

const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  completePayment,
};

export default bookingService;
