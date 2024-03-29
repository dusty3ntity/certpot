import React from "react";

import { IComponentProps } from "../../models";
import { combineClassNames } from "../../utils";

interface ISwitchProps extends IComponentProps {
	name?: string;
	value?: boolean;
	onChange?: (value: boolean) => void;
	disabled?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, ISwitchProps>(
	({ id, className, name, value, onChange, disabled, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (onChange) {
				onChange(e.target.checked);
			}
		};

		return (
			<label
				id={id}
				className={combineClassNames("switch", className, { disabled })}
				{...props}
				onClick={(e) => e.stopPropagation()}
			>
				<input type="checkbox" name={name} ref={ref} checked={value} onChange={handleChange} disabled={disabled} />
				<span className="track">
					<span className="thumb" />
				</span>
			</label>
		);
	}
);
