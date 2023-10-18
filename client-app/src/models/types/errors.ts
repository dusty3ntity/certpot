import { AxiosError } from "axios";

export enum ErrorType {
	UnknownNetworkError = 1,

	UnknownNotFound = 11,
	UserNotFound = 12,
	MonitorNotFound = 13,

	UnknownServerError = 51,
	SavingChangesError = 52,

	UnknownValidationError = 101,
	BadId = 102,

	UnknownAuthenticationError = 161,
	Unauthorized = 162,
	InvalidEmail = 163,
	InvalidPassword = 164,

	TokenExpired = 171,
	RefreshTokenExpired = 172,

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
	code: number | undefined;
	isUnknown: boolean;
	wasHandled: boolean;

	constructor(originalError: AxiosError, code: number, isUnknown: boolean, wasHandled: boolean) {
		super();
		this.code = code;
		this.isUnknown = isUnknown;
		this.wasHandled = wasHandled;

		const request = originalError.request;

		if (request && !request.data.errors.code) {
			this.injectCode(originalError, code);
		}
		this.originalError = originalError;
	}

	public getResponse() {
		return this.originalError.response;
	}

	private injectCode = (error: AxiosError, code: ErrorType) => {
		const body = error.response!.data.errors;
		error.response!.data.errors = {
			code: code,
			body: body,
		};
	};
}

export class NetworkError extends ApiError {
	constructor(originalError: AxiosError, wasHandled: boolean) {
		super(originalError, ErrorType.UnknownNetworkError, true, wasHandled);
	}
}

export class ServerError extends ApiError {
	constructor(originalError: AxiosError, wasHandled: boolean, code?: number) {
		super(originalError, code ?? ErrorType.UnknownServerError, !code, wasHandled);
	}
}

export class AuthenticationError extends ApiError {
	constructor(originalError: AxiosError, wasHandled: boolean, code?: number) {
		super(originalError, code ?? ErrorType.UnknownAuthenticationError, !code, wasHandled);
	}
}

export class ValidationError extends ApiError {
	constructor(originalError: AxiosError, wasHandled: boolean, code?: number) {
		super(originalError, code ?? ErrorType.UnknownValidationError, !code, wasHandled);
	}
}

export class NotFoundError extends ApiError {
	constructor(originalError: AxiosError, wasHandled: boolean, code?: number) {
		super(originalError, code ?? ErrorType.UnknownNotFound, !code, wasHandled);
	}
}

export enum NotificationType {
	Info = "info",
	Success = "success",
	Warning = "warning",
	Error = "error",
	UnknownError = "unknown-error",
}
