import React from "react";
import { ErrorMessage } from "@hookform/error-message";

import Tooltip from "../Tooltip";
import ErrorIcon from "../Icons/ErrorIcon";

export interface IValidationMessageProps {
	inputName: string;
	errors: any;
}

export const ValidationMessage: React.FC<IValidationMessageProps> = ({ errors, inputName, ...props }) => {
	return (
		<ErrorMessage
			errors={errors}
			name={inputName}
			render={({ message }) => (
				<Tooltip className="validation-error" theme="light" text={message} position="top" {...props}>
					<ErrorIcon />
				</Tooltip>
			)}
		/>
	);
};
