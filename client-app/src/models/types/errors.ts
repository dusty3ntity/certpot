import { AxiosError } from "axios";

import { injectErrorCode } from "../../utils";

export enum ErrorType {
	DefaultNetworkError = 1,

	DefaultNotFound = 11,
	MonitorNotFound = 12,

	DefaultServerError = 51,
	SavingChangesError = 52,

	DefaultValidationError = 101,
	BadId = 102,

	DefaultAuthenticationError = 161,
	Unauthorized = 162,
	InvalidEmail = 163,
	InvalidPassword = 164,

	RefreshTokenExpired = 171,

	HostConnectionTimeout = 701,
	CertificateParsingError = 702,

	SshConnectionError = 751,
	SshKeyParsingError = 752,
	SshAuthenticationError = 753,
	SshChannelOpeningError = 754,
	SshCommandExecutionError = 755,
	SshChannelTimeout = 756,

	SshConnectionTestingTimeout = 760,

	CertificateWasNotChanged = 777,

	DuplicateEmailFound = 901,
	DuplicateUsernameFound = 902,

	Unknown = 9999,
}

export class ApiError extends Error {
	originalError: AxiosError;
	errorCode: number | undefined;
	wasHandled: boolean;

	constructor(originalError: AxiosError, errorCode?: number, wasHandled?: boolean) {
		super();
		this.errorCode = errorCode ?? ErrorType.Unknown;
		this.wasHandled = wasHandled ?? false;

		if (!originalError.request!.data.errors.code) {
			injectErrorCode(originalError, this.errorCode);
		}
		this.originalError = originalError;
	}

	public getErrorBody() {
		return this.originalError.response;
	}
}

export class NetworkError extends ApiError {
	constructor(originalError: AxiosError) {
		super(originalError, ErrorType.DefaultNetworkError, true);
	}
}

export class ServerError extends ApiError {
	constructor(originalError: AxiosError, errorCode?: number) {
		super(originalError, errorCode ?? ErrorType.DefaultServerError, true);
	}
}

export class AuthenticationError extends ApiError {
	constructor(originalError: AxiosError, errorCode?: number) {
		super(originalError, errorCode ?? ErrorType.DefaultAuthenticationError, true);
	}
}

export class ValidationError extends ApiError {
	constructor(originalError: AxiosError, errorCode?: number) {
		super(originalError, errorCode ?? ErrorType.DefaultValidationError, true);
	}
}

export class NotFoundError extends ApiError {
	constructor(originalError: AxiosError, errorCode?: number) {
		super(originalError, errorCode ?? ErrorType.DefaultNotFound, true);
	}
}

export enum NotificationType {
	Info = "info",
	Success = "success",
	Warning = "warning",
	Error = "error",
	UnknownError = "unknown-error",
}
