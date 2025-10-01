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
    instance.interceptors.request.use(
      async (config) => {
        logRequest(config);

        const customConfig = config as CustomAxiosRequestConfig;
        customConfig.metadata = { startTime: Date.now() };

        // Auth logic - Get token from local storage
        if (typeof window !== "undefined") {
          const authToken = localStorage.getItem("authToken");
          if (authToken && customConfig.headers) {
            customConfig.headers.Authorization = `Bearer ${authToken}`;
          }
        }

        return customConfig;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => {
        logResponse(response);
        logRequestDuration(response.config as CustomAxiosRequestConfig);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Auth logic - Handle 401 (Unauthorized) - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Option A: Try to refresh the token
          const refreshToken =
            typeof window !== "undefined"
              ? localStorage.getItem("refreshToken")
              : null;

          if (refreshToken) {
            try {
              // Call your refresh endpoint
              const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { token } = response.data.access;

              // Store new token
              if (typeof window !== "undefined") {
                localStorage.setItem("authToken", token);
              }

              // Update the failed request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }

              // Retry the original request
              return instance(originalRequest);
            } catch (refreshError) {
              // Refresh failed - logout user
              if (typeof window !== "undefined") {
                localStorage.removeItem("authToken");
                localStorage.removeItem("refreshToken");
                // check if the user is on the signin page
                if (window.location.pathname === "/signin") {
                  return Promise.reject(refreshError);
                }
                window.location.href = "/signin";
              }
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token - logout user
            if (typeof window !== "undefined") {
              localStorage.removeItem("authToken");
              // check if the user is on the signin page
              if (window.location.pathname === "/signin") {
                return Promise.reject(error);
              }
              window.location.href = "/signin";
            }
          }
        }
        // Auth logic - End

        handleApiError(error);
        return retryFailedRequest(error);
      }
    );
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
  const { config } = error as { config: CustomAxiosRequestConfig };
  if (!config || !config.retryCount) {
    config.retryCount = 0;
  }

  if (error instanceof AxiosError) {
    if (
      [400, 401, 403, 413, 404, 408, 500].includes(error.response?.status || 0)
    ) {
      return Promise.reject(error);
    }
  }

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
  errorMessage = "API Error"
): Promise<TResponse> => {
  try {
    const response = await apiClient[method]<ApiResponse<TResponse>>(
      `${endpoint}`,
      data
    );

    return response.data.data;
  } catch (error) {
    const errorResponse = handleAxiosError(error, errorMessage);
    throw new Error(errorResponse.message);
  }
};

req.post = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  data?: RequestData<TRequestData>,
  errorMessage = "API Error"
): Promise<TResponse> => {
  return req<TResponse, TRequestData>(endpoint, "post", data, errorMessage);
};

req.put = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  data?: RequestData<TRequestData>,
  errorMessage = "API Error"
): Promise<TResponse> => {
  return req<TResponse, TRequestData>(endpoint, "put", data, errorMessage);
};

req.delete = async <TResponse>(
  endpoint: string,
  errorMessage = "API Error"
): Promise<TResponse> => {
  return req<TResponse>(endpoint, "delete", undefined, errorMessage);
};

req.patch = async <TResponse, TRequestData = undefined>(
  endpoint: string,
  data?: RequestData<TRequestData>,
  errorMessage = "API Error"
): Promise<TResponse> => {
  return req<TResponse, TRequestData>(endpoint, "patch", data, errorMessage);
};
