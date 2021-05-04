import React from "react";
import { useSelector } from "react-redux";

import { PageTitle } from "../../features/";
import { Page } from "../../components";
import { RootStateType } from "../../models/rootReducer";
import { IUserSettings } from "../../models";
import { SettingsForm } from "./SettingsForm";
import { updateSettings } from "../../models/user/userSlice";
import { createNotification, createUnknownError } from "../../utils";
import { NotificationType } from "../../models/types/errors";
import { useAppDispatch } from "../../store";

export const SettingsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { user, submitting } = useSelector((state: RootStateType) => state.user);

	const handleFormSubmit = async (data: IUserSettings) => {
		await dispatch(updateSettings(data))
			.then(() => createNotification(NotificationType.Success, { message: "Settings saved successfully!" }))
			.catch((err) => {
				createUnknownError(err, "[settingsPage]~up");
			});
	};

	return (
		<>
			<PageTitle title="Settings" />

			<Page id="settings-page">
				<div className="top-panel">
					<h2 className="title">Settings</h2>
				</div>

				<SettingsForm user={user!} onSubmit={handleFormSubmit} submitting={submitting} />
			</Page>
		</>
	);
};
