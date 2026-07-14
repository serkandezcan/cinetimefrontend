"use server";

import { getAccessToken } from "@/helpers/auth-helpers";
import {
  getAllUsers,
  updateUserById,
  deleteUserById,
} from "@/services/admin-user-service";
import { ADMIN_USERS_MESSAGES } from "@/helpers/messages/admin-users-messages";

export async function fetchUsersAction({ page = 1, size = 10 } = {}) {
  try {
    const token = await getAccessToken();
    const data = await getAllUsers({ page, size }, token);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateUserAction(id, payload) {
  try {
    const token = await getAccessToken();
    const updated = await updateUserById(id, payload, token);
    return { success: true, data: updated };
  } catch (err) {
    return {
      success: false,
      error: err.message || ADMIN_USERS_MESSAGES.editModal.genericError,
    };
  }
}

export async function deleteUserAction(id) {
  try {
    const token = await getAccessToken();
    await deleteUserById(id, token);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || ADMIN_USERS_MESSAGES.deleteModal.genericError,
    };
  }
}