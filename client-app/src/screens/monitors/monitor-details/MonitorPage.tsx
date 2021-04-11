import React from "react";

import { Button, Tabs } from "../../../components";
import { PageTitle } from "../../../features";
import { IMonitor } from "../../../models";
import { MONITOR_TABS_CONFIG } from "./tabs";

interface IMonitorPageProps {
	monitor: IMonitor;
	onDeleteClick: () => void;
	deleting: boolean;
}

export const MonitorPage: React.FC<IMonitorPageProps> = ({ monitor, onDeleteClick, deleting }) => {
	return (
		<>
			<PageTitle title={monitor.displayName} />

			<div className="top-panel">
				<h2 className="title">
					Monitors {">"} {monitor.displayName}
				</h2>

				<Button text="Delete" onClick={onDeleteClick} className="delete-btn" primary loading={deleting} />
			</div>

			<Tabs tabs={MONITOR_TABS_CONFIG} data={monitor} />
		</>
	);
};
