import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";

import { createMonitor } from "../../models/monitors/monitorsSlice";
import { IConcreteModalProps, INewMonitor } from "../../models/types";
import { useAppDispatch } from "../../store";
import { combineClassNames, createNotification } from "../../utils";
import { MonitorForm } from "../new-monitor-form";
import { useSelector } from "react-redux";
import { RootStateType } from "../../models/rootReducer";
import { ApiError, ErrorType, NotificationType } from "../../models/types/errors";

export const NewMonitorModal: React.FC<IConcreteModalProps> = ({ onOk, onCancel }) => {
	const [animating, setAnimating] = useState(false);
	const dispatch = useAppDispatch();

	const { submitting } = useSelector((state: RootStateType) => state.monitors);

	useEffect(() => {
		setTimeout(() => {
			setAnimating(true);
		}, 20);
	}, []);

	const handleClick = (func: () => void) => {
		setAnimating(false);
		setTimeout(func, 300);
	};

	const handleNewMonitorSubmit = (monitor: INewMonitor) => {
		dispatch(createMonitor(monitor))
			.then(unwrapResult)
			.then(onOk)
			.then(() => createNotification(NotificationType.Success, { message: "Monitor created successfully!" }))
			.catch((err: ApiError) => {
				if (err.wasHandled) {
					return;
				}

				if (err.code === ErrorType.CertificateParsingError) {
					createNotification(NotificationType.Error, {
						message: "There was an error parsing the certificate. Please, try again later or check the data provided.",
					});
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.getResponse(),
						errorOrigin: "[newMonitorModal]~createMonitor",
					});
				}
			});
	};

	return (
		<div className={combineClassNames("modal new-monitor-modal", { initial: !animating })}>
			<div className="modal-mask" onClick={() => handleClick(onCancel)} />
			<div className="modal-content">
				<div className="modal-title">New Monitor</div>

				<MonitorForm onCancel={onCancel} onSubmit={handleNewMonitorSubmit} submitting={submitting} />
			</div>
		</div>
	);
};
