import React, { useEffect, useState } from "react";

import { CrossIcon, TickIcon, Tooltip } from "../../../../components";
import { EXPIRY_UPDATE_INTERVAL } from "../../../../constants/time";
import { IMonitor, ITabProps } from "../../../../models/types";
import { getExpiresInTime, combineClassNames, normalizeDomainName, defaultFormat } from "../../../../utils";

export const InfoTab: React.FC<ITabProps> = ({ data }) => {
	const monitor = data as IMonitor;
	const { certificate } = monitor;
	const [expiry, setExpiry] = useState(getExpiresInTime(monitor.certificate));

	useEffect(() => {
		const interval = setInterval(() => {
			setExpiry(getExpiresInTime(certificate));
		}, EXPIRY_UPDATE_INTERVAL);

		return () => {
			clearInterval(interval);
		};
	}, [certificate]);

	return (
		<div className="info-tab tab-content">
			<div className="row status-row">
				<div className={combineClassNames("block status-block", `${expiry.severity}-severity`)}>
					{expiry.expired ? <CrossIcon /> : <TickIcon />}
					<div className="col time-col days">
						<span className="value">{expiry.days}</span>
						<span className="caption">Days</span>
					</div>

					<div className="col time-col hours">
						<span className="value">{expiry.hours}</span>
						<span className="caption">Hours</span>
					</div>

					<div className="col time-col minutes">
						<span className="value">{expiry.minutes}</span>
						<span className="caption">Mins</span>
					</div>

					<div className="col status">
						<span>{expiry.expired ? "expired" : "active"}</span>
					</div>
				</div>

				<div className="block expiration-block">
					<div className="col">
						<span className="title">Issued On</span>
						<span className="value">{defaultFormat(certificate.validFrom)}</span>
					</div>
					<div className="col">
						<span className="title">{expiry.expired ? "Expired On" : "Expires On"}</span>
						<span className="value">{defaultFormat(certificate.validTo)}</span>
					</div>
				</div>
			</div>

			<div className="row info-row">
				<div className="block monitor-info-block">
					<span className="block-title">Monitor</span>

					<div className="block-content">
						<span>Name:</span>
						<span>{monitor.displayName}</span>

						<span>Domain name:</span>
						<span>{monitor.domainName}</span>

						<span>Port:</span>
						<span>{monitor.port}</span>

						<span>Last check:</span>
						<span>{monitor.lastCheckDate ? defaultFormat(monitor.lastCheckDate) : "-"}</span>
					</div>
				</div>

				<div className="block certificate-subject-block">
					<span className="block-title">Certificate Subject</span>

					<div className="block-content">
						<span>Common name:</span>
						<span>
							<Tooltip text={certificate.subjectCommonName} position="top" interactive>
								{normalizeDomainName(certificate.subjectCommonName)}
							</Tooltip>
						</span>

						<span>Organization:</span>
						<span>{certificate.subjectOrganization ?? "-"}</span>
					</div>
				</div>

				<div className="block certificate-issuer-block">
					<span className="block-title">Certificate Issuer</span>

					<div className="block-content">
						<span>Common name:</span>
						<span>{certificate.issuerCommonName}</span>

						<span>Organization:</span>
						<span>{certificate.issuerOrganization ?? "-"}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
