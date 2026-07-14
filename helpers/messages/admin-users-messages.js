export const ADMIN_USERS_MESSAGES = {
  pageTitle: "Kullanıcı Yönetimi | CineTime",
  heading: "Kullanıcı Yönetimi",
  subtitle: "Tüm kullanıcıları görüntüle, düzenle veya sil.",

  table: {
    name: "Ad Soyad",
    email: "E-posta",
    role: "Rol",
    actions: "İşlemler",
    editButton: "Düzenle",
    deleteButton: "Sil",
    empty: "Kullanıcı bulunamadı.",
  },

  pagination: {
    previous: "← Önceki",
    next: "Sonraki →",
    pageInfo: (current, total) => `Sayfa ${current} / ${total}`,
  },

  roleLabels: {
    ROLE_ADMIN: "Admin",
    ROLE_MANAGER: "Yönetici",
    ROLE_CUSTOMER: "Müşteri",
  },

  editModal: {
    title: "Kullanıcıyı Düzenle",
    fields: {
      name: "Ad",
      surname: "Soyad",
      email: "E-posta",
      phoneNumber: "Telefon Numarası",
      role: "Rol",
    },
    saveButton: "Kaydet",
    saveButtonLoading: "Kaydediliyor...",
    cancelButton: "Vazgeç",
    genericError: "Güncelleme sırasında bir hata oluştu.",
  },

  deleteModal: {
    title: "Kullanıcıyı silmek istediğine emin misin?",
    description: (name) =>
      `${name} adlı kullanıcı kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
    confirmButton: "Evet, Sil",
    confirmButtonLoading: "Siliniyor...",
    cancelButton: "Vazgeç",
    genericError: "Silme işlemi sırasında bir hata oluştu.",
  },
};

export default ADMIN_USERS_MESSAGES;