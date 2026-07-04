export const config = {
  project: {
    name: "CineTime",
    slogan: "Pick your movie, choose your seat, enjoy the show",
    description: "Cinema ticket booking app for movies, showtimes, seats, bookings and tickets.",
  },
  apiURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081",
  roles: {
    admin: "ADMIN",
    customer: "CUSTOMER",
  },
  userRightsOnRoutes: [
    { urlRegex: /^\/dashboard(\/.*)?$/, roles: ["ADMIN"] },
    { urlRegex: /^\/tickets(\/.*)?$/, roles: ["CUSTOMER"] },
    { urlRegex: /^\/bookings(\/.*)?$/, roles: ["CUSTOMER"] },
  ],
};
