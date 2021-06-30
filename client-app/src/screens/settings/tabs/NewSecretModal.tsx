import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { IConcreteModalProps, INewUserSecret } from "../../../models/types";
import { useAppDispatch } from "../../../store";
import { combineClassNames, createNotification } from "../../../utils";
import { RootStateType } from "../../../models/rootReducer";
import { ErrorType, NotificationType } from "../../../models/types/errors";
import { NewSecretForm } from "./NewSecretForm";
import { createSecret } from "../../../models/user/userSlice";

export const NewSecretModal: React.FC<IConcreteModalProps> = ({ onOk, onCancel }) => {
	const [animating, setAnimating] = useState(false);
	const dispatch = useAppDispatch();

	const { creatingSecret } = useSelector((state: RootStateType) => state.user);

	useEffect(() => {
		setTimeout(() => {
			setAnimating(true);
		}, 20);
	}, []);

	const handleClick = (func: () => void) => {
		setAnimating(false);
		setTimeout(func, 300);
	};

	const handleNewSecretSubmit = (secret: INewUserSecret) => {
		dispatch(createSecret(secret))
			.then(unwrapResult)
			.then(onOk)
			.then(() => createNotification(NotificationType.Success, { message: "Secret created successfully!" }))
			.catch((err) => {
				if (err.code < ErrorType.DefaultErrorsBlockEnd) {
					return;
				}

				if (err.code === ErrorType.DuplicateUserSecretNameFound) {
					createNotification(NotificationType.Error, {
						message: "Duplicate user secret name found. Please provide another name.",
					});
				} else {
					createNotification(NotificationType.UnknownError, {
						error: err.body,
						errorOrigin: "[newSecretModal]~createSecret",
					});
				}
			});
	};

	return (
		<div className={combineClassNames("modal new-secret-modal", { initial: !animating })}>
			<div className="modal-mask" onClick={() => handleClick(onCancel)} />
			<div className="modal-content">
				<div className="modal-title">New Secret</div>

				<NewSecretForm onCancel={onCancel} onSubmit={handleNewSecretSubmit} submitting={creatingSecret} />
			</div>
		</div>
	);
};
