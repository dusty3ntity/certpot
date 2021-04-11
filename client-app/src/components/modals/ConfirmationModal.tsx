import React from "react";

import { IComponentProps, IConcreteModalProps } from "../../models/types";
import { createModal } from "../../utils";
import { Modal } from "./Modal";

export const createConfirmationModal = (
	content: React.ReactElement,
	confirmText: string,
	onConfirm: () => void,
	options?: IComponentProps
) => {
	createModal(ConfirmationModal, onConfirm, confirmText, content, options);
};

const ConfirmationModal: React.FC<IConcreteModalProps> = ({
	id,
	className,
	onOk,
	onCancel,
	content,
	okText,
	...props
}) => (
	<Modal
		okText={okText!}
		content={content!}
		title="Confirmation"
		onCancel={onCancel}
		onOk={onOk}
		className="confirmation-modal"
		{...props}
	/>
);

export default ConfirmationModal;
