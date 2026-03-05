/* eslint-disable no-console */
/**
 * Axios error handling utility
 * Provides consistent error handling across API calls, with structured error messages and logging.
 */

import axios, { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Enum for common HTTP error status codes
 */
enum ErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  TIMEOUT = "TIMEOUT",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Interface for structured error response
 */
interface APIErrorResponse {
  message?: string;
}

/**
 * Interface for handled errors
 */
interface HandledError {
  code: ErrorCode;
  message: string;
}

/**
 * Maps HTTP status codes to human-readable error messages
 */
const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]:
    "Network error: Unable to reach the server. Please check your connection.",
  [ErrorCode.BAD_REQUEST]:
    "Bad request: The request could not be understood or was missing required parameters.",
  [ErrorCode.UNAUTHORIZED]: "Unauthorized: Please log in to continue.",
  [ErrorCode.FORBIDDEN]:
    "Forbidden: You do not have permission to access this resource.",
  [ErrorCode.NOT_FOUND]:
    "Not found: The requested resource could not be found.",
  [ErrorCode.SERVER_ERROR]:
    "Server error: Something went wrong on our end. Please try again later.",
  [ErrorCode.TIMEOUT]: "Request timeout: The server took too long to respond.",
  [ErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again.",
};

/**
 * Handles Axios errors and provides structured error messages.
 * @param error - The error object from Axios or other sources.
 * @param defaultMessage - Default message to use if error is not identifiable.
 * @returns {HandledError} - An object containing the error code and message.
 */
const handleAxiosError = (
  error: unknown,
  defaultMessage = "An error occurred",
): HandledError => {
  let handledError: HandledError = {
    code: ErrorCode.UNKNOWN_ERROR,
    message: defaultMessage,
  };

  // Check if the error is an Axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<APIErrorResponse>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const responseMessage = axiosError.response.data?.message;

      switch (status) {
        case 400:
          handledError = {
            code: ErrorCode.BAD_REQUEST,
            message: responseMessage || errorMessages[ErrorCode.BAD_REQUEST],
          };
          break;
        case 401:
          handledError = {
            code: ErrorCode.UNAUTHORIZED,
            message: responseMessage || errorMessages[ErrorCode.UNAUTHORIZED],
          };
          break;
        case 403:
          handledError = {
            code: ErrorCode.FORBIDDEN,
            message: responseMessage || errorMessages[ErrorCode.FORBIDDEN],
          };
          break;
        case 404:
          handledError = {
            code: ErrorCode.NOT_FOUND,
            message: responseMessage || errorMessages[ErrorCode.NOT_FOUND],
          };
          break;
        case 408:
          handledError = {
            code: ErrorCode.TIMEOUT,
            message: responseMessage || errorMessages[ErrorCode.TIMEOUT],
          };
          break;
        case 500:
          handledError = {
            code: ErrorCode.SERVER_ERROR,
            message: responseMessage || errorMessages[ErrorCode.SERVER_ERROR],
          };
          break;
        default:
          handledError = {
            code: ErrorCode.UNKNOWN_ERROR,
            message: responseMessage || errorMessages[ErrorCode.UNKNOWN_ERROR],
          };
      }
    } else if (axiosError.request) {
      // Handle network errors
      handledError = {
        code: ErrorCode.NETWORK_ERROR,
        message: errorMessages[ErrorCode.NETWORK_ERROR],
      };
    } else if (axiosError.message) {
      handledError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: axiosError.message,
      };
    }
  } else if (error instanceof Error) {
    handledError = { code: ErrorCode.UNKNOWN_ERROR, message: error.message };
  }

  // Log error (development only)
  if (process.env.NODE_ENV === "development") {
    console.log("API Error:", handledError);
  }

  return handledError;
};

export default handleAxiosError;
