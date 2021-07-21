import { AxiosError } from "axios";

import { ApiError, ErrorType } from "../../../models/types/errors";
import {
	handleAuthenticationError,
	handleNetworkError,
	handleNotFoundError,
	handleServerError,
	handleValidationError,
} from "./handlers";

export const handleAPIError = (error: AxiosError) => {
	if (process.env.REACT_APP_ENV === "DEVELOPMENT") {
		console.error("API error:", error.response);
	}

	const originalRequest = error.config;
	const errorCode = error.request?.data?.errors?.code;

	handleNetworkError(error);
	handleServerError(error);
	handleAuthenticationError(error, originalRequest);
	handleValidationError(error);
	handleNotFoundError(error);

	throw new ApiError(error, errorCode ?? ErrorType.Unknown, !errorCode, false);
};
