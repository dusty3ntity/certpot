import { AxiosError } from "axios";

import { NotificationType, ServerError } from "../../../../models/types/errors";
import { createNotification } from "../../../../utils";

export const handleServerError = (error: AxiosError) => {
	const response = error.response!;
	const errorCode = response?.data?.errors?.code;

	if (response.status !== 500) {
		return;
	}

	createNotification(NotificationType.Error, {
		title: "Server error!",
		message: "A server error occurred. Please, refresh the page or contact the administrator!",
	});

	throw new ServerError(error, errorCode);
};
