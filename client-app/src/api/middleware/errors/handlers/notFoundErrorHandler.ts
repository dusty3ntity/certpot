import { AxiosError } from "axios";

import { ErrorType, NotFoundError, NotificationType } from "../../../../models/types/errors";
import { createNotification } from "../../../../utils";
import { history } from "../../../../config";

export const handleNotFoundError = (error: AxiosError) => {
	const response = error.response!;
	const errorCode = response.data?.errors?.code;

	if (response.status !== 404) {
		return;
	}

	if (errorCode === ErrorType.UserNotFound) {
		createNotification(NotificationType.Error, {
			title: "Not found!",
			message: "User not found! Please, refresh the page or contact the administrator.",
			error: response,
		});
	} else if (errorCode === ErrorType.MonitorNotFound) {
		createNotification(NotificationType.Error, {
			title: "Not found!",
			message: "Monitor not found! Please, check the id in the address bar or contact the administrator.",
			error: response,
		});
	} else {
		createNotification(NotificationType.UnknownError, {
			title: "Not found!",
			error: response,
		});
	}
	history.push("/not-found");

	throw new NotFoundError(error, true, errorCode);
};
