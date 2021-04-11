import React from "react";

import { IComponentProps } from "../../models/types/";
import { combineClassNames } from "../../utils";

export const WarningIcon: React.FC<IComponentProps> = ({ id, className, ...props }) => {
	return (
		<svg id={id} className={combineClassNames("icon warning-icon", className)} viewBox="0 0 24 24" {...props}>
			<path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
		</svg>
	);
};
