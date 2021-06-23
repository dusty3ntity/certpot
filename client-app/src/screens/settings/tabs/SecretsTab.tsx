import React from "react";

import { ITabProps } from "../../../models";
import { Button } from "../../../components";
import { defaultFormatWithTime } from "../../../utils";

const secrets = [
	{ id: "id1", key: "VPS_USERNAME", lastUpdatedDate: new Date() },
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
						<Button className="update-btn" text="Update" onClick={() => console.log("Updating ", secret.id)} />
						<Button className="remove-btn" text="Remove" onClick={() => console.log("Removing ", secret.id)} />
					</div>
				))}
			</div>

			<div className="new-secret-container">
				<Button className="new-secret-btn" text="New secret" />
			</div>
		</div>
	);
};
