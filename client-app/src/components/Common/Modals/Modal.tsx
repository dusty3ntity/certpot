import React, { ReactElement, useEffect, useState } from "react";

import { IComponentProps } from "../../../models/components";
import { combineClassNames } from "../../../utils/classNames";
import Button from "../Inputs/Button";

export interface IModalProps extends IComponentProps {
	onOk: (...params: any[]) => void;
	onCancel: () => void;
	title: string;
	content: ReactElement | React.ComponentType;
	okText: string;
}

const Modal: React.FC<IModalProps> = ({ id, className, onOk, onCancel, title, content, okText, ...props }) => {
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

	return (
		<div id={id} className={combineClassNames("modal", className, { initial: !animating })} {...props}>
			<div className="modal-mask" onClick={() => handleClick(onCancel)} />
			<div className="modal-content">
				<div className="modal-title">{title}</div>

				<div className="modal-body">{content}</div>

				<div className="modal-actions">
					<Button className="modal-btn cancel-btn" onClick={() => handleClick(onCancel)} text="Cancel" />
					<Button
						className={combineClassNames("modal-btn ok-btn", `${okText.toLowerCase()}-btn`)}
						onClick={() => handleClick(onOk)}
						text={okText}
					/>
				</div>
			</div>
		</div>
	);
};

export default Modal;
