import React from "react";

import Page from "../Containers/Page";
import Button from "../Common/Inputs/Button";
import { IMonitor } from "../../models/monitors";
import MonitorsListItem from "./MonitorsListItem";

import { monitors as mockMonitors } from "../../__mocks__/monitors";

interface IMonitorsListProps {
	monitors?: IMonitor[];
}

const MonitorsListPage: React.FC<IMonitorsListProps> = ({ monitors = mockMonitors }) => {
	return (
		<Page id="monitors-list-page">
			<div className="top-panel">
				<h2>Monitors List</h2>

				<Button text="ADD" className="add-btn" primary />
			</div>

			<table className="monitors-table">
				<thead>
					<tr>
						<th className="name-col">Name</th>
						<th className="host-col">Host</th>
						<th className="subject-col">Subject</th>
						<th className="issuer-col">Issuer</th>
						<th className="remains-col">Remains</th>
						<th className="status-col">Status</th>
						<th className="actions-col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{monitors.map((monitor) => (
						<MonitorsListItem key={monitor.id} monitor={monitor} />
					))}
				</tbody>
			</table>
		</Page>
	);
};

export default MonitorsListPage;
