import axios, { AxiosError } from "axios";

import { AuthenticationError, ErrorType, NotificationType } from "../../../../models/types/errors";
import { createNotification } from "../../../../utils";
import { history } from "../../../../config";
import { AxiosRequest } from "../../../types";

export const handleAuthenticationError = (error: AxiosError, request: AxiosRequest) => {
	const response = error.response!;
	const errorCode = response.data?.errors?.code;

	if (response.status !== 401) {
		return;
	}

	if (response.headers["www-authenticate"].includes('Bearer error="invalid_token"') && !request._retry) {
		request._retry = true;

		axios
			.post("/user/refresh", {
				token: window.localStorage.getItem("jwt"),
				refreshToken: window.localStorage.getItem("refreshToken"),
			})
			.then((res) => {
				window.localStorage.setItem("jwt", res.data.token);
				window.localStorage.setItem("refreshToken", res.data.refreshToken);
				axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
				return axios(request);
			});

		throw new AuthenticationError(error, true, ErrorType.TokenExpired);
	}

	if (errorCode === ErrorType.RefreshTokenExpired) {
		window.localStorage.removeItem("jwt");
		window.localStorage.removeItem("refreshToken");
		history.push("/login");

		createNotification(NotificationType.Error, {
			title: "Authentication error!",
			message: "Your session has expired! Please, log in again.",
			error: response,
		});
		
		throw new AuthenticationError(error, true, errorCode);
	} else if (!errorCode) {
		createNotification(NotificationType.Error, {
			title: "Authentication error!",
			message: "An authentication error occurred. Please, refresh the page or contact the administrator.",
			error: response,
		});

		throw new AuthenticationError(error, true);
	}

	throw new AuthenticationError(error, false, errorCode);
};
