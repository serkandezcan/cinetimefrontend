import { apiClient } from "@/services/api-client";
import { API_ROUTES } from "@/helpers/api-routes";

/**
 * Kullanıcıları sayfalı şekilde listeler (admin).
 * Backend: GET /admin/users → Page<UserResponseDTO>
 * Response.object: { content: [...], totalElements, totalPages, number, size, ... }
 * (Spring Data Page yapısı)
 *
 * @param {object} options
 * @param {number} [options.page=1]
 * @param {number} [options.size=10]
 * @param {string} [options.sortBy="name"]
 * @param {"asc"|"desc"} [options.order="asc"]
 */
export async function getAllUsers(
  { page = 1, size = 10, sortBy = "name", order = "ASC" } = {},
  token
) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    order,
  });

  return apiClient.get(`${API_ROUTES.adminUsers.list}?${params}`, { token });
}

/**
 * Tek bir kullanıcının detayını getirir.
 * Backend: GET /admin/user/{id} → UserResponseDTO
 */
export async function getUserById(id, token) {
  return apiClient.get(API_ROUTES.adminUsers.detail(id), { token });
}

/**
 * Kullanıcıyı günceller (admin) — role dahil.
 * Backend: PATCH /admin/user/{id} → AdminUserUpdateRequestDTO
 *
 * ÖNEMLİ: role göndermek için config.roleNames.* kullan (prefix'siz),
 * config.roles.* değil (o, ROLE_ prefix'li — sadece session/response
 * karşılaştırması için).
 *
 * Örnek: updateUserById(id, { role: config.roleNames.manager }, token)
 */
export async function updateUserById(id, payload, token) {
  return apiClient.patch(API_ROUTES.adminUsers.update(id), payload, { token });
}

/**
 * Kullanıcıyı siler (admin).
 * Backend: DELETE /admin/user/{id}
 */
export async function deleteUserById(id, token) {
  return apiClient.delete(API_ROUTES.adminUsers.delete(id), { token });
}

const adminUserService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
export default adminUserService;