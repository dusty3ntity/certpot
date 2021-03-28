import React from "react";
import { useHistory } from "react-router-dom";

import { IMonitor } from "../../../models/monitors";
import StatusBadge from "../../Common/StatusBadge";
import DeleteIcon from "../../Common/Icons/DeleteIcon";
import Button from "../../Common/Inputs/Button";
import { getExpiresInValue, normalizeDomainName } from "../../../utils/certificates";
import { combineClassNames } from "../../../utils/classNames";
import Tooltip from "../../Common/Tooltip";
import { defaultFormat } from "../../../utils/dates";
import { createConfirmationModal } from "../../Common/Modals/ConfirmationModal";

interface IMonitorsTableItemProps {
	monitor: IMonitor;
}

const MonitorsTableItem: React.FC<IMonitorsTableItemProps> = ({ monitor }) => {
	const history = useHistory();
	const { certificate } = monitor;

	const host = `${monitor.domainName}:${monitor.port}`;
	const subject = normalizeDomainName(certificate.subjectCommonName);

	const { value: expiresIn, label: expiresInString, severity } = getExpiresInValue(certificate);
	const expirationString = (expiresIn >= 0 ? "Expires on: " : "Expired on: ") + defaultFormat(certificate.validTo);

	const status = monitor.autoRenewalEnabled ? "active" : "disabled";
	const lastCheckString = monitor.lastChecked ? defaultFormat(monitor.lastChecked) : "-";

	const handleMonitorClick = () => {
		history.push(`/monitors/${monitor.id}`);
	};

	const handleDeleteClick = () => {
		const onOk = () => {
			console.log(`Deleting ${monitor.id}`);
		};

		const modalContent = <span>Are you sure you want to delete this monitor?</span>;

		createConfirmationModal(modalContent, "Delete", onOk);
	};

	return (
		<tr className="monitors-table-item" onClick={handleMonitorClick}>
			<td className="name-val">
				<Tooltip text={monitor.displayName} position="top">
					{monitor.displayName}
				</Tooltip>
			</td>

			<td className="host-val">
				<Tooltip text={host} position="top" interactive>
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
					interactive
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
					interactive
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
					<Button icon={<DeleteIcon />} onClick={handleDeleteClick} />
				</div>
			</td>
		</tr>
	);
};

export default MonitorsTableItem;
