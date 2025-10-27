/* eslint-disable no-console */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT } from "@/lib/constants/config";
import { API_CONFIG } from "@/lib/constants/config";
import handleAxiosError from "./error";
import { setCookie, deleteCookie, storage } from "./utils/";
import { toast } from "sonner";

const BASE_URL = API_BASE_URL;
const { DEFAULT_HEADERS, MAX_RETRIES, RETRY_DELAY_BASE } = API_CONFIG;

// Axios Interceptors

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
  retryCount?: number;
  _retry?: boolean;
}

class ApiClient {
  private static instance: AxiosInstance;

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: DEFAULT_HEADERS,
        timeout: REQUEST_TIMEOUT,
      });

      this.setupInterceptors(axiosInstance);
      this.instance = axiosInstance;
    }

    return this.instance;
  }

  private static setupInterceptors(instance: AxiosInstance): void {
    // 🔹 Request interceptor
    instance.interceptors.request.use(
      async (config) => {
        logRequest(config);

        const customConfig = config as CustomAxiosRequestConfig;
        customConfig.metadata = { startTime: Date.now() };

        const authToken = storage.get<string>("authToken");
        if (authToken && customConfig.headers) {
          customConfig.headers.Authorization = `Bearer ${authToken}`;
        }

        return customConfig;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // 🔹 Response interceptor
    instance.interceptors.response.use(
      (response) => {
        logResponse(response);
        logRequestDuration(response.config as CustomAxiosRequestConfig);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Handle 401 - expired or invalid token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.handleTokenRefresh();
            if (newToken) {
              // update header and retry
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return instance(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        handleApiError(error);
        return retryFailedRequest(error);
      }
    );
  }

  // 🔸 Extracted helper: handle token refresh and logout logic
  private static async handleTokenRefresh(): Promise<string | null> {
    const refreshToken = storage.get<string>("refreshToken");

    if (!refreshToken) {
      this.logoutUser();
      return null;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data.access;

      storage.set("authToken", token);
      setCookie("authToken", token, 7);

      return token;
    } catch {
      this.logoutUser();
      return null;
    }
  }

  // 🔸 Extracted helper: logout and redirect to /signin
  private static logoutUser(): void {
    storage.remove("authToken");
    storage.remove("refreshToken");
    deleteCookie("authToken");

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/signin"
    ) {
      window.location.href = "/signin";
    }
  }
}

function logRequest(config: AxiosRequestConfig): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
}

function logResponse(response: AxiosResponse): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`Response: ${response.status} ${response.config.url}`);
  }
}

function logRequestDuration(config: CustomAxiosRequestConfig): void {
  if (process.env.NODE_ENV === "development" && config.metadata?.startTime) {
    const duration = Date.now() - config.metadata.startTime;
    console.log(`Request duration: ${duration}ms`);
  }
}

function handleApiError(error: AxiosError): void {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.warn("Unauthorized access.");
        break;
      case 404:
        console.log("Resource not found");
        break;
      case 500:
        console.log("Server error");
        break;
      default:
        console.log("API Error:", error.response.data);
    }
  }
}

function retryFailedRequest(error: unknown): Promise<unknown> {
  const axiosError = error as AxiosError;
  const config = axiosError.config as CustomAxiosRequestConfig;

  // Guard
  if (!config) return Promise.reject(error);

  config.retryCount = config.retryCount ?? 0;

  const status = axiosError.response?.status;

  // 🚫 Don't retry these — all client errors (4xx) are final
  if (status && status >= 400 && status < 500) {
    return Promise.reject(error);
  }

  // ✅ Only retry transient network errors or 5xx
  const shouldRetry =
    !status || // no response (network issue, timeout)
    (status >= 500 && status < 600);

  if (!shouldRetry) {
    return Promise.reject(error);
  }

  // 🔁 Retry with exponential backoff
  if (config.retryCount < MAX_RETRIES) {
    config.retryCount++;
    const delay = RETRY_DELAY_BASE * Math.pow(2, config.retryCount - 1);
    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      ApiClient.getInstance()(config)
    );
  }

  return Promise.reject(error);
}

export function getApiClient(): AxiosInstance {
  return ApiClient.getInstance();
}

const apiClient = getApiClient();

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Main API Client

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

type RequestData<T> = T extends undefined ? undefined : T;

export const req = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  method: HttpMethod = "get",
  data?: RequestData<TRequestData>,
  errorMessage?: string
): Promise<TResponse> => {
  try {
    const response = await apiClient[method]<ApiResponse<TResponse>>(
      `${endpoint}`,
      data
    );

    return response.data.data;
  } catch (error) {
    const errorResponse = handleAxiosError(error, errorMessage);
    toast.error(`Error: ${errorMessage || errorResponse.message}`);
    throw new Error(errorResponse.message);
  }
};

req.post = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  data?: RequestData<TRequestData>,
  errorMessage?: string
): Promise<TResponse> => {
  return req<TResponse, TRequestData>(endpoint, "post", data, errorMessage);
};

req.put = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  data?: RequestData<TRequestData>,
  errorMessage?: string
): Promise<TResponse> => {
  return req<TResponse, TRequestData>(endpoint, "put", data, errorMessage);
};

req.delete = async <TResponse>(
  endpoint: string,
  errorMessage?: string
): Promise<TResponse> => {
  return req<TResponse>(endpoint, "delete", undefined, errorMessage);
};

req.patch = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  data?: RequestData<TRequestData>,
  errorMessage?: string
): Promise<TResponse> => {
  return req<TResponse, TRequestData>(endpoint, "patch", data, errorMessage);
};
