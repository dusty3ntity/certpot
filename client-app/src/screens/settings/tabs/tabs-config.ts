import { SecurityIcon, SettingsIcon } from "../../../components";
import { ITabConfig } from "../../../models/types";
import { SecretsTab } from "./SecretsTab";
import { SettingsTab } from "./SettingsTab";

export const SETTINGS_TABS_CONFIG: ITabConfig[] = [
	{
		id: 0,
		name: "User settings",
		icon: SettingsIcon,
		component: SettingsTab,
	},
	{
		id: 1,
		name: "Renewal secrets",
		icon: SecurityIcon,
		component: SecretsTab,
	},
];
