import React from "react";
import ReactDOM from "react-dom";

import { IComponentProps, IConcreteModalProps } from "../models/components";

export const createModal = (
	component: React.ComponentType<IConcreteModalProps>,
	onOk?: (...params: any[]) => void,
	okText?: string,
	content?: React.ReactElement,
	options?: IComponentProps
) => {
	const modalContainer = document.createElement("div");
	document.body.appendChild(modalContainer);

	const handleOk = () => {
		if (onOk) {
			onOk();
		}
		destroyModal();
	};

	const destroyModal = () => {
		const unmountResult = ReactDOM.unmountComponentAtNode(modalContainer);
		if (unmountResult && modalContainer.parentNode) {
			modalContainer.parentNode.removeChild(modalContainer);
		}
	};

	ReactDOM.render(
		React.createElement(component, {
			onOk: handleOk,
			onCancel: destroyModal,
			content,
			okText,
			...options,
		}),
		modalContainer
	);
};
