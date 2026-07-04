import { CUSTOMER_BOOKING_TICKETS_API, CUSTOMER_TICKET_DETAIL_API } from "@/helpers/api-routes";
import { request } from "./api-client";

export const getBookingTickets = async (bookingId, token) => request(CUSTOMER_BOOKING_TICKETS_API(bookingId), {
  headers: { Authorization: `Bearer ${token}` },
});

export const getTicketByNumber = async (ticketNumber, token) => request(CUSTOMER_TICKET_DETAIL_API(ticketNumber), {
  headers: { Authorization: `Bearer ${token}` },
});
