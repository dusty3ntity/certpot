import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button, Page, ValidationMessage } from "../../components";
import { isValidEmail, maxLength, minLength, PageTitle } from "../../features";
import { ILoginUser } from "../../models";
import { combineClassNames, createNotification } from "../../utils";
import { RootStateType } from "../../models/rootReducer";
import { useAppDispatch } from "../../store";
import { loginUser } from "../../models/user/userSlice";
import { history } from "../../config/history";
import { ErrorType, NotificationType } from "../../models/types/errors";

export const LoginPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { register, handleSubmit, errors, formState } = useForm<ILoginUser>();
	const { submitting } = useSelector((state: RootStateType) => state.user);

	const onSubmit = async (credentials: ILoginUser) => {
		await dispatch(loginUser(credentials))
			.then(() => history.push("/monitors"))
			.catch((err) => {
				if (err.code < ErrorType.DefaultErrorsBlockEnd) {
					return;
				}

				if (err.body.status === 401) {
					createNotification(NotificationType.Error, {
						message: "User's email or password are incorrect! Please, try again or contact the administrator.",
						error: err.body,
					});
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.body,
						errorOrigin: "[loginPage]~login",
					});
				}
			});
	};

	return (
		<>
			<PageTitle title="Login" />

			<Page id="login-page">
				<h2>Log in</h2>

				<form id="login-form" className="form" onSubmit={handleSubmit(onSubmit)}>
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
							autoComplete="username"
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

					<div className="displayName-input form-item">
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
										return minLength(value, 8) ? "Password must be at least 8 characters." : true;
									},
									maxLength: (value: string) => {
										return maxLength(value, 20) ? "Password can be at most 20 characters." : true;
									},
								},
							})}
						/>
					</div>

					<div className="actions-container">
						<div className="prompt-container">
							<span className="prompt">Don't have an account?</span>

							<Link className="link" to="/register">
								Register
							</Link>
						</div>

						<Button
							className="login-btn"
							text="Log in"
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
