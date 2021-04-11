import { IMonitor, INewMonitor } from "../models/types/monitors";
import axios, { AxiosResponse } from "axios";

import { SLEEP_DURATION } from "./../constants/api";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(undefined, (error) => {
	if (process.env.REACT_APP_ENV === "DEVELOPMENT") {
		console.error("API error:", error.response);
	}

	if (error.message === "Network Error" && !error.response) {
		console.log("Network error");
		throw new Error("No connection");
	} else if (error.response.status === 500) {
		console.log("Server error");
		throw new Error("Server error");
	}
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
