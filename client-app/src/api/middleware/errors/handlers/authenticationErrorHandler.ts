import axios, { AxiosError } from "axios";

import { ErrorType, NotificationType } from "../../../../models/types/errors";
import { createNotification } from "../../../../utils";
import { history } from "../../../../config";
import { AxiosRequest } from "../../../types";

export const handleAuthenticationError = (error: AxiosError, request: AxiosRequest) => {
	if (error.response.status === 401 && error.response.data?.errors?.code === ErrorType.RefreshTokenExpired) {
		window.localStorage.removeItem("jwt");
		window.localStorage.removeItem("refreshToken");
		history.push("/login");

		createNotification(NotificationType.Error, {
			title: "Authentication error!",
			message: "Your session has expired! Please, log in again.",
			error: error.response,
		});
	} else if (error.response.status === 401 && error.response.data?.errors?.code === ErrorType.InvalidEmail) {
		createNotification(NotificationType.Error, {
			title: "Authentication error!",
			message: "Could not find a user with this email. Check your credentials and try again.",
		});
	} else if (error.response.status === 401 && error.response.data?.errors?.code === ErrorType.InvalidPassword) {
		createNotification(NotificationType.Error, {
			title: "Authentication error!",
			message: "The password is incorrect. Check your credentials and try again.",
		});
	} else if (
		error.response.status === 401 &&
		error.response.headers["www-authenticate"].includes('Bearer error="invalid_token"') &&
		!request._retry
	) {
		request._retry = true;

		return axios
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
	} else if (error.response.status === 401) {
		createNotification(NotificationType.Error, {
			title: "Authentication error!",
			message: "An authentication error occurred. Please, refresh the page or contact the administrator.",
		});
	}
};
