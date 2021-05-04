import React from "react";

import { IComponentProps } from "../../models/types/components";
import { combineClassNames } from "../../utils/";

interface IStatusBadgeProps extends IComponentProps {
	status: "active" | "disabled" | "in-progress" | "pending";
	noText?: boolean;
}

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ id, className, status, noText }) => {
	return (
		<span id={id} className={combineClassNames("status-badge", className)}>
			<span className={combineClassNames("badge", status)} />
			{!noText && <span className="label">{status}</span>}
		</span>
	);
};
