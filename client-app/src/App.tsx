import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { Header, Router } from "./features";
import { Container } from "./components";
import { fetchMonitors } from "./models/monitors/monitorsSlice";
import { useAppDispatch } from "./store";
import { createUnknownError } from "./utils";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchMonitors()).catch((err) => createUnknownError(err, "[app]~fetchMonitors"));
	}, [dispatch]);

	return (
		<div className="app">
			<ToastContainer
				position="bottom-right"
				limit={3}
				draggable={false}
				hideProgressBar
				closeOnClick={false}
				autoClose={500000000}
			/>

			<Container>
				<Header />

				<Router />
			</Container>
		</div>
	);
};
