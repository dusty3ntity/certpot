import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { Header, Router } from "./features";
import { Container } from "./components";
import { useAppDispatch } from "./store";
import { createUnknownError } from "./utils";
import { fetchUser } from "./models/user/userSlice";
import { useSelector } from "react-redux";
import { RootStateType } from "./models/rootReducer";
import { fetchMonitors } from "./models/monitors/monitorsSlice";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { user } = useSelector((state: RootStateType) => state.user);

	useEffect(() => {
		const token = window.localStorage.getItem("jwt");

		if (!token) {
			return;
		}

		dispatch(fetchUser()).catch((err) => createUnknownError(err, "[app]~initialLoad"));
	}, [dispatch]);

	useEffect(() => {
		if (user) {
			dispatch(fetchMonitors()).catch((err) => createUnknownError(err, "[monitorsList]~fetchMonitors"));
		}
	}, [dispatch, user]);

	return (
		<div className="app">
			<ToastContainer
				position="bottom-right"
				limit={3}
				draggable={false}
				hideProgressBar
				closeOnClick={false}
				autoClose={5000}
			/>

			<Container>
				<Header />

				<Router />
			</Container>
		</div>
	);
};
