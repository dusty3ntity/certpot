import React from "react";

import { PageTitle } from "../../features/";
import { Page } from "../../components";

export const SettingsPage: React.FC = () => {
	return (
		<>
			<PageTitle title="Settings" />

			<Page id="settings-page">Settings</Page>
		</>
	);
};
