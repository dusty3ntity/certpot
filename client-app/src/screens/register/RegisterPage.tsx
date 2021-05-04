import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button, Page, ValidationMessage } from "../../components";
import { isValidEmail, isValidPassword, isValidUsername, maxLength, minLength, PageTitle } from "../../features";
import { IRegisterUser } from "../../models";
import { combineClassNames, createNotification } from "../../utils";
import { RootStateType } from "../../models/rootReducer";
import { history } from "../../config/history";
import { useAppDispatch } from "../../store";
import { registerUser } from "../../models/user/userSlice";
import { ErrorType, NotificationType } from "../../models/types/errors";

export const RegisterPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { register, handleSubmit, errors, formState } = useForm<IRegisterUser>();
	const { submitting } = useSelector((state: RootStateType) => state.user);

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
							name="email"
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							autoFocus
							maxLength={30}
							ref={register({
								required: "Email is required.",
								validate: {
									email: (value: string) => {
										return isValidEmail(value) ? "Your email is not valid." : true;
									},
								},
							})}
						/>
					</div>

					<div className="username-input form-item">
						<label htmlFor="username">
							<span>Username</span>
							<ValidationMessage inputName="username" errors={errors} />
						</label>

						<input
							id="username"
							name="username"
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							autoComplete="username"
							maxLength={30}
							ref={register({
								required: "Username is required.",
								validate: {
									minLength: (value: string) => {
										return minLength(value, 3) ? "Username must be at least 3 characters long." : true;
									},
									maxLength: (value: string) => {
										return maxLength(value, 20) ? "Username can be at most 20 characters long." : true;
									},
									username: (value: string) => {
										const result = isValidUsername(value);
										if (result) return result;
										else return true;
									},
								},
							})}
						/>
					</div>

					<div className="displayName-input form-item">
						<label htmlFor="displayName">
							<span>Display name</span>
							<ValidationMessage inputName="displayName" errors={errors} />
						</label>

						<input
							id="displayName"
							name="displayName"
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							maxLength={30}
							ref={register({
								required: "Display name is required.",
								validate: {
									minLength: (value: string) => {
										return minLength(value, 3) ? "Display name must be at least 3 characters long." : true;
									},
									maxLength: (value: string) => {
										return maxLength(value, 20) ? "Display name can be at most 20 characters long." : true;
									},
								},
							})}
						/>
					</div>

					<div className="password-input form-item">
						<label htmlFor="password">
							<span>Password</span>
							<ValidationMessage inputName="password" errors={errors} />
						</label>

						<input
							id="password"
							name="password"
							className={combineClassNames("text-input", { error: errors.password })}
							type="password"
							autoComplete="current-password"
							maxLength={30}
							ref={register({
								required: "Password is required.",
								validate: {
									minLength: (value: string) => {
										return minLength(value, 8) ? "Password must be at least 8 characters long." : true;
									},
									maxLength: (value: string) => {
										return maxLength(value, 20) ? "Password can be at most 20 characters long." : true;
									},
									password: (value: string) => {
										return isValidPassword(value) ? "Password must contain at least one digit." : true;
									},
								},
							})}
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
							disabled={!formState.isDirty || (formState.submitCount > 0 && !formState.isValid)}
							loading={submitting}
						/>
					</div>
				</form>
			</Page>
		</>
	);
};
