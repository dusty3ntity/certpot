import React, { ReactNode } from "react";

import { IComponentProps } from "../../../models/components";
import { combineClassNames } from "../../../utils/classNames";
import LoadingIndicator from "../Loading/LoadingIndicator";

export interface IButtonProps extends IComponentProps {
	type?: "button" | "submit" | "reset";
	primary?: boolean;
	icon?: ReactNode;
	text?: string;
	textClassName?: string;

	active?: boolean;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;

	rightIcon?: ReactNode;
}

const Button: React.FC<IButtonProps> = ({
	id,
	className,

	type = "button",
	primary,
	icon,
	text,
	textClassName,

	active,
	loading,
	disabled,
	onClick,

	rightIcon,

	children,
	...props
}) => {
	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();

		if (onClick) {
			onClick();
		}
	}

	return (
		<button
			id={id}
			className={combineClassNames("btn", className, {
				primary: primary,
				round: icon && !text,
				active: active,
				"btn-icon": icon && !text,
			})}
			type={type}
			disabled={disabled || loading}
			onClick={handleClick}
			{...props}
		>
			{!loading ? icon : <LoadingIndicator type="small" />}
			{text && <span className={combineClassNames(textClassName)}>{text}</span>}
			{children}
			{rightIcon}
		</button>
	);
};

export default Button;
