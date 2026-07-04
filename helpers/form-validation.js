export { ValidationError as YupValidationError } from "yup";

export const transformFormDataToJSON = (formData) => Object.fromEntries(formData.entries());

export const response = (ok, message, errors = null) => ({
  ok,
  message,
  errors,
  responseId: crypto.randomUUID(),
});

export const transformYupErrors = (errors) => {
  const errObject = {};
  errors.forEach((error) => (errObject[error.path] = error.message));
  return response(false, "Validation Error", errObject);
};
