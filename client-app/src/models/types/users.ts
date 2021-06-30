export type IUser = {
	username: string;
	displayName: string;
	email: string;
} & IUserSettings;

export interface IUserSettings {
	notificationsEmail: string;
	notifyAboutCertificateChange: boolean;
	notifyAboutExpiryIfRenewalConfigured: boolean;
	expiryNotificationThresholdDays: number;
}

export type IUserPayload = {
	username: string;
	displayName: string;
	email: string;

	token: string;
	refreshToken: string;
} & IUserSettings;

export interface IRegisterUser {
	email: string;
	username: string;
	displayName: string;
	password: string;
}

export interface ILoginUser {
	email: string;
	password: string;
}

export interface IUserSecret {
	id: string;
	name: string;
}

export interface INewUserSecret {
	name: string;
	value: string;
}

export interface IEditUserSecret {
	value: string;
}