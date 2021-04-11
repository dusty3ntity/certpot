import React, { ReactElement } from "react";
import { Tooltip as Tippy } from "react-tippy";

import { IComponentProps } from "../../models/types/components";
import { combineClassNames } from "../../utils/";

export interface ITooltipProps extends IComponentProps {
	text?: string;
	content?: ReactElement;
	position:
		| "top"
		| "top-start"
		| "top-end"
		| "bottom"
		| "bottom-start"
		| "bottom-end"
		| "left"
		| "left-start"
		| "left-end"
		| "right"
		| "right-start"
		| "right-end";
	interactive?: boolean;
	theme?: "dark" | "light";
	open?: boolean;
	distance?: number;
}

export const Tooltip: React.FC<ITooltipProps> = ({
	id,
	className,
	text,
	content,
	position,
	children,
	interactive,
	theme = "dark",
	open,
	distance = 11,
	...props
}) => {
	if (text) {
		content = <div style={{ minWidth: 60, maxWidth: 300, overflowWrap: "break-word" }}>{text}</div>;
	}

	return (
		<Tippy
			html={content}
			animation="fade"
			open={open}
			arrow
			distance={distance}
			interactive={interactive}
			position={position}
			delay={500}
			className={combineClassNames("tooltip-container", className)}
			theme={theme}
			{...props}
		>
			{children}
		</Tippy>
	);
};
