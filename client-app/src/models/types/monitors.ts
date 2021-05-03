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

	sshCredentials?: ISshCredentials;
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

export interface ISshCredentials {
	sshHostname: string;
	sshPort: number;
	sshUsername: string;
	sshPrivateKey?: string;
	sshPassword?: string;
}
