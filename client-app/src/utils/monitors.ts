import { IMonitor } from "../models/types/monitors";

export const mapMonitorDates = (monitor: IMonitor): IMonitor => {
	const newMonitor: IMonitor = {
		...monitor,
		creationDate: new Date(monitor.creationDate),
		lastCheckDate: monitor.lastCheckDate ? new Date(monitor.lastCheckDate) : undefined,
		certificate: {
			...monitor.certificate,
			validFrom: new Date(monitor.certificate.validFrom),
			validTo: new Date(monitor.certificate.validTo),
		},
	};

	return newMonitor;
};
