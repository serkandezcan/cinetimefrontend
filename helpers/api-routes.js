import { config } from "./config";

export const LOGIN_API = `${config.apiURL}/auth/login`;
export const REGISTER_API = `${config.apiURL}/auth/register`;

export const MOVIES_API = `${config.apiURL}/api/movies`;
export const MOVIE_DETAIL_API = (id) => `${config.apiURL}/api/movies/${id}`;

export const CINEMAS_API = `${config.apiURL}/cinemas`;
export const CINEMA_DETAIL_API = (id) => `${config.apiURL}/cinemas/${id}`;

export const SHOWTIMES_API = `${config.apiURL}/showtimes`;
export const SHOWTIME_SEATS_API = (id) => `${config.apiURL}/showtimes/${id}/seats`;

export const CUSTOMER_BOOKINGS_API = `${config.apiURL}/customer/bookings`;
export const CUSTOMER_PAYMENT_API = (bookingId) => `${config.apiURL}/customer/bookings/${bookingId}/payment`;
export const CUSTOMER_BOOKING_TICKETS_API = (bookingId) => `${config.apiURL}/customer/bookings/${bookingId}/tickets`;
export const CUSTOMER_TICKET_DETAIL_API = (ticketNumber) => `${config.apiURL}/customer/tickets/${ticketNumber}`;

export const ADMIN_CINEMAS_API = `${config.apiURL}/admin/cinemas`;
export const ADMIN_HALLS_API = `${config.apiURL}/admin/halls`;
export const ADMIN_SHOWTIMES_API = `${config.apiURL}/admin/showtimes`;
