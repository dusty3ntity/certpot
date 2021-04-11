import React from "react";

import { IComponentProps } from "../../models/types/components";
import { combineClassNames } from "../../utils/";

interface IStatusBadgeProps extends IComponentProps {
	status: "active" | "disabled";
}

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ id, className, status }) => {
	return (
		<span id={id} className={combineClassNames("status-badge", className)}>
			<span className={combineClassNames("badge", status)} />
			<span className="label">{status}</span>
		</span>
	);
};
