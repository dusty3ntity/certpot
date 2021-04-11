import React from "react";

import { IComponentProps } from "../../models/types/";
import { combineClassNames } from "../../utils/classNames";

export const CopyIcon: React.FC<IComponentProps> = ({ id, className, ...props }) => {
	return (
		<svg id={id} className={combineClassNames("icon copy-icon", className)} viewBox="0 0 24 24" {...props}>
			<path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
		</svg>
	);
};
