import { AxiosRequestConfig } from "axios";

export type AxiosRequest = AxiosRequestConfig & {
	_retry?: boolean;
}