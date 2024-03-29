import { ErrorType } from "../models/types/errors";
import { IMonitor, ISshLog, ISshLogs } from "../models/types/monitors";

export const mapMonitorDates = (monitor: IMonitor): IMonitor => {
	const newMonitor: IMonitor = {
		...monitor,
		creationDate: new Date(monitor.creationDate),
		lastCheckDate: monitor.lastCheckDate ? new Date(monitor.lastCheckDate) : undefined,
		lastRenewalDate: monitor.lastRenewalDate ? new Date(monitor.lastRenewalDate) : undefined,
		certificate: {
			...monitor.certificate,
			validFrom: new Date(monitor.certificate.validFrom),
			validTo: new Date(monitor.certificate.validTo),
		},
	};

	return newMonitor;
};

export const parseMonitorRenewalLogs = (logs: string): ISshLogs => {
	const result: ISshLog[] = [];

	const tokens = logs.split("\\\\\\\\");
	for (let i = 0; i < tokens.length; i += 2) {
		result.push({ type: "input", text: tokens[i] });

		if (i + 1 < tokens.length) {
			const lines = tokens[i + 1].split("\n");
			lines.forEach((line) => result.push({ type: "output", text: line }));
		}
	}

	return result;
};

export const describeSshErrorCode = (code: ErrorType): string => {
	switch (code) {
		case ErrorType.SshConnectionError:
			return "SSH connection error";
		case ErrorType.SshKeyParsingError:
			return "SSH key parsing error";
		case ErrorType.SshAuthenticationError:
			return "SSH authentication error";
		case ErrorType.SshChannelOpeningError:
			return "Channel opening error";
		case ErrorType.SshCommandExecutionError:
			return "Command execution error";
		case ErrorType.SshChannelTimeout:
			return "Channel timeout";
		case ErrorType.CertificateWasNotChanged:
			return "Certificate wasn't changed";
		default:
			return "Unknown";
	}
};
