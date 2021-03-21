import React from "react";

import { IMonitor } from "../../models/monitors";
import StatusBadge from "../Common/StatusBadge";
import DeleteIcon from "../Common/Icons/DeleteIcon";
import OpenIcon from "../Common/Icons/OpenIcon";
import Button from "../Common/Inputs/Button";
import { getExpiresInValue, normalizeDomainName } from "../../utils/certificates";
import { combineClassNames } from "../../utils/classNames";
import Tooltip from "../Common/Tooltip";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface IMonitorsTableItemProps {
	monitor: IMonitor;
}

const MonitorsTableItem: React.FC<IMonitorsTableItemProps> = ({ monitor }) => {
	const { certificate } = monitor;

	const host = `${monitor.domainName}:${monitor.port}`;

	const subject = normalizeDomainName(certificate.subjectCommonName);

	const { value: expiresIn, label: expiresInString, severity } = getExpiresInValue(certificate);
	const expirationString =
		(expiresIn >= 0 ? "Expires on: " : "Expired on: ") + format(certificate.validTo, "d MMMM, Y");

	const status = monitor.autoRenewalEnabled ? "active" : "disabled";
	const lastCheckString = monitor.lastChecked ? format(monitor.lastChecked, "d MMMM, Y") : "-";

	return (
		<tr className="monitors-table-item">
			<td className="name-val">
				<Tooltip text={monitor.displayName} position="top">
					{monitor.displayName}
				</Tooltip>
			</td>

			<td className="host-val">
				<Tooltip text={host} position="top">
					{host}
				</Tooltip>
			</td>

			<td className="subject-val">
				<Tooltip
					content={
						<div className="subject-tooltip">
							<span>{certificate.subjectCommonName}</span>
							<span>{certificate.subjectOrganization}</span>
						</div>
					}
					position="top"
				>
					{subject}
				</Tooltip>
			</td>

			<td className="issuer-val">
				<Tooltip
					content={
						<div className="subject-tooltip">
							<span>{certificate.issuerCommonName}</span>
							<span>{certificate.issuerOrganization}</span>
						</div>
					}
					position="top"
				>
					{certificate.issuerOrganization}
				</Tooltip>
			</td>

			<td className={combineClassNames("expires-in-val", `${severity}-severity`)}>
				<Tooltip text={expirationString} position="top">
					<span className="badge">{expiresInString}</span>
				</Tooltip>
			</td>

			<td className="status-val">
				<Tooltip text={`Last check: ${lastCheckString}`} position="top">
					<StatusBadge status={status} />
				</Tooltip>
			</td>

			<td className="actions-val">
				<div>
					<Link to={`/monitors/${monitor.id}`}>
						<OpenIcon />
					</Link>
					<Button icon={<DeleteIcon />} />
				</div>
			</td>
		</tr>
	);
};

export default MonitorsTableItem;
