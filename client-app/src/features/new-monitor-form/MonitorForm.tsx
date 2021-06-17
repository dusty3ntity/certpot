import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { INewMonitor } from "../../models/types";
import { OptionType, Select } from "../../components/";
import { HTTPS_PORT, IMAPS_PORT, POPS_PORT, SMTPS_PORT } from "../../constants/monitors";
import { ValidationMessage, Button } from "../../components";
import { combineClassNames } from "../../utils";
import { fullTrim, isValidPort, DOMAIN_NAME_REGEX, USERNAME_BEGINS_WITH_A_LETTER_REGEX } from "../validators";

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
	const validationSchema: Yup.SchemaOf<INewMonitor> = Yup.object().shape({
		displayName: Yup.string()
			.required("Name is required.")
			.transform(fullTrim)
			.min(2, "Name must be at least 2 characters long.")
			.max(20, "Name can be at most 20 characters long.")
			.matches(USERNAME_BEGINS_WITH_A_LETTER_REGEX, "Name must begin with a letter."),
		domainName: Yup.string()
			.required("Domain name is required.")
			.min(4, "Domain name must be at least 4 characters long.")
			.max(40, "Domain name can be at most 30 characters long.")
			.matches(DOMAIN_NAME_REGEX, "Please specify a valid domain name without protocol."),
		port: Yup.number()
			.typeError("Port must be a number.")
			.required("Port is required.")
			.test("is-valid-port", "Port must be in range: 1-65535.", isValidPort),
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, submitCount, isDirty, isValid },
	} = useForm<INewMonitor>({
		defaultValues: { port: HTTPS_PORT },
		resolver: yupResolver(validationSchema),
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
					id="displayName"
					className={combineClassNames("text-input display-name", { error: errors.displayName })}
					type="text"
					autoFocus
					autoComplete="off"
					maxLength={30}
					{...register("displayName")}
				/>
			</div>

			<div className="host-block">
				<div className="protocol-input form-item">
					<label htmlFor="protocol">
						<span>Protocol</span>
					</label>

					<Select
						id="protocol"
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
						id="domainName"
						className={combineClassNames("text-input domain-name", { error: errors.domainName })}
						type="text"
						autoComplete="off"
						{...register("domainName")}
					/>
				</div>

				<div className="port-input form-item">
					<label htmlFor="port">
						<span>Port</span>
						<ValidationMessage inputName="port" errors={errors} />
					</label>

					<input
						id="port"
						className={combineClassNames("text-input port", { error: errors.port })}
						type="string"
						autoComplete="off"
						maxLength={5}
						{...register("port")}
					/>
				</div>
			</div>

			<div className="modal-actions">
				<Button className="modal-btn cancel-btn" onClick={onCancel} text="Cancel" />
				<Button
					className="modal-btn ok-btn create-btn"
					text="Create"
					type="submit"
					disabled={!isDirty || (submitCount > 0 && !isValid)}
					loading={submitting}
				/>
			</div>
		</form>
	);
};
