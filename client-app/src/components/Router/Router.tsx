import React from "react";
import { Route, Switch } from "react-router-dom";

import MonitorsListPage from "../Monitors/MonitorsList/MonitorsListPage";
import MonitorPage from "../Monitors/MonitorDetails/MonitorPage";

const Router: React.FC = () => {
	return (
		<Switch>
			<Route exact path="/monitors" component={MonitorsListPage} />
			<Route exact path="/monitors/:monitorId" component={MonitorPage} />

			<Route path="/" component={() => null} />
		</Switch>
	);
};

export default Router;
