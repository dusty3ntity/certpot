import React from "react";
import { BrowserRouter } from "react-router-dom";

import Header from "../Header/Header";
import Router from "../Router/Router";
import Container from "../Containers/Container";

const App: React.FC = () => {
	return (
		<div className="app">
			<BrowserRouter>
				<Container>
					<Header />

					<Router />
				</Container>
			</BrowserRouter>
		</div>
	);
};

export default App;
