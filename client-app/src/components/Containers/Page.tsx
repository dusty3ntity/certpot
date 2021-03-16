import React from "react";
import { IComponentProps } from "../../models/components";
import { combineClassNames } from "../../utils/classNames";

const Page: React.FC<IComponentProps> = ({ id, className, children }) => {
	return (
		<div className={combineClassNames("page", className)} id={id}>
			{children}
		</div>
	);
};

export default Page;
