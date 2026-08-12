import { API_ROUTES } from "@/helpers/api-routes";
import { apiClient } from "@/services/api-client";

/**
 * Kullanıcı bir koltuğa tıkladığında çağrılır.
 * İlk koltukta lockToken göndermeyin (payload'da hiç olmasın ya da undefined) —
 * backend bunu "yeni token üret" olarak yorumlar.
 * Sonraki koltuklarda önceki cevaptan gelen lockToken'ı geçin.
 *
 * @param {{showtimeId: number, seatId: number, lockToken?: string}} payload
 * @param {string} token - kullanıcının access token'ı
 * @returns {Promise<{lockToken: string, seatId: number, expiresAt: string}>}
 */
export async function lockSeat(payload, token) {
    return apiClient.post(API_ROUTES.seats.lock, payload, { token });
}

/**
 * Kullanıcı bir koltuğu kaldırdığında (deselect) çağrılır.
 *
 * @param {{showtimeId: number, seatId: number, lockToken: string}} payload
 * @param {string} token
 */
export async function unlockSeat(payload, token) {
    return apiClient.post(API_ROUTES.seats.unlock, payload, { token });
}

const seatLockService = {
    lockSeat,
    unlockSeat,
};

export default seatLockService;