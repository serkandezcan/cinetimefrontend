import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/helpers/messages/validation-messages";

export const loginSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_MESSAGES.email.required })
    .min(1, VALIDATION_MESSAGES.email.required)
    .email(VALIDATION_MESSAGES.email.invalid),

  password: z
    .string({ required_error: VALIDATION_MESSAGES.password.required })
    .min(1, VALIDATION_MESSAGES.password.required),
});

// Backend: RegisterRequestDTO extends BaseUserRequestDTO
// Alanlar: name, surname, email, phoneNumber, birthDate, gender, password
// confirmPassword backend'e gitmiyor, sadece frontend doğrulaması için.
export const registerSchema = z
  .object({
    name: z
      .string({ required_error: VALIDATION_MESSAGES.name.required })
      .min(3, VALIDATION_MESSAGES.name.size)
      .max(20, VALIDATION_MESSAGES.name.size),

    surname: z
      .string({ required_error: VALIDATION_MESSAGES.surname.required })
      .min(2, VALIDATION_MESSAGES.surname.size)
      .max(25, VALIDATION_MESSAGES.surname.size),

    email: z
      .string({ required_error: VALIDATION_MESSAGES.email.required })
      .min(1, VALIDATION_MESSAGES.email.required)
      .email(VALIDATION_MESSAGES.email.invalid),

    phoneNumber: z
      .string({ required_error: VALIDATION_MESSAGES.phoneNumber.required })
      .regex(/^\(\d{3}\) \d{3}-\d{4}$/, VALIDATION_MESSAGES.phoneNumber.invalid),

    birthDate: z
      .string({ required_error: VALIDATION_MESSAGES.birthDate.required })
      .min(1, VALIDATION_MESSAGES.birthDate.required)
      .refine((val) => new Date(val).getTime() < Date.now(), {
        message: VALIDATION_MESSAGES.birthDate.past,
      }),

    gender: z.enum(["MALE", "FEMALE"], {
      required_error: VALIDATION_MESSAGES.gender.required,
    }),

    password: z
      .string({ required_error: VALIDATION_MESSAGES.password.required })
      .min(1, VALIDATION_MESSAGES.password.required)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_#]{8,}$/,
        VALIDATION_MESSAGES.password.pattern
      ),

    confirmPassword: z
      .string({
        required_error: VALIDATION_MESSAGES.password.confirmRequired,
      })
      .min(1, VALIDATION_MESSAGES.password.confirmRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.password.mismatch,
    path: ["confirmPassword"],
  });

  export const forgotPasswordSchema = z.object({
    email: z
      .string({ required_error: VALIDATION_MESSAGES.email.required })
      .min(1, VALIDATION_MESSAGES.email.required)
      .email(VALIDATION_MESSAGES.email.invalid),
});

// Backend: ResetPasswordRequestDTO { resetPasswordToken, newPassword, confirmPassword }
// confirmPassword register'dan farklı olarak burada backend'e gidiyor.
export const resetPasswordSchema = z
  .object({
    resetPasswordToken: z
      .string({ required_error: VALIDATION_MESSAGES.resetToken.missing })
      .min(1, VALIDATION_MESSAGES.resetToken.missing),

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

const authSchemas = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
export default authSchemas;