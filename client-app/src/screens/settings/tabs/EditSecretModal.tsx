import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { IConcreteModalProps, IEditUserSecret } from "../../../models/types";
import { useAppDispatch } from "../../../store";
import { combineClassNames, createNotification } from "../../../utils";
import { RootStateType } from "../../../models/rootReducer";
import { ErrorType, NotificationType } from "../../../models/types/errors";
import { EditSecretForm } from "./EditSecretForm";
import { editSecret } from "../../../models/user/userSlice";

export const EditSecretModal: React.FC<IConcreteModalProps & { id: string }> = ({ id, onOk, onCancel }) => {
	const [animating, setAnimating] = useState(false);
	const dispatch = useAppDispatch();

	const { editingSecret } = useSelector((state: RootStateType) => state.user);

	useEffect(() => {
		setTimeout(() => {
			setAnimating(true);
		}, 20);
	}, []);

	const handleClick = (func: () => void) => {
		setAnimating(false);
		setTimeout(func, 300);
	};

	const handleNewMonitorSubmit = (secret: IEditUserSecret) => {
		dispatch(editSecret({ id, secret }))
			.then(unwrapResult)
			.then(onOk)
			.then(() => createNotification(NotificationType.Success, { message: "Secret updated successfully!" }))
			.catch((err) => {
				if (err.code < ErrorType.DefaultErrorsBlockEnd) {
					return;
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.body,
						errorOrigin: "[editSecretModal]~editSecret",
					});
				}
			});
	};

	return (
		<div className={combineClassNames("modal edit-secret-modal", { initial: !animating })}>
			<div className="modal-mask" onClick={() => handleClick(onCancel)} />
			<div className="modal-content">
				<div className="modal-title">Edit Secret</div>

				<EditSecretForm onCancel={onCancel} onSubmit={handleNewMonitorSubmit} submitting={editingSecret} />
			</div>
		</div>
	);
};
