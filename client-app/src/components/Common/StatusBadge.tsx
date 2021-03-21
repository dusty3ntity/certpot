import React from "react";

import { IComponentProps } from "../../models/components";
import { combineClassNames } from "../../utils/classNames";

interface IStatusBadgeProps extends IComponentProps {
	status: "active" | "disabled";
}

const StatusBadge: React.FC<IStatusBadgeProps> = ({ id, className, status }) => {
	return (
		<span id={id} className={combineClassNames("status-badge", className)}>
			<span className={combineClassNames("badge", status)} />
			<span className="label">{status}</span>
		</span>
	);
};

export default StatusBadge;
