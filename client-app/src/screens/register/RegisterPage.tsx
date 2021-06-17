import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import { Button, Page, ValidationMessage } from "../../components";
import {
	fullTrim,
	PageTitle,
	PASSWORD_CONTAINS_NUMERIC_REGEX,
	USERNAME_BEGINS_WITH_A_LETTER_REGEX,
	USERNAME_CONTAINS_ONLY_ALPHANUMERIC_REGEX,
} from "../../features";
import { IRegisterUser } from "../../models";
import { combineClassNames, createNotification } from "../../utils";
import { RootStateType } from "../../models/rootReducer";
import { history } from "../../config/history";
import { useAppDispatch } from "../../store";
import { registerUser } from "../../models/user/userSlice";
import { ErrorType, NotificationType } from "../../models/types/errors";
import { yupResolver } from "@hookform/resolvers/yup";

export const RegisterPage: React.FC = () => {
	const validationSchema: Yup.SchemaOf<IRegisterUser> = Yup.object().shape({
		email: Yup.string().required("Email is required.").email("The email is not valid."),
		username: Yup.string()
			.required("Username is required")
			.min(3, "Username must be at least 3 characters long.")
			.max(20, "Username can be at most 20 characters long.")
			.matches(USERNAME_BEGINS_WITH_A_LETTER_REGEX, "Username must begin with a letter.")
			.matches(USERNAME_CONTAINS_ONLY_ALPHANUMERIC_REGEX, "Username must contain only alphanumeric."),
		displayName: Yup.string()
			.required("Display name is required")
			.transform(fullTrim)
			.min(3, "Display name must be at least 3 characters long.")
			.max(20, "Display name can be at most 20 characters long.")
			.matches(USERNAME_BEGINS_WITH_A_LETTER_REGEX, "Display name must begin with a letter."),
		password: Yup.string()
			.required("Password is required.")
			.min(8, "Password must be at least 8 characters long.")
			.max(20, "Username can be at most 20 characters long.")
			.matches(PASSWORD_CONTAINS_NUMERIC_REGEX, "Password must contain at least one digit."),
	});

	const dispatch = useAppDispatch();
	const { submitting } = useSelector((state: RootStateType) => state.user);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid, submitCount },
	} = useForm<IRegisterUser>({ resolver: yupResolver(validationSchema) });

	const onSubmit = async (newUser: IRegisterUser) => {
		await dispatch(registerUser(newUser))
			.then(() => history.push("/monitors"))
			.catch((err) => {
				if (err.code < ErrorType.DefaultErrorsBlockEnd) {
					return;
				}

				if (err.body.status === 400) {
					if (err.code === ErrorType.DuplicateEmailFound) {
						createNotification(NotificationType.Error, {
							message: "This email is already in use! Please, choose another one.",
							error: err.body,
						});
					}
					if (err.code === ErrorType.DuplicateUsernameFound) {
						createNotification(NotificationType.Error, {
							message: "This username is already in use! Please, choose another one.",
							error: err.body,
						});
					}
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.body,
						errorOrigin: "[registerPage]~register",
					});
				}
			});
	};

	return (
		<>
			<PageTitle title="Register" />

			<Page id="register-page">
				<h2>Register</h2>

				<form id="register-form" className="form" onSubmit={handleSubmit(onSubmit)}>
					<div className="email-input form-item">
						<label htmlFor="email">
							<span>Email</span>
							<ValidationMessage inputName="email" errors={errors} />
						</label>

						<input
							id="email"
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							autoFocus
							maxLength={30}
							{...register("email")}
						/>
					</div>

					<div className="username-input form-item">
						<label htmlFor="username">
							<span>Username</span>
							<ValidationMessage inputName="username" errors={errors} />
						</label>

						<input
							id="username"
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							autoComplete="username"
							maxLength={30}
							{...register("username")}
						/>
					</div>

					<div className="displayName-input form-item">
						<label htmlFor="displayName">
							<span>Display name</span>
							<ValidationMessage inputName="displayName" errors={errors} />
						</label>

						<input
							id="displayName"
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							maxLength={30}
							{...register("displayName")}
						/>
					</div>

					<div className="password-input form-item">
						<label htmlFor="password">
							<span>Password</span>
							<ValidationMessage inputName="password" errors={errors} />
						</label>

						<input
							id="password"
							className={combineClassNames("text-input", { error: errors.password })}
							type="password"
							autoComplete="current-password"
							maxLength={30}
							{...register("password")}
						/>
					</div>

					<div className="actions-container">
						<div className="prompt-container">
							<span className="prompt">Already have an account?</span>

							<Link className="link" to="/login">
								Log in
							</Link>
						</div>

						<Button
							className="register-btn"
							text="Register"
							type="submit"
							disabled={!isDirty || (submitCount > 0 && !isValid)}
							loading={submitting}
						/>
					</div>
				</form>
			</Page>
		</>
	);
};
