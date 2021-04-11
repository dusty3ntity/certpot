import React from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { createConfirmationModal, Button, DeleteIcon, Tooltip } from "../../../components";
import { StatusBadge } from "../../../features";
import { deleteMonitor } from "../../../models/monitors/monitorsSlice";
import { RootStateType } from "../../../models/rootReducer";
import { IMonitor } from "../../../models/types";
import { useAppDispatch } from "../../../store";
import { normalizeDomainName, getExpiresInValue, combineClassNames, defaultFormat } from "../../../utils";

interface IMonitorsTableItemProps {
	monitor: IMonitor;
}

export const MonitorsTableItem: React.FC<IMonitorsTableItemProps> = ({ monitor }) => {
	const history = useHistory();
	const dispatch = useAppDispatch();
	const { certificate } = monitor;

	const { deleting, deleteTargetId } = useSelector((state: RootStateType) => state.monitors);

	const host = `${monitor.domainName}:${monitor.port}`;
	const subject = normalizeDomainName(certificate.subjectCommonName);

	const { value: expiresIn, label: expiresInString, severity } = getExpiresInValue(certificate);
	const expirationString = (expiresIn >= 0 ? "Expires on: " : "Expired on: ") + defaultFormat(certificate.validTo);

	const status = monitor.autoRenewalEnabled ? "active" : "disabled";
	const lastCheckString = monitor.lastCheckedDate ? defaultFormat(monitor.lastCheckedDate) : "-";

	const handleMonitorClick = () => {
		history.push(`/monitors/${monitor.id}`);
	};

	const handleDeleteClick = () => {
		const onOk = () => {
			dispatch(deleteMonitor(monitor.id))
				.then(unwrapResult)
				.then(() => console.log("Deleted monitor", monitor.id))
				.catch((e) => console.log(e));
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
					<Button
						icon={<DeleteIcon />}
						onClick={handleDeleteClick}
						loading={deleting && deleteTargetId === monitor.id}
					/>
				</div>
			</td>
		</tr>
	);
};
