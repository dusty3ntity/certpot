import React, { useEffect, useState } from "react";

import { IConcreteModalProps } from "../../models/components";
import { INewMonitor } from "../../models/monitors";
import { combineClassNames } from "../../utils/classNames";
import { createModal } from "../../utils/modals";
import MonitorForm from "./MonitorForm";

export const createNewMonitorModal = () => {
	createModal(NewMonitorModal);
};

const NewMonitorModal: React.FC<IConcreteModalProps> = ({ id, className, onOk, onCancel }) => {
	const [animating, setAnimating] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setAnimating(true);
		}, 20);
	}, []);

	const handleClick = (func: () => void) => {
		setAnimating(false);
		setTimeout(func, 300);
	};

	const handleSubmit = (monitor: INewMonitor) => {
		console.log(monitor);
		onOk();
	};

	return (
		<div id={id} className={combineClassNames("modal new-monitor-modal", { initial: !animating })}>
			<div className="modal-mask" onClick={() => handleClick(onCancel)} />
			<div className="modal-content">
				<div className="modal-title">New Monitor</div>

				<MonitorForm onCancel={onCancel} onSubmit={handleSubmit} />
			</div>
		</div>
	);
};

export default NewMonitorModal;
