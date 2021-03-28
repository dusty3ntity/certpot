import React from "react";

import { IMonitor } from "../../../models/monitors";
import MonitorsListItem from "./MonitorsTableItem";

const columns = [
	{
		label: "Name",
		key: "name",
	},
	{
		label: "Host",
		key: "host",
	},
	{
		label: "Subject",
		key: "subject",
	},
	{
		label: "Issuer",
		key: "issuer",
	},
	{
		label: "Expires In",
		key: "expires-in",
	},
	{
		label: "AutoRenewal",
		key: "autorenewal",
	},
	{
		label: ".",
		key: "actions",
	},
];

interface IMonitorTableProps {
	monitors: IMonitor[];
}

const MonitorsTable: React.FC<IMonitorTableProps> = ({ monitors }) => {
	return (
		<table className="monitors-table">
			<thead>
				<tr>
					{columns.map((col) => (
						<th className={`${col.key}-col`} key={col.key}>
							<span>{col.label}</span>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{monitors.map((monitor) => (
					<MonitorsListItem key={monitor.id} monitor={monitor} />
				))}
			</tbody>
		</table>
	);
};

export default MonitorsTable;
