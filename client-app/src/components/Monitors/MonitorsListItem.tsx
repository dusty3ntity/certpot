import React from "react";

import { IMonitor } from "../../models/monitors";

interface IMonitorsListItemProps {
	monitor: IMonitor;
}

const MonitorsListItem: React.FC<IMonitorsListItemProps> = ({ monitor }) => {
	return (
		<tr className="monitors-list-item">
			<td className="name-val">{monitor.displayName}</td>
			<td className="host-val">{`${monitor.domainName}:${monitor.port}`}</td>
			<td className="subject-val">{monitor.certificate.subjectCommonName}</td>
			<td className="issuer-val">{monitor.certificate.issuerOrganization}</td>
			<td className="remains-val">Remains</td>
			<td className="status-val">Status</td>
			<td className="actions-val">Actions</td>
		</tr>
	);
};

export default MonitorsListItem;
