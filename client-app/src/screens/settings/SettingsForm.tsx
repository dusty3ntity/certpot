import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Switch, Tooltip, ValidationMessage } from "../../components";
import { isValidThreshold } from "../../features";
import { IUser, IUserSettings } from "../../models";
import { combineClassNames } from "../../utils";

interface ISettingsFormProps {
	onSubmit: (data: IUserSettings) => void;
	submitting: boolean;
	user: IUser;
}

export const SettingsForm: React.FC<ISettingsFormProps> = ({ user, onSubmit, submitting }) => {
	const validationSchema: Yup.SchemaOf<IUserSettings> = Yup.object().shape({
		notificationsEmail: Yup.string()
			.required("Notifications email is required.")
			.email("The notifications email is not valid."),
		expiryNotificationThresholdDays: Yup.number()
			.typeError("Expiry notifications threshold must be a number.")
			.required("Expiry notifications threshold is required.")
			.test("is-valid-threshold", "Expiry notifications threshold must be between 1 and 7 days.", isValidThreshold),
		notifyAboutCertificateChange: Yup.boolean().required(),
		notifyAboutExpiryIfRenewalConfigured: Yup.boolean().required(),
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isDirty, isValid },
	} = useForm<IUserSettings>({
		defaultValues: user,
		mode: "onChange",
		resolver: yupResolver(validationSchema),
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
					className={combineClassNames("text-input", { error: errors.notificationsEmail })}
					type="text"
					autoFocus
					autoComplete="off"
					maxLength={30}
					{...register("notificationsEmail")}
				/>
			</div>

			<div className="threshold-input form-item">
				<label htmlFor="expiryNotificationThresholdDays">
					<Tooltip text="When should we start notify you about certificate expiries (in days)?" position="top-start">
						<span>Expiry notifications threshold</span>
					</Tooltip>
					<ValidationMessage inputName="expiryNotificationThresholdDays" errors={errors} />
				</label>

				<input
					id="expiryNotificationThresholdDays"
					className={combineClassNames("text-input threshold", { error: errors.expiryNotificationThresholdDays })}
					type="text"
					autoComplete="off"
					maxLength={3}
					{...register("expiryNotificationThresholdDays")}
				/>
			</div>

			<div className="notifyAboutCertificateChange-input toggle-item form-item">
				<Tooltip text="Do you need to get notified about unexpected certificate changes?" position="top-start">
					<label htmlFor="notifyAboutCertificateChange">Notify about certificate changes:</label>
				</Tooltip>

				<Controller
					name="notifyAboutCertificateChange"
					control={control}
					defaultValue={user.notifyAboutCertificateChange}
					render={({ field }) => <Switch id="notifyAboutCertificateChange" {...field} />}
				/>
			</div>

			<div className="notifyAboutExpiryIfRenewalConfigured-input toggle-item form-item">
				<Tooltip
					text="Do you need to get notified about certificate expiry if you have autorenewal configured?"
					position="top-start"
				>
					<label htmlFor="notifyAboutExpiryIfRenewalConfigured">Notify if renewal configured:</label>
				</Tooltip>

				<Controller
					name="notifyAboutExpiryIfRenewalConfigured"
					control={control}
					defaultValue={user.notifyAboutExpiryIfRenewalConfigured}
					render={({ field }) => <Switch id="notifyAboutExpiryIfRenewalConfigured" {...field} />}
				/>
			</div>

			<div className="actions-container">
				<Button className="submit-btn" text="Save" type="submit" disabled={!isDirty || !isValid} loading={submitting} />
			</div>
		</form>
	);
};
