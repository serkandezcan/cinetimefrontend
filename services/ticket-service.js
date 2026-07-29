import { API_ROUTES } from "@/helpers/api-routes";
import apiClient from "./api-client";
import { getCustomerBookings } from "./booking-service";

export const getBookingTickets = async (bookingId, token) => {
  return apiClient.get(API_ROUTES.bookings.tickets(bookingId), {
    token,
  });
};

export const getTicketByNumber = async (ticketNumber, token) => {
  return apiClient.get(API_ROUTES.tickets.detailByNumber(ticketNumber), {
    token,
  });
};

export const getCustomerTickets = async (token) => {
  const bookings = await getCustomerBookings(token);

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return [];
  }

  const ticketGroups = await Promise.all(
    bookings.map((booking) => getBookingTickets(booking.id, token)),
  );

  return ticketGroups.flat();
};

/*import { API_ROUTES } from "@/helpers/api-routes";
import apiClient from "@/services/api-client";

export const getBookingTickets=async(bookingId,token)=>{
  return apiClient.get(API_ROUTES.bookings.tickets(bookingId),{token,});
};

export const getTicketByNumber=async(ticketNumber,token)=>{
  return apiClient.get(API_ROUTES.tickets.detailByNumber(ticketNumber),{token,});
};
*/

/*

export const getBookingTickets = async (bookingId, token) => request(CUSTOMER_BOOKING_TICKETS_API(bookingId), {
  headers: { Authorization: `Bearer ${token}` },
});

export const getTicketByNumber = async (ticketNumber, token) => request(CUSTOMER_TICKET_DETAIL_API(ticketNumber), {
  headers: { Authorization: `Bearer ${token}` },
}); 

*/
