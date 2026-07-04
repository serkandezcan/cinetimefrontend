import { CUSTOMER_BOOKINGS_API, CUSTOMER_PAYMENT_API } from "@/helpers/api-routes";
import { request } from "./api-client";

export const createBooking = async (payload, token) => request(CUSTOMER_BOOKINGS_API, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(payload),
});

export const completePayment = async (bookingId, token) => request(CUSTOMER_PAYMENT_API(bookingId), {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
});
