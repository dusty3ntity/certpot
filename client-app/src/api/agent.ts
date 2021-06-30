import axios, { AxiosResponse } from "axios";

import { SLEEP_DURATION } from "./../constants/api";
import { IMonitor, INewMonitor, ISshCredentials } from "../models/types/monitors";
import { createNotification, injectErrorCode, isBadId } from "../utils";
import { CustomError, ErrorType, NotificationType } from "../models/types/errors";
import {
	IEditUserSecret,
	ILoginUser,
	INewUserSecret,
	IRegisterUser,
	IUserPayload,
	IUserSecret,
	IUserSettings,
} from "../models/types";
import { history } from "../config/history";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
	(config) => {
		const token = window.localStorage.getItem("jwt");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(undefined, (error) => {
	if (process.env.REACT_APP_ENV === "DEVELOPMENT") {
		console.error("API error:", error.response);
	}

	const originalRequest = error.config;

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
	} else if (error.response.status === 401 && error.response.data?.errors?.code === ErrorType.RefreshTokenExpired) {
		window.localStorage.removeItem("jwt");
		window.localStorage.removeItem("refreshToken");
		history.push("/login");

		createNotification(NotificationType.Error, {
			title: "Authorization error!",
			message: "Your session has expired! Please, log in again.",
			error: error.response,
		});
	} else if (error.response.status === 401 && error.response.data?.errors?.code === ErrorType.InvalidEmail) {
		createNotification(NotificationType.Error, {
			title: "Authorization error!",
			message: "Could not find a user with this email. Check your credentials and try again.",
		});
	} else if (error.response.status === 401 && error.response.data?.errors?.code === ErrorType.InvalidPassword) {
		createNotification(NotificationType.Error, {
			title: "Authorization error!",
			message: "The password is incorrect. Check your credentials and try again.",
		});
	} else if (
		error.response.status === 401 &&
		error.response.headers["www-authenticate"].includes('Bearer error="invalid_token"') &&
		!originalRequest._retry
	) {
		originalRequest._retry = true;

		return axios
			.post("/user/refresh", {
				token: window.localStorage.getItem("jwt"),
				refreshToken: window.localStorage.getItem("refreshToken"),
			})
			.then((res) => {
				window.localStorage.setItem("jwt", res.data.token);
				window.localStorage.setItem("refreshToken", res.data.refreshToken);
				axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
				return axios(originalRequest);
			});
	} else if (error.response.status === 401) {
		createNotification(NotificationType.Error, {
			title: "Authorization error!",
			message: "An authorization error occurred. Please, refresh the page or contact the administrator.",
		});
	} else if (
		error.response.status === 400 &&
		(!error.response.data?.errors?.code || error.response.data.errors.code === ErrorType.BadId)
	) {
		if (isBadId(error.response)) {
			injectErrorCode(error.response, ErrorType.BadId);
			history.push("/not-found");
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
		history.push("/not-found");
		throw new CustomError(error.response, error.response.data.errors.code);
	}

	throw new CustomError(error.response, error.response.data.errors.code ?? ErrorType.Unknown);
});

const responseBody = (response: AxiosResponse): any => response.data;

const sleep =
	() =>
	(response: AxiosResponse): Promise<AxiosResponse> => {
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
	getSshCredentials: (id: string): Promise<ISshCredentials> => requests.get(`/monitors/${id}/ssh-credentials`),
	setSshCredentials: (id: string, data: ISshCredentials): Promise<void> =>
		requests.post(`/monitors/${id}/ssh-credentials`, data),
	testSshConnection: (id: string, data: ISshCredentials): Promise<boolean> =>
		requests.post(`/monitors/${id}/test-connection`, data),
	getRenewalScript: (id: string): Promise<string> => requests.get(`/monitors/${id}/renewal-script`),
	setRenewalScript: (id: string, script: string): Promise<void> =>
		requests.post(`/monitors/${id}/renewal-script`, { renewalScript: script }),
	getLastRenewalLogs: (id: string): Promise<string> => requests.get(`/monitors/${id}/renewal-logs`),
	switchAutoRenewal: (id: string): Promise<void> => requests.post(`/monitors/${id}/autorenewal`),
	forceRenewal: (id: string): Promise<void> => requests.post(`/monitors/${id}/renew`),
};

export const Users = {
	current: (): Promise<IUserPayload> => requests.get("/user"),
	login: (user: ILoginUser): Promise<IUserPayload> => requests.post("/user/login", user),
	register: (user: IRegisterUser): Promise<IUserPayload> => requests.post("/user/register", user),
	updateSettings: (settings: IUserSettings): Promise<void> => requests.post("/user/settings", settings),
	secretsList: (): Promise<IUserSecret[]> => requests.get("/user/secrets"),
	createSecret: (secret: INewUserSecret): Promise<IUserSecret> => requests.post("/user/secrets"),
	editSecret: (id: string, secret: IEditUserSecret): Promise<void> => requests.put(`/user/secrets/${id}`, secret),
	deleteSecret: (id: string): Promise<void> => requests.del(`/user/secrets/${id}`),
};
