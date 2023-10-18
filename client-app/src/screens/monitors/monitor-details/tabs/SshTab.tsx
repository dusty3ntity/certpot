import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoadingScreen } from "../../../../components";

import { IMonitor, ISshCredentials, ITabProps } from "../../../../models";
import { fetchSshCredentials, saveSshCredentials, testSshConnection } from "../../../../models/monitor/monitorSlice";
import { RootStateType } from "../../../../models/rootReducer";
import { ApiError, ErrorType, NotificationType } from "../../../../models/types/errors";
import { useAppDispatch } from "../../../../store";
import { createNotification, createUnknownErrorNotification } from "../../../../utils";
import { SshForm } from "./SshForm";

export const SshTab: React.FC<ITabProps> = ({ data }) => {
	const monitor = data as IMonitor;
	const dispatch = useAppDispatch();

	const { loadingSshCredentials, submittingSshCredentials, testingSshConnection } = useSelector(
		(state: RootStateType) => state.monitor
	);

	useEffect(() => {
		dispatch(fetchSshCredentials(monitor.id)).catch((err) => {
			createUnknownErrorNotification(err, "[sshTab]~fetchSshCredentials");
		});
	}, [monitor.id, dispatch]);

	const handleSubmit = (data: ISshCredentials) => {
		dispatch(saveSshCredentials(data))
			.then(unwrapResult)
			.then(() => createNotification(NotificationType.Success, { message: "Credentials saved successfully!" }))
			.catch((err: ApiError) => {
				createUnknownErrorNotification(err, "[sshTab]~saveSshCredentials");
			});
	};

	const handleTestConnection = (data: ISshCredentials) => {
		dispatch(testSshConnection(data))
			.then(unwrapResult)
			.then((success) => {
				if (success) {
					createNotification(NotificationType.Success, { message: "Connection established successfully!" });
				} else {
					createNotification(NotificationType.Error, { message: "Connection establishment failed!" });
				}
			})
			.catch((err: ApiError) => {
				if (err.wasHandled) {
					return;
				}

				if (err.code === ErrorType.SshConnectionTestingTimeout) {
					createNotification(NotificationType.Info, {
						message: "SSH connection testing timeout hit. Please, try again later.",
					});
				} else if (err.code === ErrorType.SshConnectionError) {
					createNotification(NotificationType.Error, {
						message:
							"There was an error connecting to the host specified. Please, review the SSH hostname and port provided.",
					});
				} else if (err.code === ErrorType.SshAuthenticationError) {
					createNotification(NotificationType.Error, {
						message:
							"There was an SSH authentication error. Please, review the SSH username, key and password provided.",
					});
				} else if (err.code === ErrorType.SshKeyParsingError) {
					createNotification(NotificationType.Error, {
						message: "There was an error parsing the SSH key. Please, review the SSH key provided.",
					});
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.getResponse(),
						errorOrigin: "[sshTab]~testSshConnection",
					});
				}
			});
	};

	return (
		<div className="ssh-tab tab-content">
			{loadingSshCredentials ? (
				<LoadingScreen size={2} />
			) : (
				<SshForm
					credentials={monitor.sshCredentials}
					onSubmit={handleSubmit}
					submitting={submittingSshCredentials}
					onTestConnection={handleTestConnection}
					testingConnection={testingSshConnection}
				/>
			)}
		</div>
	);
};
