import { ITabConfig } from "../../../models/components";
import InfoTab from "./Tabs/InfoTab";
import RenewalTab from "./Tabs/RenewalTab";
import InfoIcon from "../../Common/Icons/InfoIcon";
import RenewalIcon from "../../Common/Icons/RenewalIcon";

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
