import React from "react";

import { ITabProps } from "../../../models";
import { Button, DeleteIcon, EditIcon } from "../../../components";
import { defaultFormatWithTime } from "../../../utils";

const secrets = [
	{ id: "id1", key: "VPS_USERNAME", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
	{ id: "id2", key: "VPS_PASSWORD", lastUpdatedDate: new Date() },
];

export const SecretsTab: React.FC<ITabProps> = () => {
	return (
		<div className="secrets-tab tab-content">
			<div className="secrets-container">
				{secrets.map((secret) => (
					<div className="secret-container" key={secret.id}>
						<span className="secret-key">{secret.key}</span>
						<span className="updated-on">Updated on {defaultFormatWithTime(secret.lastUpdatedDate)}</span>

						<div className="actions-container">
							<Button className="update-btn" icon={<EditIcon />} onClick={() => console.log("Updating ", secret.id)} />
							<Button
								className="remove-btn"
								icon={<DeleteIcon />}
								onClick={() => console.log("Removing ", secret.id)}
							/>
						</div>
					</div>
				))}
			</div>

			<div className="new-secret-container">
				<Button className="new-secret-btn" text="New secret" />
			</div>
		</div>
	);
};
