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
	lastRenewalDate?: Date;

	isRenewing: boolean;
	isInRenewalQueue: boolean;

	wasRenewalSuccessful?: boolean;
	renewalErrorCode?: boolean;

	sshCredentials?: ISshCredentials;
	renewalScript?: string;
	renewalLogs?: ISshLogs;
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

export type ISshLog = { type: "input" | "output"; text: string };
export type ISshLogs = ISshLog[];
