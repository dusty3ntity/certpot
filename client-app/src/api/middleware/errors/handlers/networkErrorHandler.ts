import { AxiosError } from "axios";

import { NetworkError, NotificationType } from "../../../../models/types/errors";
import { createNotification } from "../../../../utils";

export const handleNetworkError = (error: AxiosError) => {
	if (error.response) {
		return;
	}

	createNotification(NotificationType.Error, {
		title: "Network error!",
		message: "The server isn't responding... Check your internet connection or contact the administrator.",
	});
	
	throw new NetworkError(error);
};
