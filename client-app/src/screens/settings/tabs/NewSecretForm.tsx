import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { INewUserSecret } from "../../../models/types/users";
import {
	SECRET_NAME_BEGINS_WITH_ALPHANUMERIC_REGEX,
	SECRET_NAME_CONTAINS_ALPHANUMERIC_OR_UNDERSCORES,
	SECRET_NAME_ENDS_WITH_ALPHANUMERIC_REGEX,
} from "../../../features";
import { Button, ValidationMessage } from "../../../components";
import { combineClassNames } from "../../../utils";

interface INewSecretFormProps {
	onSubmit: (secret: INewUserSecret) => void;
	onCancel: () => void;
	submitting: boolean;
}

export const NewSecretForm: React.FC<INewSecretFormProps> = ({ onSubmit, onCancel, submitting }) => {
	const validationSchema: Yup.SchemaOf<INewUserSecret> = Yup.object().shape({
		name: Yup.string()
			.required("Name is required.")
			.min(2, "Name must be at least 2 characters long.")
			.max(20, "Name can be at most 20 characters long.")
			.matches(SECRET_NAME_BEGINS_WITH_ALPHANUMERIC_REGEX, "Name must start with an alphanumeric character.")
			.matches(
				SECRET_NAME_CONTAINS_ALPHANUMERIC_OR_UNDERSCORES,
				"Name must contain only alphanumeric characters or underscores."
			)
			.matches(SECRET_NAME_ENDS_WITH_ALPHANUMERIC_REGEX, "Name must end with an alphanumeric character."),
		value: Yup.string()
			.required("Value is required.")
			.min(1, "Value must be at least 1 character long.")
			.max(1000, "Value can be at most 1000 characters long."),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, submitCount, isDirty, isValid },
	} = useForm<INewUserSecret>({
		resolver: yupResolver(validationSchema),
	});

	return (
		<form className="new-secret-form form" onSubmit={handleSubmit(onSubmit)}>
			<div className="name-input form-item">
				<label htmlFor="name">
					<span>Name</span>
					<ValidationMessage inputName="name" errors={errors} />
				</label>

				<input
					id="name"
					className={combineClassNames("text-input name", { error: errors.name })}
					type="text"
					autoFocus
					autoComplete="off"
					maxLength={30}
					{...register("name")}
				/>
			</div>

			<div className="value-input form-item">
				<label htmlFor="value">
					<span>Value </span>
					<ValidationMessage inputName="value" errors={errors} />
				</label>

				<textarea
					id="value"
					className={combineClassNames("text-input text-area value", { error: errors.value })}
					autoComplete="off"
					rows={10}
					{...register("value")}
				/>
			</div>

			<div className="modal-actions">
				<Button className="modal-btn cancel-btn" onClick={onCancel} text="Cancel" />
				<Button
					className="modal-btn ok-btn create-btn"
					text="Create"
					type="submit"
					disabled={!isDirty || (submitCount > 0 && !isValid)}
					loading={submitting}
				/>
			</div>
		</form>
	);
};
