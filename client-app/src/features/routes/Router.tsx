import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { MonitorPageWrapper } from "../../screens/monitors/monitor-details/MonitorPageWrapper";
import { MonitorsListPage } from "../../screens/monitors/monitors-list";
import { HomePage, LoginPage, NotFoundPage, RegisterPage, SettingsPage } from "../../screens";
import { PrivateRoute } from "./PrivateRoute";

export const Router: React.FC = () => {
	return (
		<Switch>
			<Route exact path="/" component={HomePage} />

			<Route exact path="/login" component={LoginPage} />
			<Route exact path="/register" component={RegisterPage} />

			<PrivateRoute exact path="/monitors">
				<MonitorsListPage />
			</PrivateRoute>

			<PrivateRoute exact path="/monitors/:monitorId">
				<MonitorPageWrapper />
			</PrivateRoute>

			<PrivateRoute exact path="/settings">
				<SettingsPage />
			</PrivateRoute>

			<Route path="/not-found" component={NotFoundPage} />

			<Route>
				<Redirect to="/not-found" />
			</Route>
		</Switch>
	);
};
