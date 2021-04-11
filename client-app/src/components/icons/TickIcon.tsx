import React from "react";

import { IComponentProps } from "../../models/types/";
import { combineClassNames } from "../../utils";

/**
 * Icon name: done-24px
 */
export const TickIcon: React.FC<IComponentProps> = ({ id, className, ...props }) => {
	return (
		<svg id={id} className={combineClassNames("icon tick-icon", className)} viewBox="0 0 24 24" {...props}>
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
		</svg>
	);
};
