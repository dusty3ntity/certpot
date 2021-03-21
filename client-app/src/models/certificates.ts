export interface ICertificate {
	id: string;
	subjectCommonName: string;
	subjectOrganization: string | null;
	issuerCommonName: string;
	issuerOrganization: string;
	validFrom: Date;
	validTo: Date;
	version: number;
	serialNumber: string;
}

export enum ExpirationSeverityEnum {
	LOW = "low",
	MODERATE = "moderate",
	HIGH = "high",
	EXPIRED = "expired",
}
