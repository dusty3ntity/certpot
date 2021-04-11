import React from "react";
import { Route, Switch } from "react-router-dom";

import { MonitorPageWrapper } from "../../screens/monitors/monitor-details/MonitorPageWrapper";
import { MonitorsListPage } from "../../screens/monitors/monitors-list";
import { HomePage, NotFoundPage, SettingsPage } from "../../screens";

export const Router: React.FC = () => {
	return (
		<Switch>
			<Route exact path="/" component={HomePage} />

			<Route exact path="/monitors" component={MonitorsListPage} />
			<Route exact path="/monitors/:monitorId" component={MonitorPageWrapper} />
			<Route exact path="/settings" component={SettingsPage} />

			<Route path="/not-found" component={NotFoundPage} />
		</Switch>
	);
};
