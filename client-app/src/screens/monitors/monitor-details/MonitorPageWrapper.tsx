import React, { useEffect } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { createConfirmationModal, LoadingScreen, Page } from "../../../components";
import {
	fetchMonitorById,
	forceRenewal,
	resetSelectedMonitor,
	switchAutoRenewal,
} from "../../../models/monitor/monitorSlice";
import { deleteMonitor } from "../../../models/monitors/monitorsSlice";
import { RootStateType } from "../../../models/rootReducer";
import { useAppDispatch } from "../../../store";
import { MonitorPage } from "./MonitorPage";
import { createUnknownErrorNotification } from "../../../utils";
import { ApiError } from "../../../models/types/errors";

export const MonitorPageWrapper = () => {
	const history = useHistory();
	const { monitorId } = useParams<{ monitorId: string }>();
	const { monitor, loading, submittingAutoRenewal, renewing } = useSelector((state: RootStateType) => state.monitor);
	const dispatch = useAppDispatch();

	const { deleting, deleteTargetId } = useSelector((state: RootStateType) => state.monitors);

	useEffect(() => {
		dispatch(fetchMonitorById(monitorId)).catch((err) => {
			createUnknownErrorNotification(err, "[monitorPage]~fetchMonitorById");
		});

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
				.catch((err: ApiError) => createUnknownErrorNotification(err, "[monitorPage]~deleteMonitor"));
		};

		const modalContent = <span>Are you sure you want to delete this monitor?</span>;

		createConfirmationModal(modalContent, "Delete", onOk);
	};

	const handleAutoRenewalChange = () => {
		dispatch(switchAutoRenewal())
			.then(unwrapResult)
			.catch((err: ApiError) => {
				createUnknownErrorNotification(err, "[monitorPage]~handleAutoRenewalChange");
			});
	};

	const handleForceRenewal = () => {
		dispatch(forceRenewal())
			.then(unwrapResult)
			.catch((err: ApiError) => {
				createUnknownErrorNotification(err, "[monitorPage]~handleForceRenewal");
			});
	};

	return (
		<Page id="monitor-page">
			{loading && <LoadingScreen size={2} />}

			{!loading && monitor && (
				<MonitorPage
					monitor={monitor}
					onDeleteClick={handleDeleteClick}
					deleting={deleting && deleteTargetId === monitor.id}
					onAutoRenewalChange={handleAutoRenewalChange}
					onForceRenewal={handleForceRenewal}
					submitting={submittingAutoRenewal}
					renewing={renewing}
				/>
			)}
		</Page>
	);
};
