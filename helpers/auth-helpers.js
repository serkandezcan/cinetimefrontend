import { auth } from "@/auth";
import { config } from "./config";

const parseJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getIsTokenValid = (token) => {
  if (!token) return false;
  const payload = parseJWT(token);
  if (!payload?.exp) return false;
  return payload.exp >= Math.floor(Date.now() / 1000);
};

export const getIsUserAuthorized = (role, path) => {
  const userRight = config.userRightsOnRoutes.find((item) => item.urlRegex.test(path));
  if (!userRight) return true;
  return userRight.roles.includes(role);
};

export const getAuthHeader = async () => {
  const session = await auth();
  const token = session?.accessToken;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
