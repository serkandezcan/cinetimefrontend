// Footer navigation groups. Keep links in one place so components stay simple.

export const FOOTER_LINK_GROUPS = [
  {
    title: "Kesfet",
    links: [
      { label: "Filmler", href: "/movies" },
      { label: "Sinemalar", href: "/cinemas" },
      { label: "Seans Saatleri", href: "/showtimes" },
      { label: "Biletlerim", href: "/tickets" },
    ],
  },
  {
    title: "Hesabim",
    links: [
      { label: "Giris Yap", href: "/login" },
      { label: "Kayit Ol", href: "/register" },
      { label: "Profil", href: "/account" },
      { label: "Panel", href: "/dashboard" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkimizda", href: "/about" },
      { label: "Gizlilik", href: "/about" },
      { label: "Kullanim", href: "/about" },
      { label: "Destek", href: "/about" },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "X", href: "https://x.com", icon: "twitter" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
];

export default FOOTER_LINK_GROUPS;
