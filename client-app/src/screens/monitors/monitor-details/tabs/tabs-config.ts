import { InfoIcon, RenewalIcon } from "../../../../components";
import { ITabConfig } from "../../../../models/types";
import { InfoTab } from "./InfoTab";
import { RenewalTab } from "./RenewalTab";

export const MONITOR_TABS_CONFIG: ITabConfig[] = [
	{
		id: 0,
		name: "Info",
		icon: InfoIcon,
		component: InfoTab,
	},
	{
		id: 1,
		name: "Renewal",
		icon: RenewalIcon,
		component: RenewalTab,
	},
];
