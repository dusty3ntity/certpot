import React, { useEffect } from "react";
import Prism from "prismjs";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-bash.min.js";

import { Empty, LoadingScreen } from "../../../../components";
import { IMonitor, ITabProps } from "../../../../models";
import { useAppDispatch } from "../../../../store";
import { RootStateType } from "../../../../models/rootReducer";
import { fetchLastRenewalLogs } from "../../../../models/monitor/monitorSlice";
import { createUnknownErrorNotification, defaultFormatWithTime } from "../../../../utils";
import { ApiError } from "../../../../models/types/errors";

export const LogsTab: React.FC<ITabProps> = ({ data }) => {
	const monitor = data as IMonitor;
	const dispatch = useAppDispatch();

	const { loadingRenewalLogs } = useSelector((state: RootStateType) => state.monitor);

	useEffect(() => {
		dispatch(fetchLastRenewalLogs(monitor.id))
			.then(unwrapResult)
			.catch((err: ApiError) => {
				createUnknownErrorNotification(err, "[logsTab]~fetchLastRenewalLogs");
			});
	}, [monitor.id, dispatch]);

	useEffect(() => {
		Prism.highlightAll();
	});

	if (loadingRenewalLogs) {
		return <LoadingScreen size={2} />;
	}

	return (
		<div className="logs-tab tab-content">
			<div className="top-panel">
				<span className="last-renewal-title">Last renewal attempt:</span>
				<span className="last-renewal-date">
					{monitor.lastRenewalDate ? defaultFormatWithTime(monitor.lastRenewalDate) : "-"}
				</span>
			</div>

			{monitor.renewalLogs ? (
				<div className="logs-content language-bash">
					{monitor.renewalLogs.map((value, ind) => {
						if (value.type === "input") {
							return (
								<code className="input" key={ind}>
									{"$  " + value.text}
								</code>
							);
						} else {
							return (
								<span className="output" key={ind}>
									{value.text}
								</span>
							);
						}
					})}
				</div>
			) : (
				<Empty />
			)}
		</div>
	);
};
