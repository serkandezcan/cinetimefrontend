import { apiClient } from "@/services/api-client";
import { API_ROUTES } from "@/helpers/api-routes";

/**
 * Mevcut giriş yapmış kullanıcının profil bilgilerini getirir.
 * Backend: GET /user/me → UserResponseDTO
 */
export async function getMe(token) {
  return apiClient.get(API_ROUTES.user.me, { token });
}

/**
 * Kullanıcı profilini günceller (şifre hariç).
 * Backend: PATCH /user/me → UserUpdateWithoutPasswordRequestDTO
 * Tüm alanlar opsiyonel — sadece değiştirilen alanları gönder.
 * payload: { name?, surname?, email?, phoneNumber?, birthDate?, gender? }
 */
export async function updateMe(payload, token) {
  return apiClient.patch(API_ROUTES.user.me, payload, { token });
}

/**
 * Kullanıcının şifresini günceller.
 * Backend: PATCH /user/me/password → UserUpdatePasswordRequestDTO
 * payload: { currentPassword, newPassword, confirmPassword }
 */
export async function updatePassword(payload, token) {
  return apiClient.patch(API_ROUTES.user.updatePassword, payload, { token });
}

/**
 * Kullanıcının hesabını siler.
 * Backend: DELETE /user/me
 */
export async function deleteMe(token) {
  return apiClient.delete(API_ROUTES.user.me, { token });
}

const userService = { getMe, updateMe, updatePassword, deleteMe };
export default userService;