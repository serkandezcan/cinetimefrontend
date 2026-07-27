export const CINEMA_MESSAGES = {
  public: {
    pageTitle: "Sinemalar | CineTime",
    heading: "Sinemalar",
    subtitle: "Şehrindeki CineTime salonlarını keşfet.",
    emptyList: "Henüz kayıtlı sinema yok.",
    loadError: "Sinemalar yüklenirken bir sorun oluştu.",
  },
  detail: {
    subtitle: "Sinema bilgileri.",
    loadError: "Sinema bilgileri yüklenirken bir sorun oluştu.",
    backLink: "Sinemalara dön",
    fields: {
      location: "Konum",
      address: "Adres",
      phone: "Telefon",
      coordinates: "Koordinatlar",
    },
  },
  admin: {
    cinema: {
      pageTitle: "Sinema Yönetimi | CineTime",
      heading: "Sinema Yönetimi",
      subtitle: "Yeni sinema ekle.",
      formTitle: "Yeni Sinema",
      fields: {
        name: "Sinema Adı",
        city: "Şehir",
        district: "İlçe",
        address: "Adres",
        phone: "Telefon",
        latitude: "Enlem",
        longitude: "Boylam",
      },
      submitButton: "Sinemayı Kaydet",
      submitButtonLoading: "Kaydediliyor...",
      genericError: "Sinema oluşturulurken bir sorun oluştu.",
      createSuccess: (name) => `${name} başarıyla oluşturuldu.`,
    },
    hall: {
      pageTitle: "Salon Yönetimi | CineTime",
      heading: "Salon Yönetimi",
      subtitle: "Bir sinemaya yeni salon ekle.",
      formTitle: "Yeni Salon",
      fields: {
        cinemaId: "Sinema",
        name: "Salon Adı",
        hallType: "Salon Tipi",
        rows: "Sıra Sayısı",
        seatsPerRow: "Sıra Başına Koltuk",
      },
      submitButton: "Salonu Kaydet",
      submitButtonLoading: "Kaydediliyor...",
      genericError: "Salon oluşturulurken bir sorun oluştu.",
      createSuccess: (name) => `${name} başarıyla oluşturuldu.`,
      noCinemas: "Salon eklemeden önce en az bir sinema oluşturulmalı.",
      cinemaListError: "Sinema listesi yüklenirken bir sorun oluştu.",
      summary: {
        capacity: "Toplam Kapasite",
        createdSeatCount: "Oluşturulan Koltuk Sayısı",
      },
    },
  },
};

export default CINEMA_MESSAGES;
