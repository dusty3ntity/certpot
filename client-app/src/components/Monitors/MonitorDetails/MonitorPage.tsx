import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { IMonitor } from "../../../models/monitors";
import { monitors } from "../../../__mocks__/monitors";
import Button from "../../Common/Inputs/Button";
import Page from "../../Containers/Page";
import { MONITOR_TABS_CONFIG } from "./tabs-config";
import Tabs from "../../Common/Tabs";
import { PageTitle } from "../../Common/PageTitle";
import { createConfirmationModal } from "../../Common/Modals/ConfirmationModal";

const MonitorPage: React.FC = () => {
	const history = useHistory();
	const { monitorId } = useParams<{ monitorId: string }>();
	const [monitor, setMonitor] = useState<IMonitor>();

	useEffect(() => {
		const result = monitors.find((m) => m.id === monitorId);

		if (!result) {
			history.push("/not-found");
		}

		setMonitor(result);
	}, [monitorId, history]);

	const handleDeleteClick = () => {
		const onOk = () => {
			console.log(`Deleting ${monitor!.id}`);
		};

		const modalContent = <span>Are you sure you want to delete this monitor?</span>;

		createConfirmationModal(modalContent, "Delete", onOk);
	};

	return (
		<>
			{monitor && (
				<>
					<PageTitle title={monitor.displayName} />

					<Page id="monitor-page">
						<div className="top-panel">
							<h2 className="title">
								Monitors {">"} {monitor.displayName}
							</h2>

							<Button text="Delete" onClick={handleDeleteClick} className="delete-btn" primary />
						</div>

						<Tabs tabs={MONITOR_TABS_CONFIG} />
					</Page>
				</>
			)}
		</>
	);
};

export default MonitorPage;
