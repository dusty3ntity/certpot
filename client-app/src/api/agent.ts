import axios, { AxiosResponse } from "axios";

import { SLEEP_DURATION } from "./../constants/api";
import { IMonitor, INewMonitor, ISshCredentials } from "../models/types/monitors";
import { ILoginUser, IRegisterUser, IUserPayload, IUserSettings } from "../models/types";
import { handleAPIError } from "./middleware";

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

axios.interceptors.response.use(undefined, handleAPIError);

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
};
