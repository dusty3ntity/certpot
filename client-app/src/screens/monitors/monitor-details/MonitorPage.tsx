import React from "react";

import { Button, Switch, Tabs, Tooltip } from "../../../components";
import { PageTitle, StatusBadge } from "../../../features";
import { IMonitor } from "../../../models";
import { MONITOR_TABS_CONFIG } from "./tabs";

interface IMonitorPageProps {
	monitor: IMonitor;
	onDeleteClick: () => void;
	deleting: boolean;
	onAutoRenewalChange: (value: boolean) => void;
	onForceRenewal: () => void;
	submitting?: boolean;
	renewing?: boolean;
}

export const MonitorPage: React.FC<IMonitorPageProps> = ({
	monitor,
	onDeleteClick,
	deleting,
	onAutoRenewalChange,
	onForceRenewal,
	submitting,
	renewing,
}) => {
	return (
		<>
			<PageTitle title={monitor.displayName} />

			<div className="top-panel">
				<h2 className="title">
					Monitors {">"} {monitor.displayName}
				</h2>

				<div className="actions-container">
					{!monitor.isInRenewalQueue && !monitor.isRenewing && (
						<>
							<div className="autorenewal-switch-container">
								{!monitor.sshConfigured || !monitor.renewalConfigured ? (
									<Tooltip text="Make sure you have configured SSH settings and added a renewal script." position="top">
										<label htmlFor="autorenewal-switch">Autorenewal:</label>
									</Tooltip>
								) : (
									<label htmlFor="autorenewal-switch">Autorenewal:</label>
								)}

								<Switch
									id="autorenewal-switch"
									value={monitor.autoRenewalEnabled}
									onChange={onAutoRenewalChange}
									disabled={!monitor.sshConfigured || !monitor.renewalConfigured || deleting || submitting || renewing}
								/>
							</div>

							<Button
								text="Force renewal"
								onClick={onForceRenewal}
								className="renew-btn"
								primary
								loading={renewing}
								disabled={!monitor.sshConfigured || !monitor.renewalConfigured || deleting || submitting}
							/>
						</>
					)}

					{monitor.isInRenewalQueue && (
						<div className="renewal-status">
							<StatusBadge status="pending" noText />
							<span className="status-label">In renewal queue</span>
						</div>
					)}
					{monitor.isRenewing && (
						<div className="renewal-status">
							<StatusBadge status="in-progress" noText />
							<span className="status-label">Renewing</span>
						</div>
					)}

					<Button
						text="Delete"
						onClick={onDeleteClick}
						className="delete-btn"
						primary
						loading={deleting}
						disabled={submitting || renewing}
					/>
				</div>
			</div>

			<Tabs tabs={MONITOR_TABS_CONFIG} data={monitor} />
		</>
	);
};
