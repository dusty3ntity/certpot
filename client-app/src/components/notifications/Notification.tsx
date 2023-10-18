import React from "react";
import copy from "copy-to-clipboard";

import { NotificationType } from "../../models/types/errors";
import { createErrorToCopy } from "../../utils/";
import { IComponentProps } from "../../models/types/components";
import { combineClassNames } from "../../utils";
import { Button, CopyIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../../components";

export interface INotificationProps extends IComponentProps {
	type: NotificationType;
	title?: string;
	message?: string;
	error?: any;
	errorOrigin?: string;
}

export const Notification: React.FC<INotificationProps> = ({
	id,
	className,
	type,
	title,
	message,
	error,
	errorOrigin,
}) => {
	if (!title) {
		switch (type) {
			case NotificationType.Info:
				title = "Information";
				break;
			case NotificationType.Success:
				title = "Success!";
				break;
			case NotificationType.Warning:
				title = "Warning!";
				break;
			case NotificationType.Error:
				title = "Error!";
				break;
			case NotificationType.UnknownError:
				title = "Unknown error!";
				break;
		}
	}

	if (type === NotificationType.UnknownError) {
		message = "An unknown error occurred... Please, refresh the page or contact the administrator.";
	}

	if (error) {
		error = createErrorToCopy(error);
	}

	if (!error && errorOrigin) {
		error = errorOrigin;
	}

	return (
		<div id={id} className={combineClassNames("notification", type, className)}>
			<div className="icon-container">
				{type === NotificationType.Info && <InfoIcon />}
				{type === NotificationType.Success && <SuccessIcon />}
				{type === NotificationType.Warning && <WarningIcon />}
				{(type === NotificationType.Error || type === NotificationType.UnknownError) && <ErrorIcon />}
			</div>

			<div className="content-container">
				<div className="title-container">
					<span className="title">{title}</span>
					{(error || errorOrigin) && (
						<Button
							className="copy-err-btn"
							onClick={() => copy(JSON.stringify(error, null, "\t"))}
							icon={<CopyIcon />}
						/>
					)}
				</div>
				<div className="message">{message}</div>
			</div>
		</div>
	);
};
