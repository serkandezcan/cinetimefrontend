// Footer'daki link kolonlarının verisi

export const FOOTER_LINK_GROUPS = [
  {
    title: "Keşfet",
    links: [
      { label: "Filmler", href: "/movies" },
      { label: "Sinemalar", href: "/cinemas" },
      { label: "Seans Saatleri", href: "/showtimes" },
      { label: "Vizyona Girecekler", href: "/movies/coming-soon" },
    ],
  },
  {
    title: "Hesabım",
    links: [
      { label: "Giriş Yap", href: "/login" },
      { label: "Kayıt Ol", href: "/register" },
      { label: "Biletlerim", href: "/tickets" },
      { label: "Rezervasyonlarım", href: "/bookings" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/about" },
      { label: "İletişim", href: "/contact" },
      { label: "Gizlilik Politikası", href: "/privacy" },
      { label: "Kullanım Şartları", href: "/terms" },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "X (Twitter)", href: "https://x.com", icon: "twitter" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
];

export default FOOTER_LINK_GROUPS;