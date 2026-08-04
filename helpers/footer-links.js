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
      { label: "Gizlilik", href: "/privacy" },
      { label: "Kullanim", href: "/terms" },
      { label: "Destek", href: "/support" },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "X", href: "https://x.com", icon: "twitter" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  { label: "WhatsApp", href: "https://www.whatsapp.com", icon: "whatsapp" },
];

export default FOOTER_LINK_GROUPS;