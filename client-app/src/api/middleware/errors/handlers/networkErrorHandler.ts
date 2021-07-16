import { AxiosError } from "axios";

import { CustomError, ErrorType, NotificationType } from "../../../../models/types/errors";
import { createNotification } from "../../../../utils";

export const handleNetworkError = (error: AxiosError) => {
	if (!error.response) {
		createNotification(NotificationType.Error, {
			title: "Network error!",
			message: "The server isn't responding... Check your internet connection or contact the administrator.",
		});
		throw new CustomError(error.response, ErrorType.ConnectionRefused);
	}
};
