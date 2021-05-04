import React from "react";
import SelectInput, { OptionTypeBase } from "react-select";

import { IComponentProps } from "../../models/types";
import { combineClassNames } from "../../utils";

interface ISelectProps extends IComponentProps {
	options: OptionType[];
	onChange: (value: OptionType) => void;
	defaultValue?: OptionType;
	value?: OptionType;
}

export type OptionType = OptionTypeBase;

export const Select: React.FC<ISelectProps> = ({ options, onChange, defaultValue, value, id, className }) => {
	return (
		<SelectInput
			id={id}
			value={value}
			onChange={onChange}
			options={options}
			defaultValue={defaultValue}
			className={combineClassNames("select", className)}
			classNamePrefix="select"
			isSearchable={false}
		/>
	);
};
