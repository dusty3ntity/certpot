import React from "react";
import { useForm } from "react-hook-form";

import { combineClassNames } from "../../../../utils/classNames";
import { ISshCredentials } from "../../../../models/types";
import { Tooltip, ValidationMessage, Button } from "../../../../components";
import { fullTrim, isValidHostName, isValidPort, isValidPrivateKey, maxLength, minLength } from "../../../../features";

interface ISshFormProps {
	credentials: ISshCredentials;
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
	const {
		register,
		handleSubmit,
		getValues,
		errors,
		formState: { isDirty, isValid },
	} = useForm<ISshCredentials>({
		defaultValues: credentials,
		mode: "onChange",
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
						name="sshHostname"
						className={combineClassNames("text-input", { error: errors.sshHostname })}
						type="text"
						autoFocus
						autoComplete="off"
						maxLength={30}
						ref={register({
							required: "Hostname is required.",
							validate: {
								hostname: (value: string) => {
									return isValidHostName(value) ? true : "The hostname is not valid.";
								},
							},
						})}
					/>
				</div>

				<div className="port-input form-item">
					<label htmlFor="ssh-port">
						<span>Port</span>
						<ValidationMessage inputName="sshPort" errors={errors} />
					</label>

					<input
						id="ssh-port"
						name="sshPort"
						className={combineClassNames("text-input port", { error: errors.sshPort })}
						type="text"
						autoComplete="off"
						maxLength={5}
						defaultValue={22}
						ref={register({
							required: "Port is required.",
							validate: {
								validatePort: (value: string) => {
									if (isValidPort(value)) {
										return "Port must be in range: 1-65535.";
									}

									return true;
								},
							},
						})}
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
						name="sshUsername"
						className={combineClassNames("text-input", { error: errors.sshUsername })}
						type="text"
						autoComplete="off"
						maxLength={30}
						ref={register({
							required: "Username is required.",
							validate: {
								username: (value: string) => {
									const trimValue = fullTrim(value);

									if (minLength(trimValue, 1)) {
										return "Username must be at least 1 character long.";
									}
									if (maxLength(trimValue, 20)) {
										return "Username can be at most 20 characters long.";
									}

									return true;
								},
							},
						})}
					/>
				</div>

				<div className="password-input form-item">
					<label htmlFor="ssh-password">
						<span>Password (optional)</span>
						<ValidationMessage inputName="sshPassword" errors={errors} />
					</label>

					<input
						id="ssh-password"
						name="sshPassword"
						className={combineClassNames("text-input", { error: errors.sshPassword })}
						type="password"
						maxLength={40}
						ref={register({
							validate: (value: string) => {
								if (value.length === 0) {
									return true;
								}

								if (minLength(value, 1)) {
									return "Password must be at least 1 character long.";
								}
								if (maxLength(value, 30)) {
									return "Password can be at most 30 characters long.";
								}

								return true;
							},
						})}
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
					name="sshPrivateKey"
					className={combineClassNames("text-input text-area private-key", { error: errors.sshPrivateKey })}
					autoComplete="off"
					rows={20}
					ref={register({
						validate: {
							privateKey: (value: string) => {
								if (value.length === 0) {
									return true;
								}

								return isValidPrivateKey(value);
							},
						},
					})}
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
