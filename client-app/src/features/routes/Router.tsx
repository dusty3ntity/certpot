import React from "react";
import { Route, Switch } from "react-router-dom";

import { MonitorPageWrapper } from "../../screens/monitors/monitor-details/MonitorPageWrapper";
import { MonitorsListPage } from "../../screens/monitors/monitors-list";

export const Router: React.FC = () => {
	return (
		<Switch>
			<Route exact path="/monitors" component={MonitorsListPage} />
			<Route exact path="/monitors/:monitorId" component={MonitorPageWrapper} />

			<Route path="/" component={() => null} />
		</Switch>
	);
};
