export const VALIDATION_MESSAGES = {
  email: {
    required: "E-posta zorunlu.",
    invalid: "Geçerli bir e-posta adresi girin.",
  },
  password: {
    required: "Şifre zorunlu.",
    pattern:
      "Şifre en az 8 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermeli.",
    confirmRequired: "Şifre tekrarı zorunlu.",
    mismatch: "Şifreler eşleşmiyor.",
  },
  name: {
    required: "Ad zorunlu.",
    size: "Ad 3-20 karakter arasında olmalı.",
  },
  surname: {
    required: "Soyad zorunlu.",
    size: "Soyad 2-25 karakter arasında olmalı.",
  },
  phoneNumber: {
    required: "Telefon numarası zorunlu.",
    invalid: "Telefon numarası (555) 123-4567 formatında olmalı.",
  },
  birthDate: {
    required: "Doğum tarihi zorunlu.",
    past: "Doğum tarihi geçmiş bir tarih olmalı.",
  },
  gender: {
    required: "Cinsiyet seçimi zorunlu.",
  },
  resetToken: {
    missing: "Sıfırlama bağlantısı geçersiz veya eksik.",
  },
  newPassword: {
    required: "Yeni şifre zorunlu.",
    pattern:
      "Şifre en az 8 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermeli.",
  },

  currentPassword: {
    required: "Mevcut şifre zorunlu.",
  },

  cinema: {
    name: { required: "Sinema adı zorunlu." },
    city: { required: "Şehir zorunlu." },
    district: { required: "İlçe zorunlu." },
    address: { required: "Adres zorunlu." },
    phone: {
      required: "Telefon zorunlu.",
      invalid: "Geçerli bir telefon numarası girin.",
    },
  },
  hall: {
    cinemaId: { required: "Sinema seçilmeli." },
    name: { required: "Salon adı zorunlu." },
    hallType: { required: "Salon tipi seçilmeli." },
    rows: { invalid: "Sıra sayısı pozitif bir tam sayı olmalı." },
    seatsPerRow: { invalid: "Koltuk sayısı pozitif bir tam sayı olmalı." },
  },
};

export default VALIDATION_MESSAGES;
