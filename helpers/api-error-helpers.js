export function extractBackendFieldErrors(error) {
  const list = error?.data?.object;

  if (!Array.isArray(list)) return null;

  const fieldErrors = {};

  list.forEach((line) => {
    if (typeof line !== "string") return;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;

    const field = line.slice(0, separatorIndex).trim();
    const message = line.slice(separatorIndex + 1).trim();

    if (field && message && !fieldErrors[field]) {
      fieldErrors[field] = message;
    }
  });

  return Object.keys(fieldErrors).length ? fieldErrors : null;
}
