import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/helpers/messages/validation-messages";

// Backend: UserUpdateWithoutPasswordRequestDTO — tüm alanlar opsiyonel,
// ama gönderilirse format kontrolü var.
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(3, VALIDATION_MESSAGES.name.size)
    .max(20, VALIDATION_MESSAGES.name.size)
    .optional()
    .or(z.literal("")),
  surname: z
    .string()
    .min(2, VALIDATION_MESSAGES.surname.size)
    .max(25, VALIDATION_MESSAGES.surname.size)
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.email.invalid)
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, VALIDATION_MESSAGES.phoneNumber.invalid)
    .optional()
    .or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).optional().or(z.literal("")),
});

// Backend: UserUpdatePasswordRequestDTO
export const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string({ required_error: VALIDATION_MESSAGES.currentPassword.required })
      .min(1, VALIDATION_MESSAGES.currentPassword.required),
    newPassword: z
      .string({ required_error: VALIDATION_MESSAGES.newPassword.required })
      .min(1, VALIDATION_MESSAGES.newPassword.required)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_#]{8,}$/,
        VALIDATION_MESSAGES.newPassword.pattern
      ),
    confirmPassword: z
      .string({
        required_error: VALIDATION_MESSAGES.password.confirmRequired,
      })
      .min(1, VALIDATION_MESSAGES.password.confirmRequired),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.password.mismatch,
    path: ["confirmPassword"],
  });

const accountSchemas = { profileUpdateSchema, passwordUpdateSchema };

export default accountSchemas;