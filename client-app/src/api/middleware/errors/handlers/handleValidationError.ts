import { AxiosError } from "axios";

import { ErrorType, NotificationType, CustomError } from "../../../../models/types/errors";
import { isBadId, injectErrorCode, createNotification } from "../../../../utils";
import { history } from "../../../../config";

export const handleValidationError = (error: AxiosError) => {
	const response = error.response!;

	if (response.status === 400 && (!response.data?.errors?.code || response.data.errors.code === ErrorType.BadId)) {
		if (isBadId(error.response)) {
			injectErrorCode(error.response, ErrorType.BadId);
			history.push("/not-found");
			createNotification(NotificationType.Error, {
				title: "Wrong id format!",
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
		throw new CustomError(error.response, response.data.errors.code);
	}
};
