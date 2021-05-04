import React from "react";

import { IComponentProps } from "../../models/types/components";
import { combineClassNames } from "../../utils/classNames";
import { LoadingIndicator } from "./LoadingIndicator";

export interface ILoadingScreenProps extends IComponentProps {
	size: number;
}

export const LoadingScreen: React.FC<ILoadingScreenProps> = ({ id, className, size, ...props }) => {
	return (
		<div id={id} className={combineClassNames("loading-screen", className)} {...props}>
			<LoadingIndicator type="big" size={size} />

			<span className="title" style={{ fontSize: `${size / 1.5}rem` }}>
				Loading...
			</span>
		</div>
	);
};
