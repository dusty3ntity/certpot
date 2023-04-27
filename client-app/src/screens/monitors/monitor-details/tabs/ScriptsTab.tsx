import React, { useEffect, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/shell/shell";

import { Button, LoadingScreen, ValidationMessage } from "../../../../components";
import { combineClassNames, createNotification, createUnknownError } from "../../../../utils";
import { IMonitor, ITabProps } from "../../../../models";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { RootStateType } from "../../../../models/rootReducer";
import { fetchRenewalScript, saveRenewalScript } from "../../../../models/monitor/monitorSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { NotificationType } from "../../../../models/types/errors";

export const ScriptsTab: React.FC<ITabProps> = ({ data }) => {
	const [script, setScript] = useState("");

	const monitor = data as IMonitor;
	const dispatch = useAppDispatch();

	const { loadingRenewalScript, submittingRenewalScript } = useSelector((state: RootStateType) => state.monitor);

	useEffect(() => {
		dispatch(fetchRenewalScript(monitor.id))
			.then(unwrapResult)
			.then((data) => setScript(data))
			.catch((err) => {
				createUnknownError(err, "[scriptsTab]~fetchRenewalScript");
			});
	}, [monitor.id, dispatch]);

	const handleSubmit = () => {
		dispatch(saveRenewalScript(script))
			.then(unwrapResult)
			.then(() => createNotification(NotificationType.Success, { message: "Renewal script saved successfully!" }))
			.catch((err) => {
				createUnknownError(err, "[scriptsTab]~saveRenewalScript");
			});
	};

	if (loadingRenewalScript) {
		return <LoadingScreen size={2} />;
	}

	return (
		<div className="scripts-tab tab-content">
			<div className="top-panel">
				<span>Main renewal script:</span>
				<ValidationMessage
					inputName="script"
					errors={{
						script:
							script.length !== 0 && script.trim().length === 0
								? { message: "Please, provide a valid shell script." }
								: false,
					}}
				/>
			</div>

			<CodeMirror
				className={combineClassNames("editor", { error: script.length !== 0 && script.trim().length === 0 })}
				value={script}
				options={{
					mode: "shell",
					theme: "material",
					lineNumbers: true,
				}}
				onBeforeChange={(_: any, __: any, value: string) => {
					setScript(value);
				}}
			/>

			<div className="actions-container">
				<Button
					className="save-btn"
					text="Save"
					onClick={handleSubmit}
					loading={submittingRenewalScript}
					disabled={script.trim().length === 0 || script === monitor.renewalScript}
				/>
			</div>
		</div>
	);
};
