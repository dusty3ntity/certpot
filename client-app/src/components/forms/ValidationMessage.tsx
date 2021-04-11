import React from "react";
import { ErrorMessage } from "@hookform/error-message";

import { ErrorIcon } from "../icons";
import { Tooltip } from "../tooltip";

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
