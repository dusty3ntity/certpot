import React, { useState } from "react";

import { IComponentProps, ITabConfig } from "../../models/types/components";
import { combineClassNames } from "../../utils/classNames";
import { Button } from "../inputs";

export interface ITabsProps extends IComponentProps {
	tabs: ITabConfig[];
	data?: any;
}

export const Tabs: React.FC<ITabsProps> = ({ id, className, tabs, data }) => {
	const [currentTab, setCurrentTab] = useState<ITabConfig>(tabs[0]);

	return (
		<div className={combineClassNames("tabs", className)} id={id}>
			<div className="tabs-sidebar">
				{tabs.map((tab) => (
					<Button
						key={tab.id}
						icon={<tab.icon />}
						text={tab.name}
						className={combineClassNames("tab-button", { active: tab.id === currentTab.id })}
						onClick={() => setCurrentTab(tab)}
					/>
				))}
			</div>

			<div className="tabs-content">
				<div className="tab-title">
					<span>{currentTab.name}</span>
				</div>

				{<currentTab.component data={data} />}
			</div>
		</div>
	);
};
