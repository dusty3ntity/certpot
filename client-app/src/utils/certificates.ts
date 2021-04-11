import punycode from "punycode";
import moment from "moment";

import { ICertificate, ExpirationSeverityEnum } from "../models/types/certificates";

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
	const duration = moment.duration(moment(certificate.validTo).diff(moment()));
	const daysBetween = Math.ceil(duration.asDays());
	const daysLeft = daysBetween < 0 ? 0 : daysBetween;

	const severity = getExpirationSeverity(daysBetween);
	let daysLeftString: string;

	if (severity === ExpirationSeverityEnum.EXPIRED) {
		daysLeftString = "expired";
	} else {
		daysLeftString = daysLeft === 1 ? daysLeft + " day" : daysLeft + " days";
	}

	return { value: daysBetween, label: daysLeftString, severity };
};

export const getExpiresInTime = (certificate: ICertificate) => {
	const duration = moment.duration(moment(certificate.validTo).diff(moment()));
	const expired = duration.minutes() < 0;
	const severity = getExpirationSeverity(Number(Math.floor(duration.asDays())));
	const time = {
		days: Math.floor(Math.abs(duration.asDays())),
		hours: Math.abs(duration.hours()),
		minutes: Math.abs(duration.minutes()),
	};

	return { ...time, expired, severity };
};
