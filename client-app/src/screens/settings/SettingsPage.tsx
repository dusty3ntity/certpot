import React from "react";

import { PageTitle } from "../../features/";
import { Page, Tabs } from "../../components";
import { SETTINGS_TABS_CONFIG } from "./tabs";

export const SettingsPage: React.FC = () => {
	return (
		<>
			<PageTitle title="Settings" />

			<Page id="settings-page">
				<div className="top-panel">
					<h2 className="title">Settings</h2>
				</div>

				<Tabs tabs={SETTINGS_TABS_CONFIG} />
			</Page>
		</>
	);
};
