import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { INewMonitor } from "../../models/types";
import { OptionType, Select } from "../../components/";
import { HTTPS_PORT, IMAPS_PORT, POPS_PORT, SMTPS_PORT } from "../../constants/monitors";
import { ValidationMessage, Button } from "../../components";
import { combineClassNames } from "../../utils";
import { fullTrim, minLength, maxLength, isValidDomainName, isValidPort } from "../validators";

const typeOptions: OptionType[] = [
	{ value: "https", label: "https" },
	{ value: "smtps", label: "smtps" },
	{ value: "pops", label: "pops" },
	{ value: "imaps", label: "imaps" },
	{ value: "custom", label: "custom" },
];

interface IMonitorFormProps {
	onSubmit: (monitor: INewMonitor) => void;
	onCancel: () => void;
	submitting: boolean;
}

export const MonitorForm: React.FC<IMonitorFormProps> = ({ onSubmit, onCancel, submitting }) => {
	const { register, handleSubmit, errors, setValue, watch, formState } = useForm<INewMonitor>({
		defaultValues: { port: HTTPS_PORT },
	});
	const [selectedType, setSelectedType] = useState<OptionType>();

	const port = Number(watch("port"));

	useEffect(() => {
		switch (port) {
			case HTTPS_PORT:
				setSelectedType(typeOptions[0]);
				break;
			case SMTPS_PORT:
				setSelectedType(typeOptions[1]);
				break;
			case POPS_PORT:
				setSelectedType(typeOptions[2]);
				break;
			case IMAPS_PORT:
				setSelectedType(typeOptions[3]);
				break;
			default:
				setSelectedType(typeOptions[4]);
		}
	}, [port]);

	const handleTypeChange = (type: OptionType) => {
		switch (type.value) {
			case "https":
				setValue("port", HTTPS_PORT);
				break;
			case "smtps":
				setValue("port", SMTPS_PORT);
				break;
			case "pops":
				setValue("port", POPS_PORT);
				break;
			case "imaps":
				setValue("port", IMAPS_PORT);
				break;
		}
		setSelectedType(type);
	};

	return (
		<form className="new-monitor-form form" onSubmit={handleSubmit(onSubmit)}>
			<div className="displayName-input form-item">
				<label htmlFor="displayName">
					<span>Name</span>
					<ValidationMessage inputName="displayName" errors={errors} />
				</label>

				<input
					name="displayName"
					className={combineClassNames("text-input display-name", { error: errors.displayName })}
					type="text"
					autoFocus
					autoComplete="off"
					maxLength={30}
					ref={register({
						required: "Name is required.",
						validate: {
							validateDisplayName: (value: string) => {
								const trimValue = fullTrim(value);

								if (minLength(trimValue, 2)) {
									return "Name must be at least 2 characters long.";
								}
								if (maxLength(trimValue, 20)) {
									return "Name can be at most 20 characters long.";
								}

								return true;
							},
						},
					})}
				/>
			</div>

			<div className="host-block">
				<div className="protocol-input form-item">
					<label htmlFor="protocol">
						<span>Protocol</span>
					</label>

					<Select
						onChange={handleTypeChange}
						options={typeOptions}
						value={selectedType}
						defaultValue={typeOptions[0]}
					/>
				</div>

				<div className="host-input form-item">
					<label htmlFor="domainName">
						<span>Domain name</span>
						<ValidationMessage inputName="domainName" errors={errors} />
					</label>

					<input
						name="domainName"
						className={combineClassNames("text-input domain-name", { error: errors.domainName })}
						type="text"
						autoComplete="off"
						ref={register({
							required: "Domain name is required.",
							validate: {
								validateDomainName: (value: string) => {
									if (minLength(value, 4)) {
										return "Domain name must be at least 4 characters long.";
									}
									if (maxLength(value, 30)) {
										return "Domain name can be at most 30 characters long.";
									}
									if (isValidDomainName(value)) {
										return "Please specify a valid domain name without protocol.";
									}

									return true;
								},
							},
						})}
					/>
				</div>

				<div className="port-input form-item">
					<label htmlFor="port">
						<span>Port</span>
						<ValidationMessage inputName="port" errors={errors} />
					</label>

					<input
						name="port"
						className={combineClassNames("text-input port", { error: errors.port })}
						type="text"
						autoComplete="off"
						maxLength={5}
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

			<div className="modal-actions">
				<Button className="modal-btn cancel-btn" onClick={onCancel} text="Cancel" />
				<Button
					className="modal-btn ok-btn create-btn"
					text="Create"
					type="submit"
					disabled={!formState.isDirty || (formState.submitCount > 0 && !formState.isValid)}
					loading={submitting}
				/>
			</div>
		</form>
	);
};
