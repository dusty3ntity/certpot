import { InfoIcon, LogsIcon, RemoteIcon, RenewalIcon } from "../../../../components";
import { ITabConfig } from "../../../../models/types";
import { InfoTab } from "./InfoTab";
import { ScriptsTab } from "./ScriptsTab";
import { SshTab } from "./SshTab";
import { LogsTab } from "./LogsTab";

export const MONITOR_TABS_CONFIG: ITabConfig[] = [
	{
		id: 0,
		name: "Info",
		icon: InfoIcon,
		component: InfoTab,
	},
	{
		id: 1,
		name: "SSH config",
		icon: RemoteIcon,
		component: SshTab,
	},
	{
		id: 2,
		name: "Scripts",
		icon: RenewalIcon,
		component: ScriptsTab,
	},
	{
		id: 3,
		name: "Logs",
		icon: LogsIcon,
		component: LogsTab,
	},
];
