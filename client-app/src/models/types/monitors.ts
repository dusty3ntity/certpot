import { ICertificate } from "./certificates";

export interface IMonitor {
	id: string;
	displayName: string;
	domainName: string;
	port: number;
	creationDate: Date;
	certificate: ICertificate;
	autoRenewalEnabled?: boolean;
	lastCheckDate?: Date;
}

export interface INewMonitor {
	displayName: string;
	domainName: string;
	port: number;
}

export enum AutoRenewalStatusEnum {
	ACTIVE = "active",
	DISABLED = "disabled",
}
