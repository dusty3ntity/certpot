import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, Page, ValidationMessage } from "../../components";
import { PageTitle } from "../../features";
import { ILoginUser } from "../../models";
import { combineClassNames, createNotification } from "../../utils";
import { RootStateType } from "../../models/rootReducer";
import { useAppDispatch } from "../../store";
import { loginUser } from "../../models/user/userSlice";
import { history } from "../../config/history";
import { ApiError, ErrorType, NotificationType } from "../../models/types/errors";

export const LoginPage: React.FC = () => {
	const validationSchema: Yup.SchemaOf<ILoginUser> = Yup.object().shape({
		email: Yup.string().required("Email is required.").email("The email is not valid."),
		password: Yup.string().required("Password is required."),
	});

	const dispatch = useAppDispatch();
	const { submitting } = useSelector((state: RootStateType) => state.user);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, submitCount, isValid },
	} = useForm<ILoginUser>({ resolver: yupResolver(validationSchema) });

	const onSubmit = async (credentials: ILoginUser) => {
		await dispatch(loginUser(credentials))
			.then(() => history.push("/monitors"))
			.catch((err: ApiError) => {
				if (err.wasHandled) {
					return;
				}

				if (err.code === ErrorType.InvalidEmail) {
					createNotification(NotificationType.Error, {
						title: "Authentication error!",
						message: "Could not find a user with this email. Check your credentials and try again.",
						error: err.getResponse(),
					});
				} else if (err.code === ErrorType.InvalidPassword) {
					createNotification(NotificationType.Error, {
						title: "Authentication error!",
						message: "The password is incorrect. Check your credentials and try again.",
						error: err.getResponse(),
					});
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.getResponse(),
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
							className={combineClassNames("text-input", { error: errors.email })}
							type="text"
							autoFocus
							autoComplete="username"
							maxLength={30}
							{...register("email")}
						/>
					</div>

					<div className="displayName-input form-item">
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
							<span className="prompt">Don't have an account?</span>

							<Link className="link" to="/register">
								Register
							</Link>
						</div>

						<Button
							className="login-btn"
							text="Log in"
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
