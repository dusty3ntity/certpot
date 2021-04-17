import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { LoadingScreen } from "../../components";

import { RootStateType } from "../../models/rootReducer";

export const PrivateRoute: React.FC<RouteProps> = ({ children, ...props }) => {
	const { user, loading } = useSelector((state: RootStateType) => state.user);

	if (loading === "idle" || loading === "pending") {
		return <LoadingScreen size={2} />;
	}

	return <Route {...props} render={() => (user ? children : <Redirect to={"/login"} />)} />;
};
