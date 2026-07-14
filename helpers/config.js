// Merkezi konfigürasyon dosyası
// Tüm env değişkenleri buradan okunur, kod icinde
// process.env dogrudan kullanilmaz.


const isBrowser = typeof window !== "undefined";



export const config = {

  tmdb: {
  apiToken: process.env.TMDB_API_TOKEN,
  imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p",
  },

  project: {
    name: "CineTime",
    slogan: "Pick your movie, choose your seat, enjoy the show",
    description: "Cinema ticket booking app for movies, showtimes, seats, bookings and tickets.",
  },
  apiURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081",
  roles: {
    admin: "ROLE_ADMIN",
    manager: "MANAGER",
    customer: "ROLE_CUSTOMER",
  },
  roleNames: {
    admin: "ADMIN",
    manager: "MANAGER",
    customer: "CUSTOMER",
  },
  userRightsOnRoutes: [
    { urlRegex: /^\/dashboard(\/.*)?$/, roles: ["ADMIN"] },
    { urlRegex: /^\/tickets(\/.*)?$/, roles: ["CUSTOMER"] },
    { urlRegex: /^\/bookings(\/.*)?$/, roles: ["CUSTOMER"] },
  ],

  // Sadece server tarafında kullanılır (Auth.js secret)
  authSecret: process.env.AUTH_SECRET,

  // Ortam bilgisi
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  
}

if (!isBrowser && config.isProduction && !config.authSecret) {
  console.warn(
    "[config] AUTH_SECRET tanımlı değil. Production build'de bu zorunludur."
  ); 
  
};


