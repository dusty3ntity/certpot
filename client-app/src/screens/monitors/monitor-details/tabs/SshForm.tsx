import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { combineClassNames } from "../../../../utils/classNames";
import { ISshCredentials } from "../../../../models/types";
import { Tooltip, ValidationMessage, Button } from "../../../../components";
import {
	fullTrim,
	isValidHostName,
	isValidPort,
	isValidPrivateKey,
	USERNAME_CONTAINS_ONLY_ALPHANUMERIC_REGEX,
} from "../../../../features";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

interface ISshFormProps {
	credentials?: ISshCredentials;
	onSubmit: (data: ISshCredentials) => void;
	onTestConnection: (data: ISshCredentials) => void;
	submitting: boolean;
	testingConnection: boolean;
}

export const SshForm: React.FC<ISshFormProps> = ({
	credentials,
	onSubmit,
	submitting,
	onTestConnection,
	testingConnection,
}) => {
	useEffect(() => {
		console.log(credentials);
	});

	const validationSchema: Yup.SchemaOf<ISshCredentials> = Yup.object().shape({
		sshHostname: Yup.string()
			.required("Hostname is required.")
			.test("is-valid-hostname", "The hostname is not valid.", isValidHostName),
		sshUsername: Yup.string()
			.required("Username is required.")
			.transform(fullTrim)
			.min(1, "Username must be at least 1 character long.")
			.max(20, "Username can be at most 20 characters long.")
			.matches(USERNAME_CONTAINS_ONLY_ALPHANUMERIC_REGEX, "Username must contain only alphanumeric."),
		sshPort: Yup.number()
			.typeError("Port must be a number.")
			.required("Port is required.")
			.test("is-valid-port", "Port must be in range: 1-65535.", isValidPort),
		sshPassword: Yup.string()
			.notRequired()
			.min(1, "Password must be at least 1 character long.")
			.max(30, "Password can be at most 30 characters long."),
		sshPrivateKey: Yup.string()
			.notRequired()
			.test("is-valid-private-key", "The private key is not valid.", isValidPrivateKey),
	});

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isDirty, isValid },
	} = useForm<ISshCredentials>({
		defaultValues: credentials,
		mode: "onChange",
		resolver: yupResolver(validationSchema),
	});

	const processFormData = (data: ISshCredentials) => {
		if (!data.sshPassword) {
			data.sshPassword = undefined;
		}
		if (!data.sshPrivateKey) {
			data.sshPrivateKey = undefined;
		}

		return data;
	};

	const handleTestConnection = () => {
		onTestConnection(processFormData(getValues()));
	};

	return (
		<form id="ssh-credentials-form" className="form" onSubmit={handleSubmit((data) => onSubmit(processFormData(data)))}>
			<div className="host-container">
				<div className="hostname-input form-item">
					<label htmlFor="ssh-hostname">
						<span>Hostname</span>
						<ValidationMessage inputName="sshHostname" errors={errors} />
					</label>

					<input
						id="ssh-hostname"
						className={combineClassNames("text-input", { error: errors.sshHostname })}
						type="text"
						autoFocus
						autoComplete="off"
						maxLength={30}
						{...register("sshHostname")}
					/>
				</div>

				<div className="port-input form-item">
					<label htmlFor="ssh-port">
						<span>Port</span>
						<ValidationMessage inputName="sshPort" errors={errors} />
					</label>

					<input
						id="ssh-port"
						className={combineClassNames("text-input port", { error: errors.sshPort })}
						type="string"
						autoComplete="off"
						maxLength={5}
						defaultValue={22}
						{...register("sshPort")}
					/>
				</div>
			</div>

			<div className="user-container">
				<div className="username-input form-item">
					<label htmlFor="ssh-username">
						<span>Username</span>
						<ValidationMessage inputName="sshUsername" errors={errors} />
					</label>

					<input
						id="ssh-username"
						className={combineClassNames("text-input", { error: errors.sshUsername })}
						type="text"
						autoComplete="off"
						maxLength={30}
						{...register("sshUsername")}
					/>
				</div>

				<div className="password-input form-item">
					<label htmlFor="ssh-password">
						<span>Password (optional)</span>
						<ValidationMessage inputName="sshPassword" errors={errors} />
					</label>

					<input
						id="ssh-password"
						className={combineClassNames("text-input", { error: errors.sshPassword })}
						type="password"
						maxLength={40}
						{...register("sshPassword")}
					/>
				</div>
			</div>

			<div className="private-key-input form-item">
				<label htmlFor="private-key">
					<Tooltip text="OpenSSH private key" position="top-start">
						<span>Private key (optional)</span>
					</Tooltip>

					<ValidationMessage inputName="sshPrivateKey" errors={errors} />
				</label>

				<textarea
					id="private-key"
					className={combineClassNames("text-input text-area private-key", { error: errors.sshPrivateKey })}
					autoComplete="off"
					rows={20}
					{...register("sshPrivateKey")}
				/>
			</div>

			<div className="actions-container">
				<Button
					className="submit-btn"
					text="Save"
					type="submit"
					disabled={!isDirty || !isValid || testingConnection}
					loading={submitting}
				/>
				<Button
					className="test-connection-btn"
					onClick={handleTestConnection}
					text="Test connection"
					disabled={!isDirty || !isValid || submitting}
					loading={testingConnection}
				/>
			</div>
		</form>
	);
};
