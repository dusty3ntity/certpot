import React, { useEffect, useState } from "react";

import { monitors } from "../../../../__mocks__/monitors";
import { getExpiresInTime, normalizeDomainName } from "../../../../utils/certificates";
import { EXPIRY_UPDATE_INTERVAL } from "../../../../constants/time";
import CrossIcon from "../../../Common/Icons/CrossIcon";
import TickIcon from "../../../Common/Icons/TickIcon";
import { combineClassNames } from "../../../../utils/classNames";
import { defaultFormat } from "../../../../utils/dates";
import Tooltip from "../../../Common/Tooltip";

const InfoTab: React.FC = () => {
	const monitor = monitors[1];
	const { certificate } = monitor;

	const [expiry, setExpiry] = useState(getExpiresInTime(certificate));

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
						<div className="col">
							<span>Name:</span>
							<span>Domain name:</span>
							<span>Port:</span>
						</div>
						<div className="col">
							<span>{monitor.displayName}</span>
							<span>{monitor.domainName}</span>
							<span>{monitor.port}</span>
						</div>
					</div>
				</div>

				<div className="block certificate-subject-block">
					<span className="block-title">Certificate Subject</span>

					<div className="block-content">
						<div className="col">
							<span>Common name:</span>
							<span>Organization:</span>
						</div>
						<div className="col">
							<span>
								<Tooltip text={certificate.subjectCommonName} position="top" interactive>
									{normalizeDomainName(certificate.subjectCommonName)}
								</Tooltip>
							</span>
							<span>{certificate.subjectOrganization}</span>
						</div>
					</div>
				</div>

				<div className="block certificate-issuer-block">
					<span className="block-title">Certificate Issuer</span>

					<div className="block-content">
						<div className="col">
							<span>Common name:</span>
							<span>Organization:</span>
						</div>
						<div className="col">
							<span>{certificate.issuerCommonName}</span>
							<span>{certificate.issuerOrganization}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoTab;
