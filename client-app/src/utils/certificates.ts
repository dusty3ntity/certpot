import punycode from "punycode";
import { formatDistanceStrict, isBefore } from "date-fns";

import { ICertificate, ExpirationSeverityEnum } from "../models/certificates";

export const normalizeDomainName = (domainName: string): string => {
	return domainName.includes("xn--") ? punycode.toUnicode(domainName) : domainName;
};

export const getExpirationSeverity = (daysLeft: number): ExpirationSeverityEnum => {
	if (daysLeft < 0) {
		return ExpirationSeverityEnum.EXPIRED;
	} else if (daysLeft <= 7) {
		return ExpirationSeverityEnum.HIGH;
	} else if (daysLeft <= 30) {
		return ExpirationSeverityEnum.MODERATE;
	}

	return ExpirationSeverityEnum.LOW;
};

export const getExpiresInValue = (certificate: ICertificate) => {
	const daysBetween = Number(formatDistanceStrict(certificate.validTo, new Date(), { unit: "day" }).split(" ")[0]);
	const daysLeft = isBefore(certificate.validTo, new Date()) ? -daysBetween : daysBetween;

	const severity = getExpirationSeverity(Number(daysLeft));
	let daysLeftString: string;

	if (severity === ExpirationSeverityEnum.EXPIRED) {
		daysLeftString = "expired";
	} else {
		daysLeftString = daysLeft === 1 ? daysLeft + " day" : daysLeft + " days";
	}

	return { value: daysLeft, label: daysLeftString, severity };
};
