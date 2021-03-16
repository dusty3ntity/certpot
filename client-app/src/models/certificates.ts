export interface ICertificate {
	id: string;
	subjectCommonName: string;
	subjectOrganization: string | null;
	issuerCommonName: string;
	issuerOrganization: string | null;
	validFrom: Date;
	validTo: Date;
	version: number;
	serialNumber: string;
}
