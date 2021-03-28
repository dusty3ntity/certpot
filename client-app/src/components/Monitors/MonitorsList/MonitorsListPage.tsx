import React from "react";

import Page from "../../Containers/Page";
import Button from "../../Common/Inputs/Button";
import MonitorsTable from "./MonitorsTable";
import { PageTitle } from "../../Common/PageTitle";

import { monitors } from "../../../__mocks__/monitors";
import { createNewMonitorModal } from "../NewMonitorModal";

const MonitorsListPage: React.FC = () => {
	return (
		<>
			<PageTitle title="Monitors" />

			<Page id="monitors-list-page">
				<div className="top-panel">
					<h2 className="title">Monitors List</h2>

					<Button onClick={createNewMonitorModal} text="Add" className="add-btn" primary />
				</div>

				<div className="table-wrapper">
					<MonitorsTable monitors={monitors} />
				</div>
			</Page>
		</>
	);
};

export default MonitorsListPage;
