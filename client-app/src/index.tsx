import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Provider } from "react-redux";

import { App } from "./App";
import { history } from "./config";
import { store } from "./store";

import "react-tippy/dist/tippy.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./styles/styles.scss";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router history={history}>
				<App />
			</Router>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
