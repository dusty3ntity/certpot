import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App/App";

import "react-tippy/dist/tippy.css";
import "./styles/styles.scss";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
