// Backend API route definitions.

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  // Current signed-in user's own profile.
  user: {
    me: "/user/me",
    updateMe: "/user/me", // PATCH
    deleteMe: "/user/me", // DELETE
    updatePassword: "/user/me/password", // PATCH
  },

  // Admin - user management.
  adminUsers: {
    list: "/admin/users",
    detail: (id) => `/admin/user/${id}`,
    update: (id) => `/admin/user/${id}`, // PATCH
    delete: (id) => `/admin/user/${id}`, // DELETE
  },

  /*
  adminMovies: {
    create: "admin/movies", // POST
    update: (id) => `admin/movies/${id}`, // PUT
    delete: (id) => `admin/movies/${id}`, // DELETE
    detail: (id) => `admin/movies/${id}/`,
  },
  */

  /*
  movies: {
    list: "/movies",
    detail: (id) => `/movies/${id}`,
    detailBySlug: (slug) => `/movies/slug/${slug}`,
    showTimes: (id) => `/movies/${id}/show-times`,
    inTheaters: "/movies/in-theaters",
    comingSoon: "/movies/coming-soon",
    archived: "/movies/archived",
    byHall: (hall) => `/movies/hall/${hall}`,
  },
  */
  movies: {
    list: "/api/movies",
    create: "/api/movies", // POST
    detail: (id) => `/api/movies/${id}`,
    update: (id) => `/api/movies/${id}`, // PUT
    delete: (id) => `/api/movies/${id}`, // DELETE
    detailAdmin: (id) => `/api/movies/${id}/admin`,
    detailBySlug: (slug) => `/api/movies/slug/${slug}`,
    showTimes: (id) => `/api/movies/${id}/show-times`,
    inTheaters: "/api/movies/in-theaters",
    comingSoon: "/api/movies/coming-soon",
    archived: "/api/movies/archived",
    byHall: (hall) => `/api/movies/hall/${hall}`,
  },

  cinemas: {
    list: "/cinemas",
    detail: (id) => `/cinemas/${id}`,
    halls: (id) => `/cinemas/${id}/halls`,
  },

  showtimes: {
    list: "/showtimes",
    seats: (id) => `/showtimes/${id}/seats`,
  },

  // Admin - showtime/hall/cinema management.
  admin: {
    createShowtime: "/admin/showtimes", // POST
    cancelShowtime: (id) => `/admin/showtimes/${id}/cancel`, // PATCH
    createHall: "/admin/halls", // POST
    updateHall: (id) => `/admin/halls/${id}`, // PUT
    deleteHall: (id) => `/admin/halls/${id}`, // DELETE
    createCinema: "/admin/cinemas", // POST
    updateCinema: (id) => `/admin/cinemas/${id}`, // PUT
    deleteCinema: (id) => `/admin/cinemas/${id}`, // DELETE
  },

  // Customer - reservation/booking operations.
  bookings: {
    list: "/customer/bookings",
    create: "/customer/bookings", // POST
    detail: (id) => `/customer/bookings/${id}`,
    pay: (id) => `/customer/bookings/${id}/payment`, // POST
    cancel: (id) => `/customer/bookings/${id}/cancel`, // PATCH
    tickets: (id) => `/customer/bookings/${id}/tickets`,
  },

  tickets: {
    detailByNumber: (ticketNumber) => `/customer/tickets/${ticketNumber}`,
  },
};

export default API_ROUTES;