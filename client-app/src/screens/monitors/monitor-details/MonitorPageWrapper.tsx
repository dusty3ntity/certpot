import React, { useEffect } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { createConfirmationModal, LoadingScreen, Page } from "../../../components";
import { fetchMonitorById, resetSelectedMonitor } from "../../../models/monitor/monitorSlice";
import { deleteMonitor } from "../../../models/monitors/monitorsSlice";
import { RootStateType } from "../../../models/rootReducer";
import { useAppDispatch } from "../../../store";
import { MonitorPage } from "./MonitorPage";

export const MonitorPageWrapper = () => {
	const history = useHistory();
	const { monitorId } = useParams<{ monitorId: string }>();
	const { monitor, loading } = useSelector((state: RootStateType) => state.monitor);
	const dispatch = useAppDispatch();

	const { deleting, deleteTargetId } = useSelector((state: RootStateType) => state.monitors);

	useEffect(() => {
		dispatch(fetchMonitorById(monitorId));
		return () => {
			dispatch(resetSelectedMonitor());
		};
	}, [monitorId, dispatch]);

	const handleDeleteClick = () => {
		const onOk = () => {
			if (!monitor) return;
			dispatch(deleteMonitor(monitor.id))
				.then(unwrapResult)
				.then(() => history.push("/monitors"))
				.catch((e) => console.log(e));
		};

		const modalContent = <span>Are you sure you want to delete this monitor?</span>;

		createConfirmationModal(modalContent, "Delete", onOk);
	};

	return (
		<>
			<Page id="monitor-page">
				{loading && <LoadingScreen size={2} />}

				{!loading && monitor && (
					<MonitorPage
						monitor={monitor}
						onDeleteClick={handleDeleteClick}
						deleting={deleting && deleteTargetId === monitor.id}
					/>
				)}
			</Page>
		</>
	);
};
