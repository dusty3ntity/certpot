import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { IEditUserSecret } from "../../../models/types/users";
import { Button, ValidationMessage } from "../../../components";
import { combineClassNames } from "../../../utils";

interface IEditSecretFormProps {
	onSubmit: (secret: IEditUserSecret) => void;
	onCancel: () => void;
	submitting: boolean;
}

export const EditSecretForm: React.FC<IEditSecretFormProps> = ({ onSubmit, onCancel, submitting }) => {
	const validationSchema: Yup.SchemaOf<IEditUserSecret> = Yup.object().shape({
		value: Yup.string()
			.required("Value is required.")
			.min(1, "Value must be at least 1 character long.")
			.max(1000, "Value can be at most 1000 characters long."),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, submitCount, isDirty, isValid },
	} = useForm<IEditUserSecret>({
		resolver: yupResolver(validationSchema),
	});

	return (
		<form className="edit-secret-form form" onSubmit={handleSubmit(onSubmit)}>
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
					className="modal-btn ok-btn edit-btn"
					text="Edit"
					type="submit"
					disabled={!isDirty || (submitCount > 0 && !isValid)}
					loading={submitting}
				/>
			</div>
		</form>
	);
};
