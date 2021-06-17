export const DOMAIN_NAME_REGEX =
	/^(?:[\p{L}0-9](?:[\p{L}0-9-]{0,61}[\p{L}0-9])?\.)+[\p{L}0-9][\p{L}0-9-]{0,61}[\p{L}0-9]$/gu;
export const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

export const PASSWORD_CONTAINS_NUMERIC_REGEX = /[0-9]/;

export const USERNAME_BEGINS_WITH_A_LETTER_REGEX = /^[A-Za-z]/;
export const USERNAME_CONTAINS_ONLY_ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]{2,}$/;

export const PORT_MIN_VALUE = 1;
export const PORT_MAX_VALUE = 65535;

export const fullTrim = (_: string, originalValue: string): string => {
	return originalValue.replace(/\s+/g, " ").trim();
};

export const isValidPort = (value?: number): boolean => {
	if (!value) {
		return false;
	}

	return value >= PORT_MIN_VALUE && value <= PORT_MAX_VALUE;
};

export const isValidThreshold = (value?: number): boolean => {
	console.log("threshold", value);
	if (!value) {
		return false;
	}

	return value >= 1 && value <= 7;
};

export const isValidDomainName = (value?: string): boolean => {
	if (!value) {
		return false;
	}

	return DOMAIN_NAME_REGEX.test(value);
};

export const isValidIpAddress = (value?: string): boolean => {
	if (!value) {
		return false;
	}

	return IP_ADDRESS_REGEX.test(value);
};

export const isValidHostName = (value?: string): boolean => {
	return isValidDomainName(value) || isValidIpAddress(value);
};

export const isValidPrivateKey = (value?: string): boolean => {
	if (!value) {
		return true;
	}

	return value.startsWith("-----BEGIN OPENSSH PRIVATE KEY-----") && value.endsWith("-----END OPENSSH PRIVATE KEY-----");
};
