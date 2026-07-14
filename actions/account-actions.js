"use server";

import { getAccessToken } from "@/helpers/auth-helpers";
import { updateMe, updatePassword } from "@/services/user-service";
import {
  profileUpdateSchema,
  passwordUpdateSchema,
} from "@/helpers/schemas/account-schema";
import { ACCOUNT_MESSAGES } from "@/helpers/messages/account-messages";

/**
 * Boş string alanları payload'dan çıkarır — backend'e sadece gerçekten
 * değiştirilen alanları göndermek için (partial update).
 */
function cleanPayload(data) {
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== "" && value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function updateProfileAction(formData) {
  const result = profileUpdateSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message,
    };
  }

  try {
    const token = await getAccessToken();
    const payload = cleanPayload(result.data);
    const updatedUser = await updateMe(payload, token);
    return { success: true, data: updatedUser };
  } catch (err) {
    return {
      success: false,
      error: err.message || ACCOUNT_MESSAGES.profileSection.genericError,
    };
  }
}

export async function updatePasswordAction(formData) {
  const result = passwordUpdateSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message,
    };
  }

  try {
    const token = await getAccessToken();
    await updatePassword(result.data, token);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || ACCOUNT_MESSAGES.passwordSection.genericError,
    };
  }
}

export async function deleteAccountAction() {
  try {
    const token = await getAccessToken();
    await deleteMe(token);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.message || ACCOUNT_MESSAGES.deleteSection.genericError,
    };
  }
}