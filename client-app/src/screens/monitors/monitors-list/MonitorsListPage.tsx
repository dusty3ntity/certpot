import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Page, Button, LoadingScreen, Empty } from "../../../components";
import { PageTitle } from "../../../features";
import { NewMonitorModal } from "../../../features/";
import { RootStateType } from "../../../models/rootReducer";
import { MonitorsTable } from "./MonitorsTable";

export const MonitorsListPage: React.FC = () => {
	const { monitors, loading } = useSelector((state: RootStateType) => state.monitors);
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<>
			<PageTitle title="Monitors" />

			<Page id="monitors-list-page">
				{loading ? (
					<LoadingScreen size={2} />
				) : (
					<>
						<div className="top-panel">
							<h2 className="title">Monitors List</h2>

							<Button onClick={() => setModalVisible(true)} text="Add" className="add-btn" primary />
						</div>

						{monitors.length ? (
							<div className="table-wrapper">
								<MonitorsTable monitors={monitors} />
							</div>
						) : (
							<Empty />
						)}
					</>
				)}
			</Page>

			{modalVisible && <NewMonitorModal onCancel={() => setModalVisible(false)} onOk={() => setModalVisible(false)} />}
		</>
	);
};
