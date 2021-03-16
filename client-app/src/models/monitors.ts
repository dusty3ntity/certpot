import { ICertificate } from "./certificates";

export interface IMonitor {
	id: string;
	displayName: string;
	domainName: string;
	port: number;
	creationDate: Date;
	certificate: ICertificate;
}

export interface INewMonitor {
	displayName: string;
	domainName: string;
	port: number;
}
