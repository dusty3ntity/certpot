import { AxiosError } from "axios";

import { ErrorType, NotificationType, CustomError } from "../../../../models/types/errors";
import { injectErrorCode, createNotification } from "../../../../utils";
import { history } from "../../../../config";

export const handleNotFoundError = (error: AxiosError) => {
	const response = error.response!;

	if (response.status === 404) {
		if (!response.data.errors.code) {
			injectErrorCode(error.response, ErrorType.DefaultNotFound);
		}
		const code = response.data.errors.code;
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
		throw new CustomError(error.response, response.data.errors.code);
	}
};
