export const fullTrim = (value: string): string => {
	return value.replace(/\s+/g, " ").trim();
};

export const minLength = (value: string, length: number): string => {
	if (value.length < length) return "String is too short.";
	return "";
};

export const maxLength = (value: string, length: number): string => {
	if (value.length > length) return "String is too long.";
	return "";
};

export const isValidPort = (value: string): string => {
	const port = Number(value);
	const isNumber = Number.isInteger(port);
	if (!isNumber) {
		return "Port must be a number";
	}

	if (port < 1 || port > 65535) {
		return "Port must be in range: 1-65535";
	}

	return "";
};

export const isValidThreshold = (value: string): string => {
	const threshold = Number(value);
	const isNumber = Number.isInteger(threshold);
	if (!isNumber) {
		return "Threshold must be a number";
	}

	if (threshold < 1 || threshold > 7) {
		return "Threshold must be in range: 1-7";
	}

	return "";
};

export const isValidDomainName = (value: string): string => {
	const re = /^(?:[\p{L}0-9](?:[\p{L}0-9-]{0,61}[\p{L}0-9])?\.)+[\p{L}0-9][\p{L}0-9-]{0,61}[\p{L}0-9]$/gu;
	const result = re.test(value);

	if (!result) {
		return "Domain name is not valid";
	}

	return "";
};

export const isValidIpAddress = (value: string): string => {
	const re = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
	const result = re.test(value);

	if (!result) {
		return "IP address is not valid";
	}

	return "";
};

export const isValidHostName = (value: string): boolean => {
	return !isValidDomainName(value) || !isValidIpAddress(value);
};

export const isValidPrivateKey = (value: string): boolean => {
	return value.startsWith("-----BEGIN OPENSSH PRIVATE KEY-----") && value.endsWith("-----END OPENSSH PRIVATE KEY-----");
};

export const isValidEmail = (value: string): string => {
	const re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const result = re.test(value);

	if (result) return "";
	else return "Email is not valid.";
};

export const isValidPassword = (value: string): string => {
	const re = /[0-9]/;
	const result = re.test(value);

	if (result) return "";
	else return "Password is not valid.";
};

export const isValidUsername = (value: string): string => {
	const re1 = /^[A-Za-z]/;
	let result = re1.test(value);

	if (!result) return "Username must begin with a letter.";

	const re2 = /^[a-zA-Z0-9]{2,}$/;
	result = re2.test(value);

	if (result) return "";
	else return "Username must contain only alphanumeric.";
};
