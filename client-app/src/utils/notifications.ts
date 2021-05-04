import React from "react";
import { toast } from "react-toastify";

import { IComponentProps } from "../models/types";
import { NotificationType } from "../models/types/errors";
import { Notification } from "../components";

export interface INotificationOptionsProps extends IComponentProps {
	title?: string;
	message?: string;
	error?: any;
	errorOrigin?: string;
}

export const createNotification = (type: NotificationType, options?: INotificationOptionsProps) => {
	toast(
		React.createElement(Notification, {
			type: type,
			...options,
		})
	);
};
