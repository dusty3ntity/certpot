import React from "react";

import Page from "../Containers/Page";
import Button from "../Common/Inputs/Button";
import MonitorsTable from "./MonitorsTable";

import { monitors } from "../../__mocks__/monitors";

const MonitorsListPage: React.FC = () => {
	return (
		<Page id="monitors-list-page">
			<div className="top-panel">
				<h2 className="title">Monitors List</h2>

				<Button text="ADD" className="add-btn" primary />
			</div>

			<div className="table-wrapper">
				<MonitorsTable monitors={monitors} />
			</div>
		</Page>
	);
};

export default MonitorsListPage;
