import React from "react";
import { Route, Switch } from "react-router-dom";

import MonitorsListPage from "../Monitors/MonitorsListPage";

const Router: React.FC = () => {
	return (
		<Switch>
			<Route exact path="/monitors" component={MonitorsListPage} />

			<Route path="/" component={() => null} />
		</Switch>
	);
};

export default Router;
