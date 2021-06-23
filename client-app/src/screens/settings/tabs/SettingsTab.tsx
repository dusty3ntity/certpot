import React from "react";
import { useSelector } from "react-redux";

import { RootStateType } from "../../../models/rootReducer";
import { ITabProps, IUserSettings } from "../../../models";
import { useAppDispatch } from "../../../store";
import { updateSettings } from "../../../models/user/userSlice";
import { createNotification, createUnknownError } from "../../../utils";
import { NotificationType } from "../../../models/types/errors";
import { SettingsForm } from "./SettingsForm";

export const SettingsTab: React.FC<ITabProps> = () => {
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
		<div className="settings-tab tab-content">
			<SettingsForm user={user!} onSubmit={handleFormSubmit} submitting={submitting} />
		</div>
	);
};
