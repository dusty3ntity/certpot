import React from "react";

import { IComponentProps } from "../../models/types/";
import { combineClassNames } from "../../utils";

/**
 * Icon name: error_outline-black-24dp
 */
export const ErrorIcon: React.FC<IComponentProps> = ({ id, className, ...props }) => {
	return (
		<svg id={id} className={combineClassNames("icon error-icon", className)} viewBox="0 0 24 24" {...props}>
			<path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
		</svg>
	);
};
