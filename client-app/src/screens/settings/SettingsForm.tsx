import React from "react";
import { useForm } from "react-hook-form";

import { Button, Switch, Tooltip, ValidationMessage } from "../../components";
import { isValidEmail, isValidThreshold } from "../../features";
import { IUser, IUserSettings } from "../../models";
import { combineClassNames } from "../../utils";

interface ISettingsFormProps {
	onSubmit: (data: IUserSettings) => void;
	submitting: boolean;
	user: IUser;
}

export const SettingsForm: React.FC<ISettingsFormProps> = ({ user, onSubmit, submitting }) => {
	const {
		register,
		handleSubmit,
		errors,
		formState: { isDirty, isValid },
	} = useForm<IUserSettings>({
		defaultValues: user,
		mode: "onChange",
	});

	return (
		<form id="settings-form" className="form" onSubmit={handleSubmit(onSubmit)}>
			<div className="email-input form-item">
				<label htmlFor="notificationsEmail">
					<span>Email for notifications</span>
					<ValidationMessage inputName="notificationsEmail" errors={errors} />
				</label>

				<input
					id="notificationsEmail"
					name="notificationsEmail"
					className={combineClassNames("text-input", { error: errors.notificationsEmail })}
					type="text"
					autoFocus
					autoComplete="off"
					maxLength={30}
					ref={register({
						required: "Email is required.",
						validate: {
							email: (value: string) => {
								return isValidEmail(value) ? "The email is not valid." : true;
							},
						},
					})}
				/>
			</div>

			<div className="threshold-input form-item">
				<label htmlFor="expiryNotificationThresholdDays">
					<Tooltip text="When should we start notify you about certificate expiries (in days)?" position="top-start">
						<span>Expiry notifications threshold</span>
					</Tooltip>
					<ValidationMessage inputName="expiryNotificationThreshold" errors={errors} />
				</label>

				<input
					id="expiryNotificationThresholdDays"
					name="expiryNotificationThresholdDays"
					className={combineClassNames("text-input threshold", { error: errors.expiryNotificationThresholdDays })}
					type="text"
					autoComplete="off"
					maxLength={3}
					ref={register({
						required: "Expiry notifications threshold is required.",
						validate: {
							threshold: (value: string) => {
								if (isValidThreshold(value)) {
									return "Expiry notifications threshold must be in range: 1-7.";
								}

								return true;
							},
						},
					})}
				/>
			</div>

			<div className="notifyAboutCertificateChange-input toggle-item form-item">
				<Tooltip text="Do you need to get notified about unexpected certificate changes?" position="top-start">
					<label htmlFor="notifyAboutCertificateChange">Notify about certificate changes:</label>
				</Tooltip>

				<Switch name="notifyAboutCertificateChange" id="notifyAboutCertificateChange" ref={register} />
			</div>

			<div className="notifyAboutExpiryIfRenewalConfigured-input toggle-item form-item">
				<Tooltip
					text="Do you need to get notified about certificate expiry if you have autorenewal configured?"
					position="top-start"
				>
					<label htmlFor="notifyAboutExpiryIfRenewalConfigured">Notify if renewal configured:</label>
				</Tooltip>

				<Switch name="notifyAboutExpiryIfRenewalConfigured" id="notifyAboutExpiryIfRenewalConfigured" ref={register} />
			</div>

			<div className="actions-container">
				<Button className="submit-btn" text="Save" type="submit" disabled={!isDirty || !isValid} loading={submitting} />
			</div>
		</form>
	);
};
