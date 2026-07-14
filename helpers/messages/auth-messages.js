export const AUTH_MESSAGES = {
  login: {
    pageTitle: "Giriş Yap | CineTime",
    heading: "Giriş Yap",
    subtitle: "Hesabına giriş yap, biletini almaya devam et.",
    submitButton: "Giriş Yap",
    submitButtonLoading: "Giriş yapılıyor...",
    genericError: "E-posta veya şifre hatalı.",
  },
  register: {
    pageTitle: "Kayıt Ol | CineTime",
    heading: "Hesap Oluştur",
    subtitle: "Birkaç adımda üye ol, film keyfine hemen başla.",
    submitButton: "Kayıt Ol",
    submitButtonLoading: "Kayıt olunuyor...",
    genericError: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
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
      password: "Şifre",
      confirmPassword: "Şifre Tekrar",
    },
    alreadyHaveAccount: "Zaten hesabın var mı?",
    loginLink: "Giriş yap",
  },

  forgotPassword: {
    pageTitle: "Şifremi Unuttum | CineTime",
    heading: "Şifremi Unuttum",
    subtitle:
      "E-posta adresini gir, şifreni sıfırlaman için sana bir bağlantı gönderelim.",
    submitButton: "Sıfırlama Bağlantısı Gönder",
    submitButtonLoading: "Gönderiliyor...",
    genericError: "Bir hata oluştu. Lütfen tekrar deneyin.",
    successMessage:
      "E-posta adresine bir sıfırlama bağlantısı gönderdik. Gelen kutunu kontrol et.",
    backToLogin: "Girişe dön",
  },

  resetPassword: {
    pageTitle: "Şifre Sıfırla | CineTime",
    heading: "Yeni Şifre Belirle",
    subtitle: "Hesabın için yeni bir şifre oluştur.",
    submitButton: "Şifreyi Güncelle",
    submitButtonLoading: "Güncelleniyor...",
    genericError: "Bir hata oluştu. Lütfen tekrar deneyin.",
    successMessage: "Şifren başarıyla güncellendi.",
    invalidTokenMessage:
      "Bu bağlantı geçersiz veya süresi dolmuş. Yeni bir bağlantı talep et.",
    fields: {
      resetPasswordToken: "Sıfırlama Kodu",
      newPassword: "Yeni Şifre",
      confirmPassword: "Yeni Şifre Tekrar",
    },
    goToLogin: "Girişe git",
    requestNewLink: "Yeni bağlantı talep et",
  },

};

export default AUTH_MESSAGES;