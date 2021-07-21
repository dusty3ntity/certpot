import jwt from "jsonwebtoken";

import { createNotification } from "./notifications";
import { ApiError, ErrorType, NotificationType } from "../models/types/errors";
import { getErrorDate } from "./dates";

export const isBadId = (error: any) => {
	const errorBody = error.data.errors;
	console.log(error)

	return errorBody.hasOwnProperty("monitorId") || errorBody.code === ErrorType.BadId;
};

export const createErrorToCopy = (error: any) => {
	const status = error.status;
	const errorCode = error.data?.errors.code;
	const errorBody = error.data?.errors.body;

	const url = error.config.baseURL + error.config.url;
	const method = error.config.method;
	const authorizationToken = error.config.headers.Authorization?.slice(-6);

	const moment = getErrorDate();

	const token = window.localStorage.getItem("jwt");
	let username;

	if (token) {
		username = jwt.decode(token, { json: true, complete: true })?.payload?.nameid;
	}

	const customError = {
		status: status,
		code: errorCode,
		body: errorBody,
		url: url,
		method: method,
		token: authorizationToken,
		username: username,
		moment: moment,
	};

	return customError;
};

export const createUnknownErrorNotification = (error: ApiError, origin: string) => {
	if (!error.wasHandled) {
		createNotification(NotificationType.UnknownError, {
			error: error.getResponse(),
			errorOrigin: origin,
		});
	}
};
