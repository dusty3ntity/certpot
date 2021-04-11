import React from "react";
import { IComponentProps } from "../../models/types/components";
import { combineClassNames } from "../../utils/classNames";

export const Page: React.FC<IComponentProps> = ({ id, className, children }) => (
	<div className={combineClassNames("page", className)} id={id}>
		{children}
	</div>
);
