import axios, { AxiosResponse } from "axios";

import { SLEEP_DURATION } from "./../constants/api";
import { IMonitor, INewMonitor } from "../models/types/monitors";
import { createNotification, injectErrorCode, isBadId } from "../utils";
import { CustomError, ErrorType, NotificationType } from "../models/types/errors";
import { history } from "../config/history";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(undefined, (error) => {
	if (process.env.REACT_APP_ENV === "DEVELOPMENT") {
		console.error("API error:", error.response);
	}

	if (error.message === "Network Error" && !error.response) {
		createNotification(NotificationType.Error, {
			title: "Network error!",
			message: "The server isn't responding... Check your internet connection or contact the administrator.",
		});
		throw new CustomError(error.response, ErrorType.ConnectionRefused);
	} else if (error.response.status === 500) {
		if (!error.response.data.errors.code) {
			injectErrorCode(error.response, ErrorType.DefaultServerError);
		}
		createNotification(NotificationType.Error, {
			title: "Server error!",
			message: "A server error occurred. Please, refresh the page or contact the administrator!",
		});
		throw new CustomError(error.response, error.response.data.errors.code);
	} else if (error.response.status === 400 && !error.response.data.errors.code) {
		if (isBadId(error.response)) {
			injectErrorCode(error.response, ErrorType.BadId);
			history.push("/404");
			createNotification(NotificationType.Error, {
				title: "Wrong id!",
				message: "Please, check the id in the address bar or contact the administrator.",
				error: error.response,
			});
		} else {
			injectErrorCode(error.response, ErrorType.DefaultValidationError);
			createNotification(NotificationType.UnknownError, {
				title: "Validation error!",
				error: error.response,
			});
		}
		throw new CustomError(error.response, error.response.data.errors.code);
	} else if (error.response.status === 404) {
		if (!error.response.data.errors.code) {
			injectErrorCode(error.response, ErrorType.DefaultNotFound);
		}
		const code = error.response.data.errors.code;
		if (code === ErrorType.MonitorNotFound) {
			createNotification(NotificationType.Error, {
				title: "Not found!",
				message: "Monitor not found! Please, check the id in the address bar or contact the administrator.",
				error: error.response,
			});
		} else {
			createNotification(NotificationType.UnknownError, {
				title: "Not found!",
				error: error.response,
			});
		}
		history.push("/404");
		throw new CustomError(error.response, error.response.data.errors.code);
	}

	throw new CustomError(error.response, error.response.data.errors.code ?? ErrorType.Unknown);
});

const responseBody = (response: AxiosResponse): any => response.data;

const sleep = () => (response: AxiosResponse): Promise<AxiosResponse> => {
	return new Promise<AxiosResponse>((resolve) => {
		process.env.REACT_APP_ENV === "DEVELOPMENT"
			? setTimeout(() => resolve(response), SLEEP_DURATION)
			: resolve(response);
	});
};

const requests = {
	get: (url: string): Promise<any> => axios.get(url).then(sleep()).then(responseBody),
	post: (url: string, body?: {}): Promise<any> => axios.post(url, body).then(sleep()).then(responseBody),
	put: (url: string, body: {}): Promise<any> => axios.put(url, body).then(sleep()).then(responseBody),
	del: (url: string): Promise<any> => axios.delete(url).then(sleep()).then(responseBody),
};

export const Monitors = {
	list: (): Promise<IMonitor[]> => requests.get("/monitors/"),
	details: (id: string): Promise<IMonitor> => requests.get(`/monitors/${id}`),
	create: (data: INewMonitor): Promise<IMonitor> => requests.post("/monitors/", data),
	delete: (id: string): Promise<void> => requests.del(`/monitors/${id}`),
};
