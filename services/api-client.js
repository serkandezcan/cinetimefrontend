import { config } from "../helpers/config";
import axios from "axios";

// Backend'in ResponseMessage<T> yapısına uygun hata sınıfı.
// Backend format: { object, message, httpStatus }

class ApiError extends Error {
    constructor(message, status, httpStatus, data) {
        super(message);
        this.name = "ApiError";
        this.status = status; // HTTP status code 200, 400, 500
        this.httpStatus = httpStatus; // Backend'in enum'u ("OK", "BAD_REQUEST", "INTERNAL_SERVER_ERROR")
        this.data = data; // Response Body
    }
}

const axiosInstance = axios.create({
  baseURL: config.apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});


 // Response interceptor: backend her zaman { object, message, httpStatus }
 // döndüğü için burada otomatik unwrap ediyoruz. Component/service katmanı
 // bu sarmalayı hiç görmez, direkt asıl veriyi (T) alır.
 
axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (body && Object.hasOwn(body, "object")) {
      return body.object;
    }

    return body;
  },
  (error) => {
    const body = error.response?.data;

    throw new ApiError(
      body?.message || error.message || "İstek başarısız oldu",
      error.response?.status,
      body?.httpStatus,
      body
    );
  }
);


 // Her istek için opsiyonel token geçirmeyi kolaylaştıran yardımcı.
 // Kullanım: apiClient.get(path, { token: session.accessToken })
 
function withAuth(axiosConfig = {}) {
  const { token, ...rest } = axiosConfig;

  return {
    ...rest,
    headers: {
      ...rest.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export const apiClient = {
  get: (path, options) => axiosInstance.get(path, withAuth(options)),
  post: (path, body, options) =>
    axiosInstance.post(path, body, withAuth(options)),
  put: (path, body, options) =>
    axiosInstance.put(path, body, withAuth(options)),
  patch: (path, body, options) =>
    axiosInstance.patch(path, body, withAuth(options)),
  delete: (path, options) => axiosInstance.delete(path, withAuth(options)),
};

export { ApiError };
export default apiClient;
