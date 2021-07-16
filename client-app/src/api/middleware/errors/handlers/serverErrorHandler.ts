import { AxiosError } from "axios";

import { CustomError, ErrorType, NotificationType } from "../../../../models/types/errors";
import { createNotification, injectErrorCode } from "../../../../utils";

export const handleServerError = (error: AxiosError) => {
	const response = error.response!;

	if (response.status === 500) {
		if (!response.data.errors.code) {
			injectErrorCode(error.response, ErrorType.DefaultServerError);
		}
		createNotification(NotificationType.Error, {
			title: "Server error!",
			message: "A server error occurred. Please, refresh the page or contact the administrator!",
		});
		throw new CustomError(error.response, response.data.errors.code);
	}
};
