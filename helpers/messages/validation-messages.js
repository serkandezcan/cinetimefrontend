
//  Tüm form validasyon mesajları burada toplanır.

 
export const VALIDATION_MESSAGES = {
  email: {
    required: "E-posta zorunlu.",
    invalid: "Geçerli bir e-posta adresi girin.",
  },
  password: {
    required: "Şifre zorunlu.",
    minLength: "Şifre en az 8 karakter olmalı.",
  },
};

export default VALIDATION_MESSAGES;