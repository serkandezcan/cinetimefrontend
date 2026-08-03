"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema } from "@/helpers/schemas/auth-schema";
import { response, transformFormDataToJSON, transformYupErrors, YupValidationError } from "@/helpers/form-validation";
import { AuthError } from "next-auth";

export const loginAction = async (prevState, formData) => {
  
  const fields = transformFormDataToJSON(formData);

  try {
    LoginSchema.validateSync(fields, { abortEarly: false });
    await signIn("credentials", fields);
  } catch (error) {
    if (error instanceof YupValidationError) return transformYupErrors(error.inner);
    if (error instanceof AuthError) return response(false, "Invalid email or password");
    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({ redirectTo: "/" });
};
