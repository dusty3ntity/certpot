import React, { useState } from "react";
import { IComponentProps, ITabConfig } from "../../models/components";
import { combineClassNames } from "../../utils/classNames";
import Button from "./Inputs/Button";

export interface ITabsProps extends IComponentProps {
	tabs: ITabConfig[];
}

const Tabs: React.FC<ITabsProps> = ({ id, className, tabs }) => {
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

				{<currentTab.component />}
			</div>
		</div>
	);
};

export default Tabs;
