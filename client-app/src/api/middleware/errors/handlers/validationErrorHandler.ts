import { AxiosError } from "axios";

import { ErrorType, NotificationType, ValidationError } from "../../../../models/types/errors";
import { isBadId, createNotification } from "../../../../utils";
import { history } from "../../../../config";

export const handleValidationError = (error: AxiosError) => {
	const response = error.response!;
	const errorCode = response.data?.errors?.code;

	if (response.status !== 400) {
		return;
	}

	if (isBadId(response)) {
		history.push("/not-found");
		createNotification(NotificationType.Error, {
			title: "Wrong id format!",
			message: "Please, check the id in the address bar or contact the administrator.",
			error: response,
		});

		throw new ValidationError(error, ErrorType.BadId);
	} else {
		createNotification(NotificationType.UnknownError, {
			title: "Validation error!",
			error: response,
		});
	}

	throw new ValidationError(error, errorCode);
};
