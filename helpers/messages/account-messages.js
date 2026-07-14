export const ACCOUNT_MESSAGES = {
  pageTitle: "Hesabım | CineTime",
  heading: "Hesabım",
  subtitle: "Profil bilgilerini güncelle veya şifreni değiştir.",

  profileSection: {
    title: "Profil Bilgileri",
    fields: {
      name: "Ad",
      surname: "Soyad",
      email: "E-posta",
      phoneNumber: "Telefon Numarası",
      phoneNumberPlaceholder: "(555) 123-4567",
      birthDate: "Doğum Tarihi",
      gender: "Cinsiyet",
      genderMale: "Erkek",
      genderFemale: "Kadın",
    },
    submitButton: "Profili Güncelle",
    submitButtonLoading: "Güncelleniyor...",
    successMessage: "Profil güncellendi.",
    genericError: "Güncelleme sırasında bir hata oluştu.",
  },

  passwordSection: {
    title: "Şifre Değiştir",
    fields: {
      currentPassword: "Mevcut Şifre",
      newPassword: "Yeni Şifre",
      confirmPassword: "Yeni Şifre Tekrar",
    },
    submitButton: "Şifreyi Güncelle",
    submitButtonLoading: "Güncelleniyor...",
    successMessage: "Şifre güncellendi.",
    genericError: "Şifre güncellenirken bir hata oluştu.",
  },

  deleteSection: {
    title: "Hesabı Sil",
    description:
      "Hesabını sildiğinde tüm verilerin kalıcı olarak silinir. Bu işlem geri alınamaz.",
    triggerButton: "Hesabımı Sil",
    modalTitle: "Hesabını silmek istediğine emin misin?",
    modalDescription:
      "Bu işlem geri alınamaz. Tüm rezervasyonların, biletlerin ve hesap bilgilerin kalıcı olarak silinecek.",
    confirmButton: "Evet, Hesabımı Sil",
    confirmButtonLoading: "Siliniyor...",
    cancelButton: "Vazgeç",
    genericError: "Hesap silinirken bir hata oluştu.",
  },
};

export default ACCOUNT_MESSAGES;