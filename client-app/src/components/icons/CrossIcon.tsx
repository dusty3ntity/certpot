import React from "react";

import { IComponentProps } from "../../models/types/";
import { combineClassNames } from "../../utils/classNames";

/**
 * Icon name: clear-24px
 */
export const CrossIcon: React.FC<IComponentProps> = ({ id, className, ...props }) => {
	return (
		<svg id={id} className={combineClassNames("icon cross-icon", className)} viewBox="0 0 24 24" {...props}>
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
		</svg>
	);
};
