import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/helpers/messages/validation-messages";

export const loginSchema = z.object({
  email: z
    .string({ required_error: VALIDATION_MESSAGES.email.required })
    .min(1, VALIDATION_MESSAGES.email.required)
    .email(VALIDATION_MESSAGES.email.invalid),

  password: z
    .string({ required_error: VALIDATION_MESSAGES.password.required })
    .min(1, VALIDATION_MESSAGES.password.required)
    .min(8, VALIDATION_MESSAGES.password.minLength),
});

export default loginSchema;