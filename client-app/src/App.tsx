import React, { useEffect } from "react";

import { Header, Router } from "./features";
import { Container } from "./components";
import { fetchMonitors } from "./models/monitors/monitorsSlice";
import { useAppDispatch } from "./store";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchMonitors());
	}, [dispatch]);

	return (
		<div className="app">
			<Container>
				<Header />

				<Router />
			</Container>
		</div>
	);
};
